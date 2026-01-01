<script setup lang="ts">
import { useWalletStore } from '@/stores/walletStore';
import { type CreateWalletPayload, type WalletType } from '@/types/globalTypes';
import Swal from 'sweetalert2';
import { reactive, ref } from 'vue';

const optionType: WalletType[] = [
    'CASH', 'BANK', 'CREDIT_CARD', 'WALLET'
]

const formWallet = reactive<CreateWalletPayload>({
    name: '',
    type: 'CASH',
    balance: ''
})
const walletStore = useWalletStore()

async function handleCreate() {
    if (!formWallet.name) {
        Swal.fire('Error', 'Nama dompet harus diisi', 'error');
        return;
    }

    const cleanedBalance = formWallet.balance.toString().replace(/\./g, '').replace(",", ".")
    const payload = {
        ...formWallet,
        balance : cleanedBalance
    }
    const isSuccess = await walletStore.createWallet(payload);

    if (isSuccess) {
        Swal.fire({
            icon: "success",
            title: 'Berhasil',
            text: "Dompet berhasil dibuat",
            timer: 1500,
            showConfirmButton: false
        });
        formWallet.name = '';
        formWallet.balance = '';
    } else {
        Swal.fire({
            icon: "error",
            title: 'Gagal',
            text: walletStore.errMsg || 'Terjadi kesalahan sistem'
        });
    }
}
</script>

<template>
    <div class="w-full max-w-lg mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
        
        <!-- Header Section -->
        <div class="mb-8">
            <h2 class="text-2xl font-bold text-dark-900 font-sans">Buat Dompet Baru</h2>
            <p class="text-gray-500 text-sm mt-1">Tambahkan akun kas, bank, atau e-wallet untuk mencatat keuangan.</p>
        </div>

        <!-- Alert Error (Hanya muncul jika ada error) -->
        <div v-if="walletStore.errMsg" class="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 flex items-start gap-3">
            <div class="text-red-600 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
            </div>
            <p class="text-sm font-medium text-red-600">{{ walletStore.errMsg }}</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleCreate" class="space-y-6">
            
            <!-- 1. Input Nama Dompet -->
            <div class="space-y-1.5">
                <label for="walletName" class="block text-sm font-semibold text-dark-900">
                    Nama Dompet
                </label>
                <input 
                    id="walletName"
                    v-model="formWallet.name"
                    type="text" 
                    placeholder="Contoh: Tabungan BCA, Dompet Saku"
                    class="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-dark-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-sans"
                    required
                />
            </div>

            <!-- 2. Pilihan Tipe Dompet (Grid Layout) -->
            <div class="space-y-1.5">
                <label class="block text-sm font-semibold text-dark-900">
                    Tipe Akun
                </label>
                <div class="grid grid-cols-2 gap-3">
                    <div 
                        v-for="type in optionType" 
                        :key="type"
                        @click="formWallet.type = type"
                        class="cursor-pointer relative px-4 py-3 rounded-lg border text-sm font-medium transition-all flex items-center justify-center capitalize select-none"
                        :class="[
                            formWallet.type === type 
                                ? 'border-brand-600 bg-brand-50 text-brand-700 ring-1 ring-brand-600' 
                                : 'border-gray-200 bg-white text-gray-600 hover:border-brand-300 hover:bg-gray-50'
                        ]"
                    >
                        <!-- Menghilangkan underscore agar lebih rapi (ex: credit_card -> credit card) -->
                        {{ type.replace('_', ' ') }}
                    </div>
                </div>
            </div>

            <!-- 3. Input Saldo Awal -->
            <div class="space-y-1.5">
                <label for="balance" class="block text-sm font-semibold text-dark-900">
                    Saldo Awal
                </label>
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span class="text-gray-500 font-medium sm:text-sm">Rp</span>
                    </div>
                    <input 
                        id="balance"
                        v-model="formWallet.balance"
                        type="text"
                        inputmode="numeric" 
                        placeholder="ex: 100.000.000"
                        class="w-full pl-11 pr-4 py-2.5 rounded-lg border border-gray-300 text-dark-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-sans"
                        required
                    />
                </div>
            </div>

            <!-- Submit Button -->
            <div class="pt-2">
                <button 
                    type="submit" 
                    :disabled="walletStore.isLoading"
                    class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold transition-all shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed focus:ring-4 focus:ring-brand-500/30"
                >
                    <!-- Loading Spinner -->
                    <svg v-if="walletStore.isLoading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{{ walletStore.isLoading ? 'Menyimpan...' : 'Simpan Dompet' }}</span>
                </button>
            </div>
        </form>
    </div>
</template>