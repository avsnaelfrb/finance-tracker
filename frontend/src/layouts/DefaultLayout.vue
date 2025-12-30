<script setup lang="ts">
    import { RouterLink } from 'vue-router';
</script>

<template>
    <div class="min-h-screen bg-gray-50">
        <nav class="bg-white shadow p-4">
            <div class="container mx-auto flex gap-4">
                <RouterLink to="/" class="font-bold">FinTrack</RouterLink>
                <RouterLink to="/dashboard">Dashboard</RouterLink>
            </div>
        </nav>
        <main class="container mx-auto p-4">
            <slot/>
        </main>
    </div>
</template>