import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import type { CreateTransactionDTO } from "../types/transactionType.js";
import { createTransactionService } from "../services/transactionService.js";

export const newTransactionController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const body: CreateTransactionDTO = req.body
    const userId = req.user?.id!

    const transaction = await createTransactionService(body, userId)

    res.status(201).json({
        status: 'success',
        message: 'Berhasil membuat transaksi baru',
        data: transaction
    })
})