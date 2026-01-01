<script setup lang="ts">
import { useWalletStore } from '@/stores/walletStore';
import { type CreateWalletPayload, type WalletType } from '@/types/globalTypes';
import Swal from 'sweetalert2';
import { reactive, ref } from 'vue';

// Define Emits untuk komunikasi ke parent (Modal)
const emit = defineEmits(['close', 'success']);
    
const optionType: WalletType[] = [
    'CASH', 'BANK', 'CREDIT_CARD', 'WALLET'
]
    
const formWallet = reactive<CreateWalletPayload>({
    name: '',
    type: 'CASH',
    balance: ''
})

const walletStore = useWalletStore()

// Helper untuk format angka saat mengetik (opsional, visual only)
const formatNumber = (n: string) => {
    return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const handleBalanceInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    // Format value langsung saat diketik
    formWallet.balance = formatNumber(target.value);
}

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
    <div class="w-full">
        <!-- Alert Error dari Store -->
        <div v-if="walletStore.errMsg" class="mb-6 p-3 rounded-lg bg-red-50 border border-red-100 flex items-start gap-3">
            <p class="text-sm font-medium text-red-600">{{ walletStore.errMsg }}</p>
        </div>

        <form @submit.prevent="handleCreate" class="space-y-6">
            
            <!-- Nama Dompet -->
            <div class="space-y-1.5">
                <label for="walletName" class="block text-sm font-semibold text-dark-900">Nama Dompet</label>
                <input 
                    id="walletName"
                    v-model="formWallet.name"
                    type="text" 
                    placeholder="Contoh: Tabungan BCA"
                    class="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-dark-900 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-sans"
                    required
                />
            </div>

            <!-- Tipe Akun -->
            <div class="space-y-1.5">
                <label class="block text-sm font-semibold text-dark-900">Tipe Akun</label>
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
                        {{ type.replace('_', ' ') }}
                    </div>
                </div>
            </div>

            <!-- Saldo Awal -->
            <div class="space-y-1.5">
                <label for="balance" class="block text-sm font-semibold text-dark-900">Saldo Awal</label>
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span class="text-gray-500 font-medium sm:text-sm">Rp</span>
                    </div>
                    <input 
                        id="balance"
                        :value="formWallet.balance"
                        @input="handleBalanceInput"
                        type="text"
                        inputmode="numeric"
                        placeholder="ex: 100.000.000"
                        class="w-full pl-11 pr-4 py-2.5 rounded-lg border border-gray-300 text-dark-900 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-sans"
                        required
                    />
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
                    :disabled="walletStore.isLoading"
                    class="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold transition-all shadow-sm disabled:opacity-70"
                >
                    <span v-if="walletStore.isLoading">Menyimpan...</span>
                    <span v-else>Simpan</span>
                </button>
            </div>
        </form>
    </div>
</template>