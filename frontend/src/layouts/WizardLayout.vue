<template>
    <!-- Perubahan: Menggunakan min-h-screen dan overflow-y-auto untuk handle konten panjang/layar pendek -->
    <div class="min-h-screen w-full bg-gray-50 dark:bg-dark-900 transition-colors duration-300 relative overflow-y-auto overflow-x-hidden">
      
      <!-- Background Decoration -->
      <div class="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div class="absolute -top-20 -left-20 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl mix-blend-multiply filter dark:mix-blend-normal dark:bg-brand-500/10 animate-pulse"></div>
          <div class="absolute -bottom-20 -right-20 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl mix-blend-multiply filter dark:mix-blend-normal dark:bg-teal-500/10 animate-pulse" style="animation-delay: 2s"></div>
      </div>
  
      <!-- Main Container -->
      <!-- Perubahan: Menggunakan 'flex min-h-screen items-center' dengan padding vertical (py-12) agar aman saat discroll -->
      <div class="relative z-10 flex min-h-screen flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
          <!-- Brand Header -->
          <div class="text-center mb-8">
              <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-600 text-white mb-4 shadow-lg shadow-brand-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              </div>
              <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white font-sans">
              FinanceTracker
              </h1>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Yuk buat dompet pertama mu
              </p>
          </div>
        </div>
  
        <!-- Content Slot Wrapper -->
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
          <slot></slot>
          
          <!-- Footer -->
          <p class="mt-8 text-center text-xs text-gray-400 dark:text-gray-500">
              &copy; {{ new Date().getFullYear() }} FinanceTracker. All rights reserved.
          </p>
        </div>
        
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  // Layout logic here
  </script>