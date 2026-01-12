<script setup lang="ts">
import { useWalletStore } from '@/stores/walletStore';
import { type CreateWalletPayload, type WalletType } from '@/types/globalTypes';
import Swal from 'sweetalert2';
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const emit = defineEmits(['close', 'success']);
const route = useRoute()
const router = useRouter()
const routePath = '/set-up-first-wallet'

const optionType: WalletType[] = [
    'CASH', 'BANK', 'CREDIT_CARD', 'WALLET'
]
    
const formWallet = reactive<CreateWalletPayload>({
    name: '',
    type: 'CASH',
    balance: ''
})

const walletStore = useWalletStore()

const formatNumber = (n: string) => {
    return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const handleBalanceInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
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

    if (isSuccess && route.path === routePath) {
        router.push('/dashboard')
    }
}
</script>

<template>
    <div class="w-full">
        <!-- Alert Error dari Store -->
        <div v-if="walletStore.errMsg" class="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 text-sm flex items-center gap-2 animate-fade-in">
            {{ walletStore.errMsg }}
        </div>

        <form @submit.prevent="handleCreate" class="space-y-6">
            
            <!-- Nama Dompet -->
            <div class="space-y-1.5">
                <label for="walletName" class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nama Dompet</label>
                <input 
                    id="walletName"
                    v-model="formWallet.name"
                    type="text" 
                    placeholder="Contoh: Tabungan BCA"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white bg-white dark:bg-dark-900/50 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-sans text-sm"
                    required
                />
            </div>

            <!-- Tipe Akun -->
            <div class="space-y-2">
                <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tipe Akun</label>
                <div class="grid grid-cols-2 gap-3">
                    <div 
                        v-for="type in optionType" 
                        :key="type"
                        @click="formWallet.type = type"
                        class="cursor-pointer relative px-4 py-3 rounded-xl border text-sm font-bold transition-all flex items-center justify-center capitalize select-none"
                        :class="[
                            formWallet.type === type 
                                ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400 ring-1 ring-brand-500' 
                                : 'border-gray-200 dark:border-white/10 bg-white dark:bg-dark-900/50 text-gray-600 dark:text-gray-400 hover:border-brand-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/5'
                        ]"
                    >
                        {{ type.replace('_', ' ') }}
                    </div>
                </div>
            </div>

            <!-- Saldo Awal -->
            <div class="space-y-2">
                <label for="balance" class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Saldo Awal</label>
                <div class="relative group">
                    <span class="absolute left-0 top-1/2 -translate-y-1/2 text-2xl font-bold text-brand-600 dark:text-brand-500">Rp</span>
                    <input 
                        id="balance"
                        :value="formWallet.balance"
                        @input="handleBalanceInput"
                        type="text"
                        inputmode="numeric"
                        placeholder="0"
                        class="w-full pl-10 py-2 text-4xl font-bold bg-transparent border-none focus:ring-0 focus:outline-none focus:border-none placeholder:text-gray-300 dark:placeholder:text-gray-700 font-sans transition-colors text-gray-900 dark:text-white"
                        required
                    />
                </div>
                <!-- Divider Halus -->
                <div class="h-px w-full bg-gray-200 dark:bg-white/10"></div>
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
                    :disabled="walletStore.isLoading"
                    class="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold transition-all shadow-lg shadow-brand-500/30 disabled:opacity-70"
                >
                    <span v-if="walletStore.isLoading">Menyimpan...</span>
                    <span v-else>Simpan Dompet</span>
                </button>
            </div>
        </form>
    </div>
</template>