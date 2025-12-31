import type { NextFunction, Request, Response } from "express";
import { createWalletService, getByIdService, type ReqWallet } from "../services/walletService.js";
import { catchAsync } from "../utils/catchAsync.js";

export const createWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const body: ReqWallet = req.body;

    // console.log("Header Auth:", req.headers.authorization);
    // console.log("Isi Req User:", req.user);
    const newWallet = await createWalletService(body, req.user?.id!)

    res.status(201).json({
        status: 'success',
        message: 'Berhasil menambahkan akun dompet',
        data: newWallet
    })
})

export const getById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const userId = req.user?.id!
    const accountId = Number(id)

    const getAccount = await getByIdService(accountId, userId)

    res.status(200).json({
        status: 'success',
        message: 'Berhasil mengambil data account',
        data: getAccount
    })
})