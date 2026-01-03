// src/types/transaction.types.ts
import { transactions, accounts } from '../models/schema.js'; // sesuaikan path schema kamu
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';

// 1. Tipe Transaksi persis seperti di Database (Output dari Select)
export type Transaction = InferSelectModel<typeof transactions>;

// 2. Tipe Akun persis seperti di Database
export type Account = InferSelectModel<typeof accounts>;

// 3. Enum untuk Tipe Transaksi (Biar gak typo string 'INCOME' vs 'income')
export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';

// Helper: Tipe Kolom Decimal biasanya string di JS/TS untuk presisi
export type DecimalString = string;


export interface CreateTransactionDTO {
  amount: string; 
  description?: string;
  date?: any; 
  type: TransactionType;
  accountId: number;
  categoryId?: number; // Optional, biasanya null kalau Transfer
  
  targetAccountId?: number; // Wajib diisi jika type === 'TRANSFER'
}

/**
 * Payload untuk Update Transaksi (Jaga-jaga kalau butuh edit deskripsi/kategori)
 * Biasanya amount/account tidak boleh diedit sembarangan karena ribet logic saldonya.
 */
export interface UpdateTransactionDTO {
  description?: string;
  categoryId?: number;
  date?: string;
}

/**
 * Query Parameters untuk Get All Transactions (Filter & Pagination)
 */
export interface TransactionQueryParams {
  page?: number;       
  limit?: number;      
  startDate?: string;  
  endDate?: string;
  type?: TransactionType; 
  accountId?: number;     
  categoryId?: number;    
  search?: string;       
}

/**
 * Struktur standar data Transaksi yang dikirim ke frontend.
 * Seringkali kita perlu join nama Category dan nama Account biar frontend gak cuma dapet ID.
 */
export interface TransactionResponse extends Transaction {
  accountName?: string;
  targetAccountName?: string | null;
  categoryName?: string | null;
}

/**
 * Format Pagination Standar
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;      // Total semua item di DB (sesuai filter)
    page: number;       // Halaman saat ini
    limit: number;      // Item per halaman
    totalPages: number; // Total halaman yang tersedia
  };
}
// Cara pakainya nanti: PaginatedResponse<TransactionResponse>


/**
 * Hasil return dari Service Create Transaction
 */
export interface CreateTransactionResult {
    transaction: Transaction;
    updatedAccountBalance: {
      accountId: number;
      newBalance: string; // Decimal string
    };
    // Jika transfer, ada akun kedua yg berubah
    updatedTargetAccountBalance?: {
      accountId: number;
      newBalance: string;
    };
  }