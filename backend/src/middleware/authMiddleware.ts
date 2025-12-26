import jwt from "jsonwebtoken";
import { catchAsync } from "../utils/catchAsync.js";
import type { NextFunction, Request, Response } from "express";
import 'dotenv/config'
import AppError from "../utils/appError.js";

interface UserPayload {
    id: number;
    role: string;
    iat?: string;
    exp?: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload
        }
    }
}

export const verifyToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const JWT_SECRET = process.env.JWT_SECRET!

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AppError('Akses ditolak, token tidak ditemukan atau format salah', 400)
    } 

    const token = authHeader.split(" ")[1]
    if (!token) {
        throw new AppError('Token tidak valid', 401)
    }

    const decoded = jwt.verify(token, JWT_SECRET) as unknown as UserPayload
    req.user = decoded

    next()
})