import type { NextFunction, Request, Response } from "express"
import { catchAsync } from "../utils/catchAsync.js"
import { getByIdService, loginService, registerService, type userReq } from "../services/userService.js"

export const register = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const body: userReq = req.body;

    const newUser = await registerService(body)

    const { ...userData } = newUser;
    delete (userData as any).password;

    res.status(201).json({
        status: 'success',
        message: 'Berhasil melakukan Registrasi, silahkan login',
        data: newUser
    })
}) 

export const login = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const body: userReq = req.body;

    const user = await loginService(body)

    res.status(200).json({
        status: 'success',
        message: 'Berhasil login',
        data: user,
    })
})

export const getById = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const id = req.user?.id
    const userId = Number(id)

    const getUser = await getByIdService(userId)

    res.status(200).json({
        status: 'success',
        message: `berhasil mengambil data user dengan id ${userId}`,
        data: getUser
    })
})