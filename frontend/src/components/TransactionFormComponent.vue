<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { useWalletStore } from '@/stores/walletStore';
import Swal from 'sweetalert2';
import { ChevronDown, Wallet as WalletIcon } from 'lucide-vue-next';
import type { CreateTransactionPayload, TransactionType } from '@/types/globalTypes';

const emit = defineEmits(['close', 'success']);

const transactionStore = useTransactionStore();
const walletStore = useWalletStore();

// Default date menggunakan string YYYY-MM-DD agar SQL langsung menerima
const formData = reactive({
    amount: '',
    type: 'EXPENSE' as TransactionType,
    categoryId: '',
    accountId: '',
    date: new Date().toISOString().slice(0, 10),
    description: ''
});

// Dummy Categories
const categories = computed(() => {
    if (formData.type === 'EXPENSE') {
        return [
            { id: 1, name: 'Makanan & Minuman', icon: '🍔' },
            { id: 2, name: 'Transportasi', icon: '🚗' },
            { id: 3, name: 'Belanja', icon: 'shopping-bag' },
            { id: 4, name: 'Tagihan', icon: 'file-text' },
        ];
    } else {
        return [
            { id: 5, name: 'Gaji', icon: '💵' },
            { id: 6, name: 'Bonus', icon: 'gift' },
            { id: 7, name: 'Investasi', icon: 'trending-up' },
        ];
    }
});

// Helper Format Rupiah (Tampilan saja)
const formatNumber = (n: string) => {
    return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const handleAmountInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    formData.amount = formatNumber(target.value);
};

// Ambil data wallet agar dropdown tidak kosong
onMounted(() => {
    if (walletStore.wallets.length === 0) {
        walletStore.getAllWallet(); 
    }
});

async function handleSubmit() {
    // 1. Validasi Wajib
    if (!formData.accountId || !formData.amount) {
        Swal.fire({
            icon: 'warning',
            title: 'Data Belum Lengkap',
            text: 'Mohon isi nominal dan pilih dompet asal.',
            timer: 2000,
            showConfirmButton: false
        });
        return; 
    }

    try {
        const cleanPayload: CreateTransactionPayload = {
            amount: parseInt(formData.amount.replace(/\./g, '')),
            
            date: formData.date, 
            
            description: formData.description || '', 
            type: formData.type,
            accountId: Number(formData.accountId),
            
            categoryId: formData.categoryId ? Number(formData.categoryId) : null as any,
            
            targetAccountId: null as any 
        };

        const success = await transactionStore.newTransaction(cleanPayload);

        if (success) {
            Swal.fire({
                icon: "success",
                title: 'Berhasil',
                text: 'Transaksi berhasil disimpan',
                timer: 1500,
                showConfirmButton: false
            });
            emit('success');
            
            // Reset form
            formData.amount = '';
            formData.description = '';
            formData.categoryId = ''; 
        }
    } catch (error) {
        console.error(error);
        // Error handling biasanya sudah ada di store, tapi bisa ditambahkan alert disini
    }
}
</script>

