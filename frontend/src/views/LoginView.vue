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
        errMsg.value = err.response?.data?.message
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
      <div class="min-h-screen flex flex-col lg:flex-row font-sans text-slate-600 bg-white">
    
    <!-- Bagian Kiri: Visual / Branding -->
    <div class="lg:w-1/2 bg-dark-900 relative flex flex-col justify-between p-12 overflow-hidden text-white">
      <!-- Abstract Background Pattern -->
      <div class="absolute inset-0 z-0 opacity-20">
        <svg class="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 100 C 20 0 50 0 100 100 Z" fill="#10b981" />
          <path d="M0 0 C 50 100 80 100 100 0 Z" fill="#0f172a" stroke="#334155" stroke-width="0.5"/>
        </svg>
      </div>

      <!-- Logo Area -->
      <div class="relative z-10 flex items-center space-x-2">
        <div class="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
          <!-- Icon Logo -->
          <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span class="text-xl font-bold tracking-tight">FinTrack.</span>
      </div>

      <!-- Testimonial -->
      <div class="relative z-10 mt-auto hidden lg:block">
        <blockquote class="space-y-2">
          <p class="text-lg font-medium text-slate-200">
            "Lorem ipsum dolor sit amet"
          </p>
          <footer class="text-sm text-slate-400">
            &mdash; Lorem ipsum
          </footer>
        </blockquote>
      </div>
    </div>

    <!-- Bagian Kanan: Login Form -->
    <div class="lg:w-1/2 w-full flex items-center justify-center p-6 bg-white">
      <div class="w-full max-w-md space-y-8">
        
        <!-- Header Mobile -->
        <div class="lg:hidden flex justify-center mb-6">
          <div class="w-10 h-10 bg-brand-500 rounded-lg flex items-center justify-center">
            <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div class="text-center">
          <h2 class="text-3xl font-bold text-slate-900 tracking-tight">Selamat Datang</h2>
          <p class="mt-2 text-sm text-slate-500">
            Masuk ke dashboard finansial Anda
          </p>
        </div>

        <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
          <div class="space-y-5">
            <!-- Email Input -->
            <div>
              <label for="email" class="block text-sm font-semibold text-slate-700 mb-1">Email</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-slate-400" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input 
                  id="email" 
                  v-model="email" 
                  type="email" 
                  required 
                  class="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition duration-200 ease-in-out" 
                  placeholder="nama@perusahaan.com"
                >
              </div>
            </div>

            <!-- Password Input -->
            <div>
              <div class="flex items-center justify-between mb-1">
                <label for="password" class="block text-sm font-semibold text-slate-700">Password</label>
                <a href="#" class="text-sm font-medium text-brand-600 hover:text-brand-500">Lupa password?</a>
              </div>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-slate-400" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <input 
                  id="password" 
                  v-model="password" 
                  type="password" 
                  required 
                  class="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition duration-200 ease-in-out" 
                  placeholder="••••••••"
                >
              </div>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="errMsg" class="rounded-md bg-red-50 p-4 border border-red-100 animate-pulse">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">{{ errMsg }}</h3>
              </div>
            </div>
          </div>

          <!-- Login Button -->
          <div>
            <button 
              type="submit" 
              :disabled="isLoading"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-brand-500/30 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg v-if="!isLoading" class="h-5 w-5 text-brand-500 group-hover:text-brand-400 transition ease-in-out duration-150" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
                <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ isLoading ? 'Memproses...' : 'Masuk ke Akun' }}
            </button>
          </div>
        </form>

        <!-- Footer Kecil -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-slate-200"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-slate-500">
                Belum punya akun?
              </span>
            </div>
          </div>
          <div class="mt-6 flex justify-center">
            <RouterLink to="/register">
              <p class="font-medium text-brand-600 hover:text-brand-500">
                Daftar Sekarang
              </p>
            </RouterLink>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style>

</style>