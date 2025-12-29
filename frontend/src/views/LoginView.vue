<script setup lang="ts">
import { ref } from 'vue';
import instance from '@/services/api';
import { useRouter } from 'vue-router';

const router = useRouter()
const email = ref('')
const password = ref('')
const errMsg = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
    errMsg.value = ''
    isLoading.value = true

    try {
        const response = await instance.post('/user/login', {
            email: email.value,
            password: password.value
        })

        localStorage.setItem('token', response.data.token)
        router.push('/')
    } catch (err: any) {
        errMsg.value = err.response?.data?.message || "Terjadi kesalahan"
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="login-container">
        <h1>Login page</h1>

        <form @submit.prevent="handleLogin">
        <div>
            <label>Email:</label>
            <input v-model="email" type="email" placeholder="Masukkan email" required />
        </div>

        <div>
            <label>Password:</label>
            <input v-model="password" type="password" placeholder="Masukkan password" required />
        </div>

        <p v-if="errMsg" style="color: red;">{{ errMsg }}</p>

        <button type="submit" :disabled="isLoading">
            {{ isLoading ? 'Sedang Masuk...' : 'Login' }}
        </button>
        </form>
    </div>
</template>

<style>

</style>