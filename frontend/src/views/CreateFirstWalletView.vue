<script setup lang="ts">
import CreateWalletForm from '@/components/WalletFormComponent.vue'
</script>

<template>
    <div class="animate-fade-in">
        <CreateWalletForm/>
    </div>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.5s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>