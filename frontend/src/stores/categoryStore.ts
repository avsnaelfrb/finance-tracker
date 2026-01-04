import { defineStore } from "pinia";
import instance from "@/services/api";
import { computed, ref } from "vue";
import { type ApiResponse, type Category, type CreateCategoryPayload } from "@/types/globalTypes";

export const useCategoryStore = defineStore('category', () => {
    const categories = ref<Category[]>([])
    const errMsg = ref<string>('')
    const isLoading = ref<boolean>(false)

    const hasCategory = computed(() => categories.value.length > 0)

    async function createCategory(payload:CreateCategoryPayload) {
        isLoading.value = true
        errMsg.value = ''

        try {
            const response = await instance.post<ApiResponse<Category[]>>('/category/add-category', payload)
            await getAllCategory()
            console.log(response.data.message);
            return true
        } catch (error: any) {
            console.error(error);
            errMsg.value = error.response?.data?.message
        } finally {
            isLoading.value = false
        }
    }

    async function getAllCategory() {
        isLoading.value = true
        errMsg.value = ''

        try {
            const response = await instance.get<ApiResponse<Category[]>>('/category/get-all')

            categories.value = response.data.data
            //---------------- DEBUG AREA -------------------
            console.log("1. FULL RESPONSE:", response);
            console.log("2. ISI DATA (response.data):", response.data);
            console.log("3. DATA.DATA (response.data.data):", response.data.data);
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

    return { categories, errMsg, isLoading, hasCategory, createCategory, getAllCategory }
})