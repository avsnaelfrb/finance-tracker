import instance from "@/services/api";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

interface User {
    name: string,
    email: string
}

export const useAuthStore = defineStore( 'auth', () => {
    const dataUser = ref<User>({
        name: '',
        email: '',
    })
    const token = ref('')
    const isLoading = ref(false)

    const isLoggedIn = computed(() => token.value ? true : false) 

    function userLoggedIn(authUser:User , authToken: string) {
        dataUser.value = authUser
        token.value = authToken

        localStorage.setItem('token', token.value)
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
            console.log("Isi Respon Profil:", response.data)
            if (response) {
                dataUser.value = {
                    name: response.data.data.user.name,
                    email: response.data.data.user.email
                }
            }
        } catch (error) {
            // userLoggedOut()
        } finally {
            isLoading.value = false
        }
    }

    return { dataUser, token, isLoggedIn, isLoading, userLoggedIn, userLoggedOut, initializeToken }
})