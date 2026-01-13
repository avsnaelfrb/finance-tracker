<script setup lang="ts">
import CreateWalletForm from '@/components/WalletFormComponent.vue'
import { useRoute, useRouter } from 'vue-router';

const router = useRouter()
const route = useRoute()
const routePath = '/set-up-first-wallet'

const handleCancelCreate = () => {
    setTimeout(() => {
        router.back()
    })
}

const handleSuccessCreate = () => {
    if (route.path === routePath) {
        setTimeout(() => {
            router.push('/dashboard')
        }, 1000)
    }
}
</script>

<template>
    <div class="animate-fade-in">
        <CreateWalletForm @close="handleCancelCreate" @success="handleSuccessCreate"/>
    </div>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.5s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>