import { eq } from "drizzle-orm";
import { db } from "../config/dbConfig.js";
import { accounts, users } from "../models/schema.js";
import AppError from "../utils/appError.js";
import Big from "big.js";
import type { UserPayload } from "../middleware/authMiddleware.js";

export interface ReqWallet {
    id: number;
    name: string;
    type: Type;
    balance: string;
    currency: string;
}

export enum Type {
    CASH = "CASH",
    BANK = "BANK",
    CREDIT_CARD = "CREDIT_CARD",
    WALLET = "WALLET",
    INVESTMENT = "INVESTMENT" 
}

export const createWalletService = async (data: ReqWallet, userId: UserPayload['id']) => {
    if (data.name == undefined) {
        throw new AppError('Harap masukkan nama dompet anda', 400)
    }

    if (!data.type) {
        throw new AppError('Harap masukkan tipe akun dompet anda', 400)
    }

    const validType = Object.values(Type) as string[]
    if (!validType.includes(data.type as string)) {
        throw new AppError('Masukkan type account yang valid', 400)
    }

    const inputSaldo = data.balance
    const whiteList = /^[0-9]+(\.)?([0-9]{1,2})?$/

    if (!whiteList.test(inputSaldo)) {
        throw new AppError('Format saldo tidak valid', 400)
    }

    const amount = new Big(inputSaldo)
    if (amount.lt(0)) {
        throw new AppError('Saldo tidak boleh mines', 400)
    }

    if (amount.gt("999999999999999.99")) {
        throw new AppError('Saldo melebihi batas maksimal', 400)
    }

    const finalAmount = amount.toFixed(2)

    try {
        const result = await db.insert(accounts).values({
            name: data.name,
            type: data.type,
            balance: finalAmount,
            currency: data.currency,
            userId: userId
        })
    
        const newAccount = {
            id: result[0].insertId,
            name: data.name,
            type: data.type,
            balance: finalAmount,
            currency: data.currency,
            userId,
            createdAt: new Date(), 
            updatedAt: new Date()
        }
    
        return newAccount

    } catch (error: any) {

        if (error.code == '1452') {
            throw new AppError('User tidak ditemukan', 404)
        }

        if (error.code == 'ER_DUP_ENTRY') {
            throw new AppError('error duplicate unique key', 400)
        }

        throw error
    }
}