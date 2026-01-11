<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { 
    LayoutDashboard, 
    PieChart, 
    FileText, 
    Users, 
    ShoppingBag, 
    ShoppingCart, 
    Settings, 
    Shield, 
    Menu, 
    Box, 
    LogOut, 
    Bell, 
    HelpCircle,
    X, 
    User,
    Wallet,
    Sun,
    Moon,
    ChevronRight
} from 'lucide-vue-next';
import { useAuthStore } from '@/stores/authStores';
import { useRoute, useRouter } from 'vue-router';
import { useWalletStore } from '@/stores/walletStore';

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const walletStore = useWalletStore()

// State untuk theme
const isDark = ref(false)

onMounted(() => {
    walletStore.getAllWallet()
    
    // LOGIC THEME: Cek localStorage dulu untuk konsistensi
    const storedTheme = localStorage.getItem('theme')
    
    // Jika user pernah set 'dark' ATAU belum pernah set tapi sistemnya dark
    if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        isDark.value = true
        document.documentElement.classList.add('dark')
    } else {
        isDark.value = false
        document.documentElement.classList.remove('dark')
    }
})

// Function Toggle Theme
const toggleTheme = () => {
    isDark.value = !isDark.value
    if (isDark.value) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
    } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
    }
}

const isSidebarOpen = ref(false);
const toggleSidebar = () => isSidebarOpen.value = !isSidebarOpen.value;
const closeSidebar = () => isSidebarOpen.value = false;

const menuItems = [
    {
    title: 'Utama',
    links: [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
        { name: 'Your Wallets', icon: Wallet, href: '/Wallets'},
        { name: 'Laporan', icon: FileText, href: '/reports'},
    ]
    },
    {
    title: 'Manajemen',
    links: [
        { name: 'Pengguna', icon: Users, href: '/users'},
        { name: 'Produk', icon: ShoppingBag, href: '/products'},
        { name: 'Pesanan', icon: ShoppingCart, href: '/orders'},
    ]
    },
    {
    title: 'Sistem',
    links: [
        { name: 'Pengaturan', icon: Settings, href: '/settings'},
        { name: 'Keamanan', icon: Shield, href: '/security'},
    ]
    }
];

function handleLogout() {
    auth.userLoggedOut()
    router.push('/login')
}
</script>
    
