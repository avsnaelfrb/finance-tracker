import AppError from "../utils/appError.js";
import prisma from "../config/prismaConfig.js";
import bcrypt from "bcrypt";

export interface userReq {
    name: string;
    email: string;
    password: string;
}
export const registerService = async (data: userReq) => {
    if (data.name.length <= 5) {
        throw new AppError('Nama harus lebih dari 5 huruf', 400)
    }

    const existUser = await prisma.user.findUnique({
        where: { email: data.email }
    })

    if (existUser) {
        throw new AppError('Email sudah terdaftar, silahkan login atau daftar dengan email lain', 400)
    }

    if (!data.email.includes('@')) {
        throw new AppError('Format Email yang anda masukkan salah', 400)
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(salt, data.password)

    return await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword
        }
    })
}