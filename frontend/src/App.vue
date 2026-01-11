<script setup lang="ts">
import { useAuthStore } from './stores/authStores';
import { computed, onMounted } from 'vue';
import { RouterView, useRoute } from 'vue-router'
import DefaultLayout from './layouts/DefaultLayout.vue';
import AuthLayout from './layouts/AuthLayout.vue';
import WizardLayout from './layouts/WizardLayout.vue';

const auth = useAuthStore()
const route = useRoute()

onMounted(() => {
  auth.initializeToken()
})

const layouts: Record<string, any>  = {
  DefaultLayout,
  AuthLayout,
  WizardLayout
}

const currentLayout = computed(() => {
  const layoutName = route.meta.layout as string

  return layouts[layoutName] || DefaultLayout
})

</script>

<template>
  <component :is="currentLayout">
    <RouterView />
  </component>
</template>

<style scoped>

</style>
