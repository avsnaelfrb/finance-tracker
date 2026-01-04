import instance from "@/services/api";
import type { ApiResponse, CreateTransactionPayload, Transaction } from "@/types/globalTypes";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useTransactionStore = defineStore('transaction', () => {
    const transactions = ref<Transaction[]>([])
    const errMsg = ref<string>('')
    const isLoading = ref<boolean>(false)

    async function newTransaction(payload:CreateTransactionPayload) {
        isLoading.value = true
        errMsg.value = ''

        try {
            const response = await instance.post<ApiResponse<Transaction[]>>('/transaction/new-transaction', payload)
            
            console.log(response.data.message);
            transactions.value = response.data.data
            return true
        } catch (err: any) {
            console.error(err);
            errMsg.value = err.response?.data?.message
            return false
        } finally {
            isLoading.value = false
        }
    }

    return { transactions, errMsg, isLoading, newTransaction }
})