import { eq, ne } from "drizzle-orm";
import { db } from "../config/dbConfig.js";
import { users } from "../models/schema.js";
import AppError from "../utils/appError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import 'dotenv/config'

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

export const loginService = async (data: userReq) => {
    if (!data.email.includes('@')) {
        throw new AppError('Format Email yang anda masukkan salah', 400)
    }

    const password = data.password;
    if (!password || !data.email) {
        throw new AppError('Password dan Email harus diisi', 400)
    }

    const result = await db.select().from(users).where(eq(users.email, data.email)).limit(1)
    const user = result[0]
    if (!user) {
        throw new AppError('User tidak ditemukan, Harap masukkan email yang valid', 404)
    }

    const comparePassword = await bcrypt.compare(password, user.password)
    if (!comparePassword) {
        throw new AppError('Passowrd atau Email salah', 400)
    }

    const payload = { id: user.id, role: user.role }
    const secret = process.env.JWT_SECRET!
    const token = jwt.sign(payload, secret, { expiresIn: '1d' })
    
    return token;
}

export const getByIdService = async (userId: number) => {
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1)
    const result = user[0]
    return result
}