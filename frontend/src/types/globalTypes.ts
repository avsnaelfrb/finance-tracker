// Tipe untuk User (berdasarkan tabel users)
export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
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