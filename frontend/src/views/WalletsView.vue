<script setup lang="ts">
import { useWalletStore } from '@/stores/walletStore';
import { type WalletType } from '@/types/globalTypes';
import { CreditCard, Landmark, Plus, Smartphone, Wallet, WalletCards, X, MoreVertical } from 'lucide-vue-next';
import { ref } from 'vue';
import CreateWalletForm from '@/components/WalletFormComponent.vue'

const walletStore = useWalletStore()
const showModal = ref(false)

const formatRupiah = (value: number | string) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(Number(value));
};

const getIcon = (type: WalletType) => {
    switch(type) {
        case 'BANK': return Landmark;
        case 'CREDIT_CARD': return CreditCard;
        case 'WALLET': return Smartphone;
        default: return Wallet; // cash
    }
};

// Update: Menambahkan support dark mode untuk background icon
const getIconColorClass = (type: WalletType) => {
    switch(type) {
        case 'BANK': return 'bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400';
        case 'CREDIT_CARD': return 'bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400';
        case 'WALLET': return 'bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400';
        default: return 'bg-brand-100 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400'; // cash
    }
};

const handleSuccessCreate = () => {
    showModal.value = false;
};
</script>

<template>
    <div class="w-full max-w-7xl mx-auto animate-fade-in">
        
        <!-- 1. Header Page -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Dompet Saya</h1>
                <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Kelola semua sumber dana Anda di satu tempat.</p>
            </div>
            
            <!-- Tombol Tambah (Muncul jika ada data) -->
            <button 
                v-if="walletStore.wallets && walletStore.wallets.length > 0"
                @click="showModal = true"
                class="btn-primary w-full sm:w-auto shadow-lg shadow-brand-500/20 group"
            >
                <Plus class="w-5 h-5 transition-transform group-hover:rotate-90" />
                <span>Tambah Dompet</span>
            </button>
        </div>

        <!-- STATE 1: LOADING -->
        <div v-if="walletStore.isLoading" class="flex justify-center py-20">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600 dark:border-brand-400"></div>
        </div>

        <!-- STATE 2: EMPTY STATE -->
        <div 
            v-else-if="!walletStore.hasWallet" 
            class="flex flex-col items-center justify-center py-20 bg-white dark:bg-dark-800 rounded-2xl border border-dashed border-gray-300 dark:border-white/10 text-center transition-colors"
        >
            <div class="w-20 h-20 bg-gray-50 dark:bg-dark-700/50 rounded-full flex items-center justify-center mb-6">
                <WalletCards class="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Belum ada dompet</h3>
            <p class="text-gray-500 dark:text-gray-400 max-w-sm mb-8 text-sm leading-relaxed">
                Anda belum memiliki akun dompet. Tambahkan dompet pertama Anda untuk mulai mencatat keuangan.
            </p>
            <button 
                @click="showModal = true"
                class="btn-primary shadow-lg shadow-brand-500/20 group"
            >
                <Plus class="w-5 h-5 transition-transform group-hover:rotate-90" />
                Buat Dompet Baru
            </button>
        </div>

        <!-- STATE 3: LIST WALLETS (GRID CARD) -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
                v-for="wallet in walletStore.wallets" 
                :key="wallet.id"
                class="card-base group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-gray-800 dark:hover:bg-dark-900"
            >
                <!-- Dekorasi Background (Icon Besar Transparan) -->
                <div class="absolute -bottom-4 -right-4 p-4 opacity-[0.03] dark:opacity-[0.05] group-hover:opacity-10 transition-opacity pointer-events-none transform rotate-12">
                    <component :is="getIcon(wallet.type)" class="w-32 h-32" />
                </div>

                <div class="relative z-10 flex flex-col h-full justify-between">
                    <!-- Top Section: Icon & Menu -->
                    <div class="flex items-start justify-between mb-6">
                        <!-- Icon Type -->
                        <div class="p-3.5 rounded-2xl transition-colors" :class="getIconColorClass(wallet.type)">
                            <component :is="getIcon(wallet.type)" class="w-6 h-6" />
                        </div>
                        
                        <!-- Menu dots (Optional Future Feature) -->
                        <button class="p-2 -mr-2 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                            <MoreVertical class="w-5 h-5" />
                        </button>
                    </div>

                    <!-- Bottom Section: Info -->
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <span class="text-xs font-bold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                {{ wallet.type.replace('_', ' ') }}
                            </span>
                        </div>
                        
                        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 truncate" :title="wallet.name">
                            {{ wallet.name }}
                        </h3>
                        
                        <p class="text-2xl font-bold text-brand-600 dark:text-brand-400 font-sans tracking-tight truncate" :title="formatRupiah(wallet.balance)">
                            {{ formatRupiah(wallet.balance) }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- MODAL -->
        <transition name="fade">
            <div v-if="showModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <!-- Backdrop -->
                <div class="absolute inset-0 bg-gray-900/60 dark:bg-black/80 backdrop-blur-sm transition-opacity" @click="showModal = false"></div>
                
                <!-- Modal Content -->
                <div class="relative w-full max-w-lg bg-white dark:bg-dark-800 rounded-2xl shadow-2xl overflow-hidden transform transition-all flex flex-col max-h-[90vh] border border-gray-100 dark:border-white/10">
                    
                    <!-- Modal Header -->
                    <div class="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-white dark:bg-dark-800 shrink-0">
                        <h3 class="text-lg font-bold text-gray-900 dark:text-white">Buat Dompet Baru</h3>
                        <button 
                            @click="showModal = false" 
                            class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 transition-colors"
                        >
                            <X class="w-5 h-5" />
                        </button>
                    </div>

                    <!-- Modal Body -->
                    <div class="p-6 overflow-y-auto custom-scrollbar">
                        <CreateWalletForm 
                            @close="showModal = false" 
                            @success="handleSuccessCreate" 
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

/* Transition for Modal & Fade elements */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Custom Scrollbar for Modal */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.5); border-radius: 20px; }
</style>