import instance from "@/services/api";
import type { ApiResponse, CreateWalletPayload, Wallet } from "@/types/globalTypes";
import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";

export const useWalletStore = defineStore('wallets', () => {
    const wallets = ref<Wallet[]>([])
    const errMsg = ref<string | null>('')
    const isLoading = ref(false)

    const hasWallet = computed(() => wallets.value.length > 0)

    async function createWallet(payload: CreateWalletPayload) {
        isLoading.value = true
        errMsg.value = ''
        
        try {

            const apiPayload = {
                ...payload,
                balance: payload.balance.toString()
            }
            const response = await instance.post < ApiResponse<Wallet>>('/wallet/add-wallet', apiPayload)
            const serverResponse = response.data

            if (hasWallet) {
                await getAllWallet()
            }
            
            console.log(serverResponse.message);
            return true
        } catch (error: any) {
            console.error(error);
            
            errMsg.value = error.response?.data?.message
            return false
        } finally {
            isLoading.value = false
        }
    }

    async function getAllWallet() {
        isLoading.value = true
        errMsg.value = ''

        try {
            const apiResponse = await instance.get<ApiResponse<Wallet[]>>('/wallet/all-wallet')
            //---------------- DEBUG AREA -------------------
            wallets.value = apiResponse.data.data
            console.log("1. FULL RESPONSE:", apiResponse);
            console.log("2. ISI DATA (response.data):", apiResponse.data);
            console.log("3. DATA.DATA (response.data.data):", apiResponse.data.data);
            // ----------------------------------------------
            return true
        } catch (error: any) {
            console.error(error);
            
            errMsg.value = error.response?.data?.message
            return false
        } finally {
            isLoading.value = false
        }
    }

    return { wallets, errMsg, isLoading, hasWallet, createWallet, getAllWallet }
})