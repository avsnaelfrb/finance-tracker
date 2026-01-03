import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import type { CreateCategoryRequest } from "../types/categoryType.js";
import { createCategoryService, getAllCategoryService } from "../services/categoryService.js";

export const createCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const body: CreateCategoryRequest = req.body;
    const userId = req.user?.id!

    const newCategory = await createCategoryService(body, userId)

    res.status(201).json({
        status: 'success',
        message: 'Berhasil menambahkan category',
        data: newCategory
    })
})

export const getAllCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id!

    const allCategory = await getAllCategoryService(userId)
    res.status(200).json({
        status: 'success',
        message: 'Berhasil mengambil semua kategory',
        data: allCategory
    })
})