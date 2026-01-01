import instance from "@/services/api";
import { defineStore } from "pinia";
import { computed, ref } from "vue";


export const useAuthStore = defineStore( 'auth', () => {
    const dataUser = ref({
        name: '',
        email: '',
    })
    const token = ref<string>(localStorage.getItem('token') || '')
    const isLoading = ref(false)

    const isLoggedIn = computed(() => token.value ? true : false) 

    async function loginUser(payload: any) {
        isLoading.value = true
        try {
            const response = await instance.post('/user/login', payload)
            const serverResponse = response.data

            token.value = serverResponse.data.token
            dataUser.value = {
                name: serverResponse.data.user.name,
                email: serverResponse.data.user.email
            }

            localStorage.setItem('token', token.value)
            return true
        } catch (error: any) {
            throw error
        } finally {
            isLoading.value = false
        }
    }

    async function registerUser(payload: any) {
        isLoading.value = true
        try {
            await instance.post('/user/register', payload)
            return true
        } catch (error) {
            throw error
        } finally {
            isLoading.value = false
        }
    }

    function userLoggedOut() {
        dataUser.value = {name: '', email: ''}
        token.value = ""

        localStorage.removeItem('token')
    }

    async function initializeToken() {
        const cekToken = localStorage.getItem('token')
        if (cekToken) {
            token.value = cekToken
        } else {
            return
        }
        
        isLoading.value = true

        try {
            const response = await instance.get('/user')
            // console.log("Isi Respon Profil:", response.data)
            if (response) {
                dataUser.value = {
                    name: response.data.data.name,
                    email: response.data.data.email
                }
            }
        } catch (error) {
            userLoggedOut()
        } finally {
            isLoading.value = false
        }
    }

    return { dataUser, token, isLoggedIn, isLoading, loginUser, registerUser, userLoggedOut, initializeToken }
})