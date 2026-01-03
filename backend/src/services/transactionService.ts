import { db } from "../config/dbConfig.js";
import Big from "big.js";
import type { Account, CreateTransactionDTO, CreateTransactionResult, Transaction } from "../types/transactionType.js";
import AppError from "../utils/appError.js";
import { accounts, transactions } from "../models/schema.js";
import { and, eq, sql } from "drizzle-orm";

export const createTransactionService = async (data: CreateTransactionDTO, userId: number) => {
    if (!data.accountId) {
        throw new AppError('Harap masukkan account wallet anda', 400)
    }

    const account = await db.query.accounts.findFirst({
        where: ( and(
            eq(accounts.id, data.accountId),
            eq(accounts.userId, userId))
        ) 
    })
    if (!account) {
        throw new AppError(`Anda tidak memiliki akun dengan id ${data.accountId}`, 404)
    }

    const inputTransaksi = data.amount.toString()
    const whiteList = /^[0-9]+(\.)?([0-9]{1,2})?$/

    if (!whiteList.test(inputTransaksi)) {
        throw new AppError('Format transaksi tidak valid', 400)
    }
    const sanitize = inputTransaksi.replace(/\./g, '')
    const amount = new Big(sanitize)
    if (amount.lt(0)) {
        throw new AppError('Saldo tidak boleh mines', 400)
    }

    if (amount.gt("999999999999999.99")) {
        throw new AppError('Saldo melebihi batas maksimal', 400)
    }

    const finalAmount = amount.toFixed(2)

    await db.transaction(async (tx) => {
        if (data.type == 'EXPENSE' || data.type == 'INCOME') {
            const accountBalance = await tx.select({
                balance: accounts.balance
            }).from(accounts).where(eq(accounts.id, data.accountId)).limit(1)
            const balance = accountBalance.toString()
            if (balance < sanitize) {
                throw new AppError('Saldo dari akun tersebut tidak cukup', 400)
            }
            const amountBalance = amount.plus(balance)
            const finalBalance = amountBalance.toFixed(2)
    
            return await tx.update(accounts).set({ balance: sql`${finalBalance}`}).where(eq(accounts.id, data.accountId))
        } else if (data.type == 'TRANSFER' && data.targetAccountId) {
            const accountBalance = await tx.select({
                balance: accounts.balance
            }).from(accounts).where(eq(accounts.id, data.accountId)).limit(1)
            const balance = accountBalance.toString()
            if (balance < sanitize) {
                throw new AppError('Saldo dari akun tersebut tidak cukup', 400)
            }

            const targetAccountBalance = await tx.select({
                balance: accounts.balance
            }).from(accounts).where(eq(accounts.id, data.targetAccountId)).limit(1)
            const targetBalance = targetAccountBalance.toString()
            const targetAmount = amount.plus(targetBalance)
            const balanceAmount = amount.minus(balance)
            const finalBalanceAmount = balanceAmount.toFixed(2)
            const finalTargetAmount = targetAmount.toFixed(2)

            const setAccountBalance = await tx.update(accounts).set({balance: sql`${finalBalanceAmount}`}).where(eq(accounts.id, data.accountId))
            const setTargetAccountBalance = await tx.update(accounts).set({ balance: sql`${finalTargetAmount}` }).where(eq(accounts.id, data.targetAccountId))
            return { setAccountBalance, setTargetAccountBalance }
        }
    })

    const result = await db.insert(transactions).values({
        userId: userId,
        type: data.type,
        targetAccountId: data.targetAccountId,
        accountId: data.accountId,
        amount: finalAmount,
        date: data.date
    })

    const newTransaction = {
        id: result[0].insertId,
        accountId: data.accountId,
        targetAccountId: data.targetAccountId || 'null',
        amount: finalAmount,
        type: data.type
    }

    return newTransaction
}

