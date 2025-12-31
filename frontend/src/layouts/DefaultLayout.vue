<script setup>
import { ref } from 'vue';
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
    Wallet
} from 'lucide-vue-next';
import { useAuthStore } from '@/stores/authStores';
import { useRoute, useRouter } from 'vue-router';

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
// State untuk toggle sidebar di mobile
const isSidebarOpen = ref(false);

const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
    isSidebarOpen.value = false;
};

// Data Menu
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
    <!-- Menggunakan font-sans yang sudah Anda definisikan (Plus Jakarta Sans) -->
    <div class="min-h-screen bg-gray-50 font-sans text-dark-800">
    
    <!-- 1. Mobile Header -->
    <header class="bg-white border-b h-16 flex items-center justify-between px-4 md:hidden fixed w-full top-0 z-40">
        <div class="flex items-center gap-2 font-bold text-xl text-brand-600">
        <Box class="w-6 h-6" />
        <span>MyBrand</span>
        </div>
        <button @click="toggleSidebar" class="p-2 rounded-md hover:bg-gray-100 focus:outline-none">
        <Menu v-if="!isSidebarOpen" class="w-6 h-6 text-dark-800" />
        <X v-else class="w-6 h-6 text-dark-800" />
        </button>
    </header>

    <!-- 2. Overlay Mobile -->
    <transition name="fade">
        <div 
        v-if="isSidebarOpen" 
        @click="closeSidebar"
        class="fixed inset-0 bg-dark-900/50 z-40 md:hidden"
        ></div>
    </transition>

    <!-- 3. Sidebar Navigation -->
    <aside 
        class="fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-100 transition-transform duration-300 ease-in-out md:translate-x-0"
        :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
        <!-- Logo Area (Desktop) -->
        <div class="h-16 flex items-center px-6 border-b border-gray-100">
        <div class="flex items-center gap-2 font-bold text-xl text-brand-600">
            <Box class="w-6 h-6" />
            <span>MyBrand</span>
        </div>
        </div>

        <!-- Navigation Links -->
        <nav class="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
        <div v-for="(category, index) in menuItems" :key="index" class="mb-6">
            <h3 class="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            {{ category.title }}
            </h3>
            
            <RouterLink 
            v-for="item in category.links" 
            :key="item.name"
            :to="item.href"
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
            :class="route.path === item.href 
                ? 'bg-brand-50 text-brand-600' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-dark-900'"
            >
            <component :is="item.icon" class="w-5 h-5" />
            {{ item.name }}
            </RouterLink>
        </div>

        <!-- User Profile (Bottom Sidebar) -->
        <div class="absolute bottom-0 left-0 w-full p-4 border-t border-gray-100 bg-white">
            <h3 class="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Log-out
            </h3>
            <button 
                type="button"
                @click="handleLogout()"
                class="group flex w-full items-center gap-3 p-2 rounded-lg text-left transition-colors hover:bg-brand-50 focus:outline-none"
                title="Klik untuk Keluar Aplikasi"
            >
        
                <!-- 1. Avatar (Fixed Size) -->
                <div class="shrink-0">
                    <User class="w-9 h-9 bg-brand-600 text-gray-100 rounded-full p-1.5"/>
                </div>

                <!-- 2. User Info (Flexible Width) -->
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-dark-900 truncate group-hover:text-brand-900 transition-colors">
                        {{ auth.dataUser.name }}
                    </p>
                    <p class="text-xs text-gray-500 truncate group-hover:text-brand-500 transition-colors">
                        {{ auth.dataUser.email }}
                    </p>
                </div>

                <!-- 3. Logout Icon (Visual Indicator) -->
                <div class="shrink-0">
                    <LogOut class="w-5 h-5 text-gray-400 group-hover:text-brand-600 transition-colors" />
                </div>

            </button>
        </div>
        </nav>
    </aside>

    <!-- 4. Main Content Area -->
    <main class="md:ml-64 min-h-screen pt-16 md:pt-0 transition-all duration-300 flex flex-col">
        
        <!-- Top Bar Desktop -->
        <div class="hidden md:flex h-16 bg-white border-b border-gray-100 items-center justify-between px-8 sticky top-0 z-30">
        <h1 class="text-xl font-bold text-dark-900">Dashboard</h1>
        <div class="flex items-center gap-4">
            <button class="p-2 text-gray-400 hover:text-brand-600 transition-colors relative">
            <Bell class="w-5 h-5" />
            <!-- Notification dot menggunakan brand color -->
            <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button class="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">
            <span>Bantuan</span>
            <HelpCircle class="w-4 h-4" />
            </button>
        </div>
        </div>

        <!-- SLOT UTAMA -->
        <div class="flex-1 p-6">
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
</style>