<template>
    <div class="min-h-screen bg-gray-50 dark:bg-dark-900 font-sans text-slate-900 dark:text-gray-100 transition-colors duration-300">
    
    <!-- 1. Mobile Header -->
    <header class="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-white/5 h-16 flex items-center justify-between px-4 md:hidden fixed w-full top-0 z-40 transition-colors duration-300">
        <div class="flex items-center gap-2 font-bold text-xl text-brand-600 dark:text-brand-500">
            <div class="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <span>FinTrack.</span>
        </div>
        <div class="flex items-center gap-3">
            <button @click="toggleTheme" class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10 transition-colors">
                <Sun v-if="!isDark" class="w-5 h-5" />
                <Moon v-else class="w-5 h-5" />
            </button>
            <button @click="toggleSidebar" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 focus:outline-none text-gray-700 dark:text-gray-200">
                <Menu v-if="!isSidebarOpen" class="w-6 h-6" />
                <X v-else class="w-6 h-6" />
            </button>
        </div>
    </header>

    <!-- 2. Overlay Mobile -->
    <transition name="fade">
        <div 
        v-if="isSidebarOpen" 
        @click="closeSidebar"
        class="fixed inset-0 bg-dark-900/50 backdrop-blur-sm z-40 md:hidden"
        ></div>
    </transition>

    <!-- 3. Sidebar Navigation -->
    <aside 
        class="fixed top-0 left-0 z-50 h-screen w-64 bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-white/5 transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col"
        :class="isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'"
    >
        <!-- Logo Area -->
        <div class="h-16 flex items-center px-6 border-b border-gray-200 dark:border-white/5 shrink-0">
            <div class="flex items-center gap-3 font-bold text-xl text-brand-600 dark:text-brand-500">
                <div class="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <span>FinTrack.</span>
            </div>
        </div>

        <!-- Navigation Links -->
        <nav class="flex-1 p-4 space-y-6 overflow-y-auto custom-scrollbar">
            <div v-for="(category, index) in menuItems" :key="index">
                <h3 class="px-4 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                    {{ category.title }}
                </h3>
                
                <div class="space-y-1">
                    <!-- FIX HOVER COLOR DISINI -->
                    <RouterLink 
                    v-for="item in category.links" 
                    :key="item.name"
                    :to="item.href"
                    class="group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                    :class="route.path === item.href 
                        ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 hover:text-dark-900 dark:hover:bg-white/5 dark:hover:text-gray-200'"
                    >
                        <component 
                            :is="item.icon" 
                            class="w-5 h-5 transition-colors" 
                            :class="route.path === item.href ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300'"
                        />
                        {{ item.name }}
                        
                        <ChevronRight v-if="route.path === item.href" class="w-4 h-4 ml-auto text-brand-600 dark:text-brand-400" />
                    </RouterLink>
                </div>
            </div>
        </nav>

        <!-- User Profile -->
        <div class="p-4 border-t border-gray-200 dark:border-white/5 bg-white dark:bg-dark-800 shrink-0">
            <button 
                type="button"
                @click="handleLogout()"
                class="group flex w-full items-center gap-3 p-3 rounded-xl text-left transition-all hover:bg-red-50 border border-transparent hover:border-red-100 dark:hover:bg-white/5 dark:hover:border-white/5"
                title="Klik untuk Keluar Aplikasi"
            >
                <!-- Avatar -->
                <div class="shrink-0 relative">
                    <div class="w-10 h-10 bg-gradient-to-tr from-brand-600 to-brand-400 rounded-full flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
                        <span class="font-bold text-sm">{{ auth.dataUser.name ? auth.dataUser.name.charAt(0).toUpperCase() : 'U' }}</span>
                    </div>
                    <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-dark-800 rounded-full"></div>
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {{ auth.dataUser.name }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {{ auth.dataUser.email }}
                    </p>
                </div>

                <div class="shrink-0">
                    <LogOut class="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                </div>
            </button>
        </div>
    </aside>

    <!-- 4. Main Content -->
    <main class="md:ml-64 min-h-screen pt-16 md:pt-0 transition-all duration-300 flex flex-col">
        
        <!-- Top Bar Desktop -->
        <div class="hidden md:flex h-16 bg-white/80 dark:bg-dark-800/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5 items-center justify-between px-8 sticky top-0 z-30 transition-colors duration-300">
            <div>
                <p class="text-xl font-bold text-gray-900 dark:text-white">Holaa!, {{ auth.dataUser.name }}</p>
            </div>
            
            <div class="flex items-center gap-3">
                <button 
                    @click="toggleTheme" 
                    class="p-2.5 rounded-xl hover:text-brand-600 text-gray-500 hover:bg-brand-50 dark:text-gray-400 dark:hover:bg-brand-500/10 transition-all border border-transparent hover:border-brand-200 dark:hover:border-brand-200"
                >
                    <Sun v-if="!isDark" class="w-5 h-5" />
                    <Moon v-else class="w-5 h-5" />
                </button>

                <button class="p-2.5 text-gray-500 hover:text-brand-600 hover:bg-brand-50 dark:text-gray-400 dark:hover:bg-brand-500/10 dark:hover:text-brand-400 transition-all rounded-xl relative">
                    <Bell class="w-5 h-5" />
                    <span class="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-dark-800"></span>
                </button>

                <button class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-brand-600 hover:bg-brand-50 dark:text-gray-400 dark:hover:text-brand-400 dark:hover:bg-brand-500/10 rounded-xl transition-all">
                    <HelpCircle class="w-4 h-4" />
                    <span>Bantuan</span>
                </button>
            </div>
        </div>

        <div class="flex-1 p-4 md:p-8 overflow-x-hidden">
            <slot />
        </div>

    </main>
    </div>
</template>
    
<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 20px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.8);
}
</style>