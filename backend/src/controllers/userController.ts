import type { NextFunction, Request, Response } from "express"
import { catchAsync } from "../utils/catchAsync.js"
import { registerService, type userReq } from "../services/userService.js"

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