import type { NextFunction, Request, Response } from "express";
import { createWalletService, type ReqWallet } from "../services/walletService.js";
import { catchAsync } from "../utils/catchAsync.js";

export const createWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const body: ReqWallet = req.body;

    const newWallet = await createWalletService(body, req.user?.id!)

    res.status(201).json({
        status: 'success',
        message: 'Berhasil menambahkan akun dompet',
        data: newWallet
    })
})