<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { useWalletStore } from '@/stores/walletStore';
import { useCategoryStore } from '@/stores/categoryStore'; 
import Swal from 'sweetalert2';
import { ChevronDown, Wallet as WalletIcon } from 'lucide-vue-next';
import type { CreateTransactionPayload, TransactionType, CreateCategoryPayload } from '@/types/globalTypes';

const emit = defineEmits(['close', 'success']);

const transactionStore = useTransactionStore();
const walletStore = useWalletStore();
const categoryStore = useCategoryStore(); 

const formData = reactive({
    amount: '',
    type: 'EXPENSE' as TransactionType,
    categoryId: '',
    accountId: '',
    date: new Date().toISOString().slice(0, 10), 
    description: ''
});

// Computed: Filter kategori sesuai tipe (Pengeluaran/Pemasukan)
const categories = computed(() => {
    return categoryStore.categories.filter((cat: any) => cat.type === formData.type);
});

// Helper Format Rupiah
const formatNumber = (n: string) => {
    return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const handleAmountInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    formData.amount = formatNumber(target.value);
};

// --- LOGIC BARU: BUAT KATEGORI ---
const handleCreateCategory = async () => {
    // Tampilkan Modal Input Sederhana
    const { value: categoryName } = await Swal.fire({
        title: 'Tambah Kategori Baru',
        text: `Untuk ${formData.type === 'EXPENSE' ? 'Pengeluaran' : 'Pemasukan'}`,
        input: 'text',
        inputPlaceholder: 'Contoh: Parkir, Laundry, Bonus',
        showCancelButton: true,
        confirmButtonText: 'Simpan',
        cancelButtonText: 'Batal',
        confirmButtonColor: formData.type === 'EXPENSE' ? '#dc2626' : '#16a34a', // Merah/Hijau sesuai konteks
        inputValidator: (value) => {
            if (!value) {
                return 'Nama kategori harus diisi!'
            }
        }
    });

    if (categoryName) {
        // Construct Payload
        const payload: CreateCategoryPayload = {
            name: categoryName,
            type: formData.type,
        };

        const success = await categoryStore.createCategory(payload);
        
        if (success) {
            // Notifikasi Kecil
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
            Toast.fire({
                icon: 'success',
                title: 'Kategori berhasil ditambahkan'
            });

        }
    }
};
// ---------------------------------

onMounted(() => {
    if (walletStore.wallets.length === 0) walletStore.getAllWallet(); 
    if (!categoryStore.hasCategory) categoryStore.getAllCategory();
});

async function handleSubmit() {
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
            accountId: formData.accountId ? Number(formData.accountId) : null as any,
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
            
            formData.amount = '';
            formData.description = '';
            formData.categoryId = ''; 
        }
    } catch (error) {
        console.error(error);
    }
}
</script>

