<script setup lang="ts">
  import { ref } from 'vue';
  import FormTransaction from '@/components/TransactionFormComponent.vue'; // Sesuaikan path
  import { Plus, X, ArrowUpRight, ArrowDownLeft } from 'lucide-vue-next';
  
  const showTransactionModal = ref(false);
  
  const handleSuccessTransaction = () => {
      showTransactionModal.value = false;
      // Disini bisa panggil fetch data terbaru untuk dashboard
      // transactionStore.fetchRecentTransactions();
  };
  </script>
  
  <template>
    <main class="w-full">
      
      <!-- 1. Header & Quick Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
              <h1 class="text-2xl font-bold text-dark-900">Dashboard</h1>
              <p class="text-gray-500 text-sm mt-1">Ringkasan keuangan Anda hari ini.</p>
          </div>
  
          <!-- Tombol Trigger Modal -->
          <button 
              @click="showTransactionModal = true"
              class="flex items-center justify-center gap-2 px-5 py-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 font-semibold group"
          >
              <Plus class="w-5 h-5 transition-transform group-hover:rotate-90" />
              <span>Tambah Transaksi</span>
          </button>
      </div>
  
      <!-- 2. Dummy Dashboard Content (Bisa dihapus/diganti chart nanti) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <!-- Card Pemasukan -->
          <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div class="flex items-center gap-3 mb-2">
                  <div class="p-2 bg-green-100 rounded-lg text-green-600">
                      <ArrowDownLeft class="w-5 h-5" />
                  </div>
                  <span class="text-sm font-medium text-gray-500">Pemasukan Bulan Ini</span>
              </div>
              <h3 class="text-2xl font-bold text-dark-900">Rp 0</h3>
          </div>
          
          <!-- Card Pengeluaran -->
          <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div class="flex items-center gap-3 mb-2">
                  <div class="p-2 bg-red-100 rounded-lg text-red-600">
                      <ArrowUpRight class="w-5 h-5" />
                  </div>
                  <span class="text-sm font-medium text-gray-500">Pengeluaran Bulan Ini</span>
              </div>
              <h3 class="text-2xl font-bold text-dark-900">Rp 0</h3>
          </div>
      </div>
  
      <!-- 3. MODAL TRANSAKSI -->
      <transition name="fade">
          <div v-if="showTransactionModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
              <!-- Backdrop -->
              <div class="absolute inset-0 bg-dark-900/60 backdrop-blur-sm" @click="showTransactionModal = false"></div>
              
              <!-- Modal Content -->
              <div class="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all flex flex-col max-h-[90vh]">
                  
                  <!-- Modal Header -->
                  <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                      <h3 class="text-lg font-bold text-dark-900">Transaksi Baru</h3>
                      <button @click="showTransactionModal = false" class="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                          <X class="w-5 h-5" />
                      </button>
                  </div>
  
                  <!-- Modal Body (Scrollable) -->
                  <div class="p-6 overflow-y-auto">
                      <FormTransaction 
                          @close="showTransactionModal = false" 
                          @success="handleSuccessTransaction" 
                      />
                  </div>
              </div>
          </div>
      </transition>
  
    </main>
  </template>
  
  <style scoped>
  /* Transisi Modal */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  </style>