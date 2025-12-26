import { eq } from "drizzle-orm";
import { db } from "../config/dbConfig.js";
import { accounts, users } from "../models/schema.js";
import AppError from "../utils/appError.js";
import Big from "big.js";
import type { UserPayload } from "../middleware/authMiddleware.js";

export interface ReqWallet {
    id: number;
    name: string;
    type: 'CASH' | 'BANK' | 'CREDIT_CARD' | 'WALLET' | 'INVESTMENT';
    balance: string;
    currency: string;
}

export const createWalletService = async (data: ReqWallet, userId: UserPayload['id']) => {
    const user = await db.select().from(users).where(eq(users.id, userId))
    if (!user) {
        throw new AppError('User tidak ditemukan', 404)
    }

    if (data.name == undefined) {
        throw new AppError('Harap masukkan nama dompet anda', 400)
    }

    if (!data.type) {
        throw new AppError('Harap masukkan tipe akun dompet anda', 400)
    }

    if (data.type !== "CASH" || "BANK" || "CREDIT_CARD" || "WALLET" || 'INVESTMENT' ) {
        throw new AppError('Masukkan type account yang valid', 400)
    }

    const inputSaldo = data.balance
    const forbiddenChars = ["@", "!", "*", "#", "$", "%", "^", "&", "(", ")", "~", "`", "-", "_", "+", "+", "[", "]", "{", "}", "'", "?", "<", ">", "/", "|"]

    const invalidInput = forbiddenChars.some(char => inputSaldo.includes(char))
    if (invalidInput) {
        throw new AppError('Hanya boleh menggunakan simbol "." (titik)', 400)
    }

    const amount = new Big(inputSaldo)
    if (amount.lt(0)) {
        throw new AppError('Saldo tidak boleh mines', 400)
    }

    if (amount.gt("999999999999999.99")) {
        throw new AppError('Saldo melebihi batas maksimal', 400)
    }

    const finalAmount = amount.toFixed(2)

    const result = await db.insert(accounts).values({
        name: data.name,
        type: data.type,
        balance: finalAmount,
        currency: data.currency,
        userId: userId
    })

    const insertId = result[0].insertId;
    const [newAccount] = await db.select().from(accounts).where(eq(accounts.id, insertId)).limit(1)

    return newAccount
}