<template>
    <div class="w-full">
        <!-- Error Alert -->
        <div v-if="transactionStore.errMsg" class="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-2 animate-fade-in">
            {{ transactionStore.errMsg }}
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
            
            <!-- 1. Type Toggle (Modern Segmented Control) -->
            <!-- Menggunakan bg-white/5 untuk dark mode agar tidak terlalu kontras -->
            <div class="p-1.5 bg-gray-100 dark:bg-white/5 rounded-xl grid grid-cols-2 gap-1">
                <button 
                    type="button"
                    @click="formData.type = 'EXPENSE'; formData.categoryId = ''"
                    class="py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                    :class="formData.type === 'EXPENSE' ? 'bg-white dark:bg-dark-800 text-red-600 shadow-sm ring-1 ring-black/5 dark:ring-white/10' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
                >
                    Pengeluaran
                </button>
                <button 
                    type="button"
                    @click="formData.type = 'INCOME'; formData.categoryId = ''"
                    class="py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                    :class="formData.type === 'INCOME' ? 'bg-white dark:bg-dark-800 text-green-600 shadow-sm ring-1 ring-black/5 dark:ring-white/10' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
                >
                    Pemasukan
                </button>
            </div>

            <!-- 2. Input Amount (Large & Clean) -->
            <div class="space-y-2">
                <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nominal Transaksi</label>
                <div class="relative group">
                    <span 
                        class="absolute left-0 top-1/2 -translate-y-1/2 text-2xl font-bold transition-colors"
                        :class="formData.type === 'EXPENSE' ? 'text-red-500' : 'text-green-500'"
                    >Rp</span>
                    <input 
                        type="text" 
                        inputmode="numeric"
                        :value="formData.amount"
                        @input="handleAmountInput"
                        placeholder="0"
                        class="w-full pl-10 py-2 text-4xl font-bold bg-transparent border-none focus:ring-0 placeholder:text-gray-300 dark:placeholder:text-gray-700 font-sans transition-colors text-gray-900 dark:text-white"
                        required
                        autofocus
                    />
                </div>
                <!-- Divider (Halus) -->
                <div class="h-px w-full bg-gray-200 dark:bg-white/10"></div>
            </div>

            <!-- 3. Kategori & Account Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                <!-- Kategori Selection -->
                <div class="space-y-1.5">
                    <div class="flex items-center justify-between">
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">Kategori</label>
                        <!-- Button Tambah Kategori -->
                        <button 
                            type="button" 
                            @click="handleCreateCategory"
                            class="text-xs font-bold hover:underline transition-colors"
                            :class="formData.type === 'EXPENSE' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'"
                        >
                            + Buat Baru
                        </button>
                    </div>
                    
                    <div class="relative">
                        <!-- Border menggunakan white/10 di dark mode -->
                        <select 
                            v-model="formData.categoryId"
                            required
                            class="w-full appearance-none px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white bg-white dark:bg-dark-900/50 focus:outline-none focus:ring-2 transition-all text-sm cursor-pointer"
                            :class="formData.type === 'EXPENSE' ? 'focus:border-red-500 focus:ring-red-500/20' : 'focus:border-green-500 focus:ring-green-500/20'"
                        >
                            <option value="" disabled selected>Pilih Kategori</option>
                            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                                {{ (cat as any).icon || '' }} {{ cat.name }}
                            </option>
                        </select>
                        <ChevronDown class="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    
                    <!-- Helper Text -->
                    <p v-if="categories.length === 0" class="text-xs text-gray-400">
                        Belum ada kategori. Klik "+ Buat Baru".
                    </p>
                </div>

                <!-- Account / Wallet Selection -->
                <div class="space-y-1.5">
                    <div class="flex items-center justify-between h-[20px]"> 
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">Dompet</label>
                    </div>
                    
                    <div class="relative">
                        <select 
                            v-model="formData.accountId"
                            required
                            class="w-full appearance-none px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white bg-white dark:bg-dark-900/50 focus:outline-none focus:ring-2 transition-all text-sm cursor-pointer"
                            :class="formData.type === 'EXPENSE' ? 'focus:border-red-500 focus:ring-red-500/20' : 'focus:border-green-500 focus:ring-green-500/20'"
                        >
                            <option value="" disabled selected>Pilih Dompet</option>
                            <option v-for="wallet in walletStore.wallets" :key="wallet.id" :value="wallet.id">
                                {{ wallet.name }}
                            </option>
                        </select>
                        <WalletIcon class="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>
            </div>

            <!-- 4. Tanggal & Catatan -->
            <div class="space-y-4">
                <div class="space-y-1.5">
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">Tanggal</label>
                    <div class="relative">
                        <input 
                            v-model="formData.date"
                            type="date"
                            class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white bg-white dark:bg-dark-900/50 focus:outline-none focus:ring-2 text-sm font-sans"
                            :class="formData.type === 'EXPENSE' ? 'focus:ring-red-500/20 focus:border-red-500' : 'focus:ring-green-500/20 focus:border-green-500'"
                            required
                        />
                    </div>
                </div>

                <div class="space-y-1.5">
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">Catatan <span class="text-gray-400 font-normal">(Opsional)</span></label>
                    <textarea 
                        v-model="formData.description"
                        rows="2"
                        placeholder="Keterangan transaksi..."
                        class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white bg-white dark:bg-dark-900/50 focus:outline-none focus:ring-2 text-sm font-sans resize-none"
                        :class="formData.type === 'EXPENSE' ? 'focus:ring-red-500/20 focus:border-red-500' : 'focus:ring-green-500/20 focus:border-green-500'"
                    ></textarea>
                </div>
            </div>

            <!-- Actions -->
            <div class="pt-4 flex gap-3">
                <button 
                    type="button" 
                    @click="$emit('close')"
                    class="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                >
                    Batal
                </button>
                <button 
                    type="submit" 
                    :disabled="transactionStore.isLoading"
                    class="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white font-bold transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                    :class="formData.type === 'EXPENSE' ? 'bg-red-600 hover:bg-red-700 shadow-red-500/30' : 'bg-green-600 hover:bg-green-700 shadow-green-500/30'"
                >
                    <span v-if="transactionStore.isLoading" class="flex items-center gap-2">
                        <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Menyimpan...
                    </span>
                    <span v-else>Simpan Transaksi</span>
                </button>
            </div>
        </form>
    </div>
</template>