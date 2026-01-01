<script setup lang="ts">
import { useWalletStore } from '@/stores/walletStore';
import { type CreateWalletPayload, type WalletType } from '@/types/globalTypes';
import { CreditCard, Landmark, Plus, Smartphone, Wallet, WalletCards, X } from 'lucide-vue-next';
import { reactive, ref } from 'vue';
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

const getIconColorClass = (type: WalletType) => {
    switch(type) {
        case 'BANK': return 'bg-blue-100 text-blue-600';
        case 'CREDIT_CARD': return 'bg-purple-100 text-purple-600';
        case 'WALLET': return 'bg-orange-100 text-orange-600';
        default: return 'bg-brand-100 text-brand-600'; // cash
    }
};

// async function handleCreate() {
//     if (!formWallet.name) {
//         Swal.fire('Error', 'Nama dompet harus diisi', 'error');
//         return;
//     }

//     const cleanedBalance = formWallet.balance.toString().replace(/\./g, '').replace(",", ".")
//     const payload = {
//         ...formWallet,
//         balance : cleanedBalance
//     }
//     const isSuccess = await walletStore.createWallet(payload);

//     if (isSuccess) {
//         Swal.fire({
//             icon: "success",
//             title: 'Berhasil',
//             text: "Dompet berhasil dibuat",
//             timer: 1500,
//             showConfirmButton: false
//         });
//         formWallet.name = '';
//         formWallet.balance = '';
//     } else {
//         Swal.fire({
//             icon: "error",
//             title: 'Gagal',
//             text: walletStore.errMsg || 'Terjadi kesalahan sistem'
//         });
//     }
// }

const handleSuccessCreate = () => {
    showModal.value = false;
    // walletStore.fetchWallets(); // Refresh data jika perlu
};
</script>

<template>
        <div class="w-full">
        
        <!-- Header Page -->
        <div class="flex items-center justify-between mb-8">
            <div>
                <h1 class="text-2xl font-bold text-dark-900">Dompet Saya</h1>
                <p class="text-gray-500 text-sm mt-1">Kelola semua sumber dana Anda di satu tempat.</p>
            </div>
            
            <!-- Tombol Tambah (Hanya muncul jika ada data, jika kosong tombol ada di empty state) -->
            <button 
                v-if="walletStore.wallets && walletStore.wallets.length > 0"
                @click="showModal = true"
                class="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-all font-medium shadow-sm"
            >
                <Plus class="w-5 h-5" />
                <span>Tambah Dompet</span>
            </button>
        </div>

        <!-- STATE 1: LOADING (Optional) -->
        <div v-if="walletStore.isLoading" class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
        </div>

        <!-- STATE 2: EMPTY STATE (Jika belum ada wallet) -->
        <div 
            v-else-if="!walletStore.hasWallet" 
            class="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-gray-300 text-center"
        >
            <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <WalletCards class="w-8 h-8 text-gray-400" />
            </div>
            <h3 class="text-lg font-bold text-dark-900 mb-2">Belum ada dompet</h3>
            <p class="text-gray-500 max-w-sm mb-6">
                Anda belum memiliki akun dompet. Tambahkan dompet pertama Anda untuk mulai mencatat keuangan.
            </p>
            <button 
                @click="showModal = true"
                class="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-all font-semibold shadow-lg shadow-brand-500/20"
            >
                <Plus class="w-5 h-5" />
                Buat Dompet Baru
            </button>
        </div>

        <!-- STATE 3: LIST WALLETS (GRID CARD) -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
                v-for="wallet in walletStore.wallets" 
                :key="wallet.id"
                class="group bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
            >
                <!-- Dekorasi Background -->
                <div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <component :is="getIcon(wallet.type)" class="w-24 h-24" />
                </div>

                <div class="relative z-10">
                    <div class="flex items-start justify-between mb-4">
                        <!-- Icon Type -->
                        <div class="p-3 rounded-xl" :class="getIconColorClass(wallet.type)">
                            <component :is="getIcon(wallet.type)" class="w-6 h-6" />
                        </div>
                        <!-- Menu dots (Optional) -->
                        <button class="text-gray-400 hover:text-dark-900">
                            <span class="sr-only">Menu</span>
                            <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                        </button>
                    </div>

                    <div>
                        <p class="text-sm font-medium text-gray-500 mb-1 capitalize">
                            {{ wallet.type.replace('_', ' ') }}
                        </p>
                        <h3 class="text-lg font-bold text-dark-900 mb-2 truncate">
                            {{ wallet.name }}
                        </h3>
                        <p class="text-xl font-bold text-brand-600 font-sans tracking-tight">
                            {{ formatRupiah(wallet.balance) }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- MODAL -->
        <transition name="fade">
            <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <!-- Backdrop -->
                <div class="absolute inset-0 bg-dark-900/60 backdrop-blur-sm" @click="showModal = false"></div>
                
                <!-- Modal Content -->
                <div class="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all">
                    <!-- Modal Header -->
                    <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                        <h3 class="text-lg font-bold text-dark-900">Buat Dompet Baru</h3>
                        <button @click="showModal = false" class="p-1 rounded-full hover:bg-gray-100 text-gray-500">
                            <X class="w-5 h-5" />
                        </button>
                    </div>

                    <!-- Modal Body (Load Form Component) -->
                    <div class="p-6">
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
/* Transition for Modal */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>