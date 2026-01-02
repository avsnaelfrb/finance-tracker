import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { categories } from '../models/schema.js'; 

// ==========================================
// 1. DATABASE TYPES (Otomatis dari Drizzle)
// ==========================================

export type Category = InferSelectModel<typeof categories>;

export type NewCategory = InferInsertModel<typeof categories>;


// ==========================================
// 2. API / DTO TYPES (Custom untuk Frontend)
// ==========================================

export type CategoryType = 'INCOME' | 'EXPENSE' | 'TRANSFER';

/**
 * Payload: Apa yang dikirim Frontend saat CREATE (POST)
 * Note: userId tidak masuk sini karena diambil dari Token (req.user)
 */
export interface CreateCategoryRequest {
    name: string;
    type: CategoryType;
}

/**
 * Payload: Apa yang dikirim Frontend saat UPDATE (PATCH/PUT)
 * Note: Partial<> membuat semua property jadi opsional (boleh update nama doang)
 */
export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {}

/**
 * Response: Apa yang kita kirim balik ke Frontend
 * Biasanya sama dengan tipe database, tapi bisa kita bungkus lagi
 */
export interface CategoryResponse {
    id: number;
    name: string;
    type: CategoryType;
    createdAt: Date;
    // updated/userId mungkin tidak perlu dikirim ke frontend kalau tidak dipakai
}