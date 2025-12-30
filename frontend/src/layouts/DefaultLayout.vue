<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStores';

const auth = useAuthStore()
const router = useRouter()

const handleLogout = () => {
    auth.userLoggedOut()
    router.push('/login')
}
</script>

<template>
    <div class="min-h-screen bg-gray-50">
        <nav class="bg-white shadow p-4">
            <div class="container mx-auto flex gap-4 items-center">
                <RouterLink to="/" class="font-bold text-xl">FinTrack</RouterLink>
                
                <div class="flex gap-4 ml-auto">
                    <RouterLink 
                        v-if="!auth.isLoggedIn" 
                        to="/login" 
                        class="text-blue-600 hover:text-blue-800"
                    >
                        Login
                    </RouterLink>

                    <template v-else>
                        <span class="text-gray-600">Halo, {{ auth.dataUser.name }}</span>
                        <button 
                            type="button" 
                            @click.prevent="handleLogout" 
                            class="text-red-600 hover:text-red-800 font-medium"
                        >
                            Logout
                        </button>
                    </template>
                </div>
            </div>
        </nav>

        <main class="container mx-auto p-4">
            <slot/>
        </main>
    </div>
</template>