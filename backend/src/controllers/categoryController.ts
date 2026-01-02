import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import type { CreateCategoryRequest } from "../types/categoryType.js";
import { createCategoryService } from "../services/categoryService.js";

export const createCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const body: CreateCategoryRequest = req.body;
    const id = req.user?.id
    const userId =  Number(id)

    const newCategory = await createCategoryService(body, userId)

    res.status(201).json({
        status: 'success',
        message: 'Berhasil menambahkan category',
        data: newCategory
    })
})

