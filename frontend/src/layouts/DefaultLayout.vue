<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/authStores';

const auth = useAuthStore()

</script>

<template>
    <div class="min-h-screen bg-gray-50">
        <nav class="bg-white shadow p-4">
            <div class="container mx-auto flex gap-4">
                <RouterLink to="/" class="font-bold">FinTrack</RouterLink>
                <RouterLink to="/login">Login</RouterLink>
            </div>
            <h1 v-if="auth.isLoggedIn">{{ auth.dataUser.name }}</h1>
        </nav>
        <main class="container mx-auto p-4">
            <pre class="bg-black text-green-400 p-4 text-xs">
                Isi Store: {{ auth.dataUser }}
                Status Login: {{ auth.isLoggedIn }}
            </pre>
            <slot/>
        </main>
    </div>
</template>