import { eq } from "drizzle-orm";
import { db } from "../config/dbConfig.js";
import { users } from "../../drizzle/schema.js";
import AppError from "../utils/appError.js";
import bcrypt from "bcrypt";

export interface userReq {
    name?: string;
    email: string;
    password: string;
}

export const registerService = async (data: userReq) => {
    const username = data.name
    if (username != undefined) {        
        if (username.length <= 0) {
            throw new AppError('Harap masukkan username', 400)
        } else if (username.length <= 4) {
            throw new AppError('Username minimal 5 huruf', 400)
        }
    }

    const existingUsers = await db
        .select()
        .from(users)
        .where(eq(users.email, data.email))
        .limit(1);

    if (existingUsers.length > 0) {
        throw new AppError('Email sudah terdaftar, silahkan login atau daftar dengan email lain', 400)
    }

    if (!data.email.includes('@')) {
        throw new AppError('Format Email yang anda masukkan salah', 400)
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(data.password, salt)

    const result = await db.insert(users).values({
        name: data.name,
        email: data.email,
        password: hashedPassword,
    })

    const insertId = result[0].insertId;
    const [newUser] = await db.select().from(users).where(eq(users.id, insertId)).limit(1)

    return newUser;
}