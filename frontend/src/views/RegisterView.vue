<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Eye, EyeClosed, Lock, Mail, User, ArrowRight, AlertCircle, Loader } from 'lucide-vue-next';
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

  if (!formData.name || !formData.email || !formData.password) {
    errMsg.value = 'Mohon lengkapi semua data pendaftaran.'
    return
  }

  isLoading.value = true

  try {
    await auth.registerUser(formData)

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    })
    
    Toast.fire({
      icon: 'success',
      title: 'Berhasil registrasi, silahkan login'
    })

    if (auth.isLoggedIn === true) {
      router.push('/dashboard')
    }
    
  } catch (error: any) {
    errMsg.value = error.response?.data?.message || error.message || 'Gagal mendaftar. Silakan coba lagi.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
    <div class="card-base group transition-all duration-300">
      
      <!-- HEADER SECTION: Dynamic Switching (Error Alert vs Welcome Text) -->
      <!-- Konsisten dengan halaman Login -->
      <div class="mb-6 min-h-[4rem] flex flex-col justify-center">
        
        <!-- CASE 1: Tampilkan Error Alert jika ada error -->
        <div v-if="errMsg" class="animate-fade-in p-4 rounded-xl bg-red-50 border border-red-100 dark:bg-red-900/20 dark:border-red-800 flex items-start gap-3">
          <AlertCircle class="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div class="flex-1">
            <h3 class="text-sm font-bold text-red-800 dark:text-red-300">Gagal Mendaftar</h3>
            <p class="text-xs text-red-600 dark:text-red-400 mt-0.5">{{ errMsg }}</p>
          </div>
        </div>

        <!-- CASE 2: Tampilkan Header Normal jika tidak ada error -->
        <div v-else class="animate-fade-in">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white font-sans">Buat Akun Baru</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Lengkapi data diri untuk memulai</p>
        </div>

      </div>

      <form class="space-y-5" @submit.prevent="handleRegister">
        
        <!-- Name Input -->
        <div class="space-y-1.5">
          <label for="name" class="text-xs font-semibold text-gray-600 dark:text-gray-300 ml-1">Nama Lengkap</label>
          <div class="input-group">
            <User class="input-icon" />
            <input 
              id="name" 
              v-model="formData.name" 
              type="text" 
              required
              class="form-input"
              placeholder="John Doe"
              @input="errMsg = ''"
            />
          </div>
        </div>

        <!-- Email Input -->
        <div class="space-y-1.5">
          <label for="email" class="text-xs font-semibold text-gray-600 dark:text-gray-300 ml-1">Email</label>
          <div class="input-group">
            <Mail class="input-icon" />
            <input 
              id="email" 
              v-model="formData.email" 
              type="email" 
              required
              class="form-input"
              placeholder="nama@email.com"
              @input="errMsg = ''"
            />
          </div>
        </div>

        <!-- Password Input -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between ml-1">
            <label for="password" class="text-xs font-semibold text-gray-600 dark:text-gray-300">Password</label>
          </div>

          <div class="input-group">
            <Lock class="input-icon" />
            <input 
              id="password" 
              v-model="formData.password" 
              :type="showPassword ? 'text' : 'password'" 
              required
              class="form-input pr-10"
              placeholder="••••••••"
              @input="errMsg = ''"
            />
            <button 
              type="button" 
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-500 transition-colors focus:outline-none"
              tabindex="-1"
            >
              <Eye v-if="!showPassword" :size="20" />
              <EyeClosed v-else :size="20"/>
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <button 
          type="submit" 
          :disabled="isLoading"
          class="btn-primary group mt-2"
        >
          <span v-if="isLoading" class="flex items-center gap-2">
            <Loader class="animate-spin h-4 w-4 text-white"/>
            Memproses...
          </span>
          <span v-else class="flex items-center gap-2">
            Daftar Sekarang <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </button>
      </form>

      <!-- Footer / Link to Login -->
      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-200 dark:border-gray-700"></div>
        </div>
        <div class="relative flex justify-center text-xs uppercase">
          <span class="bg-white px-2 text-gray-500 dark:bg-dark-800 dark:text-gray-400">Sudah punya akun?</span>
        </div>
      </div>

      <div class="text-center">
        <router-link to="/login" class="font-bold text-brand-600 hover:text-brand-500 hover:underline dark:text-brand-400 text-sm">
          Masuk Sekarang
        </router-link>
      </div>

    </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>