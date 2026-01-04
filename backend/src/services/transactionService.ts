import { db } from "../config/dbConfig.js";
import Big from "big.js";
import type { CreateTransactionDTO } from "../types/transactionType.js";
import AppError from "../utils/appError.js";
import { accounts, transactions } from "../models/schema.js";
import { and, eq } from "drizzle-orm";
import { sanitizeCurrency } from "../utils/currencyHeleper.js";

export const createTransactionService = async (data: CreateTransactionDTO, userId: number) => {
    if (!data.accountId) {
        throw new AppError('Harap pilih akun (wallet)', 400);
    }
    
    const amountStr = data.amount.toString();
    const cleanAmount = sanitizeCurrency(amountStr)
    try {
        const checkBig = new Big(cleanAmount);
        if (checkBig.lte(0)) throw new Error(); 
    } catch (e) {
        throw new AppError('Jumlah transaksi harus berupa angka positif', 400);
    }

    const amount = new Big(cleanAmount);

    const result = await db.transaction(async (tx) => {
        
        // --- STEP A: Ambil Akun Asal (Locking Logic could be added here) ---
        const sourceAccountData = await tx.select()
            .from(accounts)
            .where(and(eq(accounts.id, data.accountId), eq(accounts.userId, userId)))
            .limit(1);

        const sourceAccount = sourceAccountData[0]; 

        if (!sourceAccount) {
            throw new AppError(`Akun asal tidak ditemukan atau bukan milik anda`, 404);
        }

        const currentBalance = new Big(sourceAccount.balance);
        let newSourceBalance: Big;

        // --- STEP B: Kalkulasi Saldo Berdasarkan Tipe ---
        if (data.type === 'INCOME') {
            newSourceBalance = currentBalance.plus(amount);

        } else if (data.type === 'EXPENSE') {
            if (currentBalance.lt(amount)) {
                throw new AppError('Saldo tidak mencukupi untuk pengeluaran ini', 400);
            }
            newSourceBalance = currentBalance.minus(amount);

        } else if (data.type === 'TRANSFER') {
            if (!data.targetAccountId) throw new AppError('Akun tujuan wajib diisi untuk transfer', 400);
            if (data.targetAccountId === data.accountId) throw new AppError('Tidak bisa transfer ke akun yang sama', 400);

            if (currentBalance.lt(amount)) {
                throw new AppError('Saldo tidak mencukupi untuk transfer', 400);
            }

            const targetAccountData = await tx.select()
                .from(accounts)
                .where(and(eq(accounts.id, data.targetAccountId), eq(accounts.userId, userId)))
                .limit(1);

            const targetAccount = targetAccountData[0];

            if (!targetAccount) {
                throw new AppError('Akun tujuan transfer tidak ditemukan', 404);
            }

            newSourceBalance = currentBalance.minus(amount); 
            const targetCurrentBalance = new Big(targetAccount.balance);
            const newTargetBalance = targetCurrentBalance.plus(amount);

            await tx.update(accounts)
                .set({ balance: newTargetBalance.toFixed(2) })
                .where(eq(accounts.id, data.targetAccountId));
        
        } else {
             throw new AppError('Tipe transaksi tidak valid', 400);
        }

        // --- STEP C: Update Akun Asal (Berlaku untuk Income, Expense, & Transfer) ---
        await tx.update(accounts)
            .set({ balance: newSourceBalance!.toFixed(2) }) 
            .where(eq(accounts.id, data.accountId));

        // --- STEP D: Insert History Transaksi (HARUS DI DALAM TX) ---
        const [insertResult] = await tx.insert(transactions).values({
            userId: userId,
            type: data.type,
            accountId: data.accountId,
            categoryId: data.categoryId || null,
            targetAccountId: (data.type === 'TRANSFER' && data.targetAccountId) ? data.targetAccountId : null,
            amount: amount.toFixed(2),
            date: data.date ? new Date(data.date) : new Date(),
            description: data.description || null
        });

        return {
            id: insertResult.insertId,
            ...data,
            amount: amount.toFixed(2)
        };
    });

    return result;
}

