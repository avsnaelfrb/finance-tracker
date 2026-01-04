<script setup lang="ts">
import { ref } from 'vue';
import FormTransaction from '@/components/TransactionFormComponent.vue'; 
import { Plus, X, ArrowUpRight, ArrowDownLeft, Wallet } from 'lucide-vue-next';

const showTransactionModal = ref(false);

const handleSuccessTransaction = () => {
    showTransactionModal.value = false;
};
</script>

<template>
    <div class="w-full max-w-7xl mx-auto animate-fade-in">
    
    <!-- 1. Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Dashboard</h1>
            <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Ringkasan aktivitas keuangan Anda hari ini.</p>
        </div>

        <button 
            @click="showTransactionModal = true"
            class="btn-primary w-full sm:w-auto shadow-lg shadow-brand-500/20 group"
        >
            <Plus class="w-5 h-5 transition-transform group-hover:rotate-90" />
            <span>Tambah Transaksi</span>
        </button>
    </div>

    <!-- 2. Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        <!-- Card: Saldo (Menggunakan .card-base yang sudah diperbaiki bordernya) -->
        <div class="card-base relative overflow-hidden group">
            <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Wallet class="w-24 h-24 text-brand-500" />
            </div>
            <div class="relative z-10">
                <div class="flex items-center gap-3 mb-3">
                    <div class="p-2 bg-brand-50 dark:bg-brand-500/10 rounded-lg text-brand-600 dark:text-brand-400">
                        <Wallet class="w-5 h-5" />
                    </div>
                    <span class="text-xs sm:text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate">Total saldo</span>
                </div>
                <!-- Perbaikan Responsivitas Teks: truncate dan ukuran font dinamis -->
                <h3 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white truncate" title="Rp 0">Rp 0</h3>
                <p class="text-xs text-brand-600 dark:text-brand-400 mt-2 font-medium flex items-center gap-1">
                    <span>+0%</span>
                    <span class="text-gray-400 dark:text-gray-500">dari bulan lalu</span>
                </p>
            </div>
        </div>

        <!-- Card: Pemasukan -->
        <div class="card-base">
            <div class="flex items-center gap-3 mb-4">
                <div class="p-2 bg-emerald-100 dark:bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400">
                    <ArrowDownLeft class="w-5 h-5" />
                </div>
                <span class="text-xs sm:text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate">Pemasukan</span>
            </div>
            <!-- Perbaikan Responsivitas Teks -->
            <h3 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 truncate" title="Rp 0">Rp 0</h3>
            <p class="text-xs text-gray-400 dark:text-gray-500">Bulan Ini</p>
        </div>
        
        <!-- Card: Pengeluaran -->
        <div class="card-base">
            <div class="flex items-center gap-3 mb-4">
                <div class="p-2 bg-red-100 dark:bg-red-500/10 rounded-lg text-red-600 dark:text-red-400">
                    <ArrowUpRight class="w-5 h-5" />
                </div>
                <span class="text-xs sm:text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate">Pengeluaran</span>
            </div>
            <!-- Perbaikan Responsivitas Teks -->
            <h3 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 truncate" title="Rp 0">Rp 0</h3>
            <p class="text-xs text-gray-400 dark:text-gray-500">Bulan Ini</p>
        </div>
    </div>

    <!-- 3. Modal Transaksi -->
    <transition name="fade">
        <div v-if="showTransactionModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <!-- Backdrop -->
            <div class="absolute inset-0 bg-gray-900/60 dark:bg-black/80 backdrop-blur-sm transition-opacity" @click="showTransactionModal = false"></div>
            
            <!-- Modal Content (Border diperbaiki) -->
            <div class="relative w-full max-w-lg bg-white dark:bg-dark-800 rounded-2xl shadow-2xl overflow-hidden transform transition-all flex flex-col max-h-[90vh] border border-gray-100 dark:border-white/10">
                
                <!-- Modal Header -->
                <div class="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-white dark:bg-dark-800 shrink-0">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white">Transaksi Baru</h3>
                    <button 
                        @click="showTransactionModal = false" 
                        class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 transition-colors"
                    >
                        <X class="w-5 h-5" />
                    </button>
                </div>

                <!-- Modal Body -->
                <div class="p-6 overflow-y-auto custom-scrollbar">
                    <FormTransaction 
                        @close="showTransactionModal = false" 
                        @success="handleSuccessTransaction" 
                    />
                </div>
            </div>
        </div>
    </transition>

    </div>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.5s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.5); border-radius: 20px; }
</style>