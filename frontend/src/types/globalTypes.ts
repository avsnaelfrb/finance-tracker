// Tipe untuk User (berdasarkan tabel users)
export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterUserPayload {
  name: string,
  email: string,
  password: string,
}
// Enum untuk tipe Wallet (berdasarkan pgEnum di schema.ts)
export type WalletType = 'CASH' | 'BANK' | 'WALLET' | 'CREDIT_CARD';

// Tipe untuk Wallet (berdasarkan tabel wallets)
export interface Wallet {
  id: number;
  name: string;
  type: WalletType;
  balance: string; 
  currency: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

// Tipe Payload untuk membuat Wallet baru (tanpa ID dan timestamps)
export interface CreateWalletPayload {
  name: string;
  type: WalletType;
  balance: string;
  currency?: string | 'IDR'; 
}

// Standarisasi Response API (Generic)
export interface ApiResponse<T> {
  status: string;
  message?: string;
  data: T;
}

// Transaction type -----------------------------------------------------------------

export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';

// Tipe untuk Transaction (berdasarkan tabel transactions)
export interface Transaction {
  id: number;
  amount: string; 
  date: string; 
  description: string | null;
  type: TransactionType;
  userId: number;
  accountId: number; 
  categoryId: number | null;
  targetAccountId: number | null; 
  createdAt: string;
  updatedAt: string;
}

// Tipe Payload untuk membuat Transaksi baru
export interface CreateTransactionPayload {
  amount: number;
  date: string;
  description?: string;
  type: TransactionType;
  accountId: number;
  categoryId?: number;
  targetAccountId?: number;
}


// Tipe untuk Category (berdasarkan tabel categories)
export interface Category {
  id: number;
  name: string;
  type: TransactionType; // Menggunakan enum yang sama dengan Transaction
  userId: number;
  createdAt: string;
  updatedAt: string;
}

// Tipe Payload untuk membuat Category baru
export interface CreateCategoryPayload {
  name: string;
  type: TransactionType;
}