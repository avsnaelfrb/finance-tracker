import { eq } from "drizzle-orm";
import { db } from "../config/dbConfig.js";
import { categories } from "../models/schema.js";
import type { CategoryType, CreateCategoryRequest } from "../types/categoryType.js";
import AppError from "../utils/appError.js";

export const createCategoryService = async (data: CreateCategoryRequest, userId: number) => { 
    
    if (!data.name || !data.type) {
        throw new AppError('Nama atau Type categori tidak boleh kosong', 400)
    }
    
    if (data.type != 'INCOME' && data.type != 'EXPENSE' && data.type != 'TRANSFER') {
        throw new AppError('Type tidak valid', 400)
    }

    const result = await db.insert(categories).values({
        name: data.name,
        type: data.type,
        userId: userId
    })

    const insertId = result[0].insertId;
    const newCategory = await db.select().from(categories).where(eq(categories.id, insertId))
    return newCategory
}