<template>
    <!-- Template HTML Tetap Sama -->
    <div class="w-full">
        <!-- Error Message -->
        <div v-if="transactionStore.errMsg" class="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
            {{ transactionStore.errMsg }}
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-5">
            
            <!-- 1. Type Toggle (EXPENSE / INCOME) -->
            <div class="p-1 bg-gray-100 rounded-lg grid grid-cols-2 gap-1">
                <button 
                    type="button"
                    @click="formData.type = 'EXPENSE'"
                    class="py-2 text-sm font-semibold rounded-md transition-all flex items-center justify-center gap-2"
                    :class="formData.type === 'EXPENSE' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
                >
                    Pengeluaran
                </button>
                <button 
                    type="button"
                    @click="formData.type = 'INCOME'"
                    class="py-2 text-sm font-semibold rounded-md transition-all flex items-center justify-center gap-2"
                    :class="formData.type === 'INCOME' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
                >
                    Pemasukan
                </button>
            </div>

            <!-- 2. Input Amount (Big) -->
            <div>
                <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Nominal</label>
                <div class="relative">
                    <span 
                        class="absolute left-0 top-1/2 -translate-y-1/2 text-lg font-bold"
                        :class="formData.type === 'EXPENSE' ? 'text-red-600' : 'text-green-600'"
                    >Rp</span>
                    <input 
                        type="text" 
                        inputmode="numeric"
                        :value="formData.amount"
                        @input="handleAmountInput"
                        placeholder="0"
                        class="w-full pl-8 py-2 text-3xl font-bold bg-transparent border-none focus:ring-0 placeholder:text-gray-300 font-sans"
                        :class="formData.type === 'EXPENSE' ? 'text-red-600' : 'text-green-600'"
                        required
                        autofocus
                    />
                </div>
                <div class="h-px w-full bg-gray-200 mt-1"></div>
            </div>

            <!-- 3. Kategori & Account Grid -->
            <div class="grid grid-cols-2 gap-4">
                <!-- Kategori -->
                <div class="space-y-1.5">
                    <label class="block text-sm font-semibold text-dark-900">Kategori</label>
                    <div class="relative">
                        <select 
                            v-model="formData.categoryId"
                            required
                            class="w-full appearance-none px-3 py-2.5 rounded-lg border border-gray-300 text-dark-900 bg-white focus:outline-none focus:ring-2 focus:border-brand-500 transition-all text-sm"
                            :class="formData.type === 'EXPENSE' ? 'focus:ring-red-100' : 'focus:ring-green-100'"
                        >
                            <option value="" disabled selected>Pilih Kategori</option>
                            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                                {{ cat.icon }} {{ cat.name }}
                            </option>
                        </select>
                        <ChevronDown class="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                    </div>
                </div>

                <!-- Account / Wallet -->
                <div class="space-y-1.5">
                    <label class="block text-sm font-semibold text-dark-900">Dari Dompet</label>
                    <div class="relative">
                        <select 
                            v-model="formData.accountId"
                            required
                            class="w-full appearance-none px-3 py-2.5 rounded-lg border border-gray-300 text-dark-900 bg-white focus:outline-none focus:ring-2 focus:border-brand-500 transition-all text-sm"
                            :class="formData.type === 'EXPENSE' ? 'focus:ring-red-100' : 'focus:ring-green-100'"
                        >
                            <option value="" disabled selected>Pilih Dompet</option>
                            <option v-for="wallet in walletStore.wallets" :key="wallet.id" :value="wallet.id">
                                {{ wallet.name }}
                            </option>
                        </select>
                        <WalletIcon class="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                    </div>
                </div>
            </div>

            <!-- 4. Tanggal & Catatan -->
            <div class="space-y-4">
                <div class="space-y-1.5">
                    <label class="block text-sm font-semibold text-dark-900">Tanggal</label>
                    <div class="relative">
                        <input 
                            v-model="formData.date"
                            type="date"
                            class="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-dark-900 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 text-sm font-sans"
                            required
                        />
                    </div>
                </div>

                <div class="space-y-1.5">
                    <label class="block text-sm font-semibold text-dark-900">Catatan (Opsional)</label>
                    <textarea 
                        v-model="formData.description"
                        rows="2"
                        placeholder="Contoh: Makan siang di warteg..."
                        class="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-dark-900 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 text-sm font-sans resize-none"
                    ></textarea>
                </div>
            </div>

            <!-- Actions -->
            <div class="pt-4 flex gap-3">
                <button 
                    type="button" 
                    @click="$emit('close')"
                    class="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                >
                    Batal
                </button>
                <button 
                    type="submit" 
                    :disabled="transactionStore.isLoading"
                    class="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white font-semibold transition-all shadow-sm disabled:opacity-70"
                    :class="formData.type === 'EXPENSE' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'"
                >
                    <span v-if="transactionStore.isLoading">Menyimpan...</span>
                    <span v-else>Simpan Transaksi</span>
                </button>
            </div>
        </form>
    </div>
</template>