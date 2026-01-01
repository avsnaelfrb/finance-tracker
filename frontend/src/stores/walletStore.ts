import instance from "@/services/api";
import type { ApiResponse, CreateWalletPayload, Wallet } from "@/types/globalTypes";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useWalletStore = defineStore('wallets', () => {
    const wallets = ref<Wallet[]>([])
    const errMsg = ref<string | null>('')
    const isLoading = ref(false)

    async function createWallet(payload: CreateWalletPayload) {
        isLoading.value = true
        errMsg.value = ''
        
        try {

            const apiPayload = {
                ...payload,
                balance: payload.balance.toString()
            }
            const response = await instance.post < ApiResponse<{newWallet: Wallet}>>('/wallet/add-wallet', apiPayload)
            const serverResponse = response.data

            wallets.value.push(serverResponse.data.newWallet)
            console.log(serverResponse.message);
            return true
        } catch (error: any) {
            console.error(error);
            
            errMsg.value = error
            return false
        } finally {
            isLoading.value = false
        }
    }

    return { wallets, errMsg, isLoading, createWallet }
})