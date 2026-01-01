<script setup lang="ts">
import { reactive, ref } from 'vue';
import instance from '@/services/api';
import { useRouter } from 'vue-router';
import { Eye, EyeClosed, Loader2, Lock, Mail, User, User2 } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/authStores';
import Swal from 'sweetalert2';

const router = useRouter()
const auth = useAuthStore()

const formData = reactive({
  name: '',
  email: '',
  password: '',
})

const errMsg = ref('')
const isLoading = ref(false)
const showPassword = ref(false)

const handleRegister = async () => {
  errMsg.value = ''
  isLoading.value = true

  try {
    await auth.registerUser(formData)

    Swal.fire({
      icon: "success",
      title: 'Berhasil Registrasi',
      text: "Silahkan login",
      timer: 2500,
      showConfirmButton: true
    })
    router.push('/login')
  } catch (error: any) {
    errMsg.value = error.response?.data?.message
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
          <path d="M0 0 C 50 100 80 100 100 0 Z" fill="#0f172a" stroke="#334155" stroke-width="0.5" />
        </svg>
      </div>

      <!-- Logo Area -->
      <div class="relative z-10 flex items-center space-x-2">
        <div class="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
          <!-- Icon Logo -->
          <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" class="h-5 w-5 text-white" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
            <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" class="h-6 w-6 text-white" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div class="text-center">
          <h2 class="text-3xl font-bold text-slate-900 tracking-tight">Selamat Datang</h2>
          <p class="mt-2 text-sm text-slate-500">
            Registrasikan diri anda
          </p>
        </div>

        <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
          <div class="space-y-5">
            <!-- name Input -->
            <div>
              <label for="name" class="block text-sm font-semibold text-slate-700 mb-1">Name</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User :size="20" class="text-slate-400" />
                </div>
                <input id="name" v-model="formData.name" type="text" required
                  class="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition duration-200 ease-in-out"
                  placeholder="Jhon doe">
              </div>
            </div>
            <!-- Email Input -->
            <div>
              <label for="email" class="block text-sm font-semibold text-slate-700 mb-1">Email</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail :size="20" class="text-slate-400" />
                </div>
                <input id="email" v-model="formData.email" type="email" required
                  class="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition duration-200 ease-in-out"
                  placeholder="nama@perusahaan.com">
              </div>
            </div>

            <!-- Password Input -->
            <div>
              <div class="flex items-center justify-between mb-1">
                <label for="password" class="block text-sm font-semibold text-slate-700">Password</label>
              </div>

              <div class="relative">

                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock :size="20" class="text-slate-400" />
                </div>

                <input id="password" v-model="formData.password" :type="showPassword ? 'text' : 'password'" required
                  class="appearance-none block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition duration-200 ease-in-out"
                  placeholder="••••••••">

                <button type="button" @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-brand-500 transition-colors">
                  <Eye v-if="!showPassword" :size="20" />
                  <EyeClosed v-else :size="20"/>
                </button>

              </div>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="errMsg" class="rounded-md bg-red-50 p-4 border border-red-100 animate-pulse">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">{{ errMsg }}</h3>
              </div>
            </div>
          </div>

          <!-- Login Button -->
          <div>
            <button type="submit" :disabled="isLoading"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-brand-500/30 transition-all duration-200 transform hover:-translate-y-0.5">
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <Lock v-if="!isLoading" :size="20"
                  class="text-brand-500 group-hover:text-brand-400 transition ease-in-out duration-150" />
                <Loader2 v-else :size="20" class="animate-spin text-white" />
              </span>
              {{ isLoading ? 'Memproses...' : 'Daftarkan Akun' }}
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
                Sudah punya akun?
              </span>
            </div>
          </div>
          <div class="mt-6 flex justify-center">
            <RouterLink to="/login">
              <p class="font-medium text-brand-600 hover:text-brand-500">
                Masuk Sekarang
              </p>
            </RouterLink>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style></style>