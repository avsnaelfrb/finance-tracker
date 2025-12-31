import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/dashboard',
      name: 'dashboard',
      component: HomeView,
      meta: {
        layout: 'DefaultLayout'
       }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: {
        layout: 'AuthLayout',
        isPublic: true
       }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: {
        layout: 'AuthLayout',
        isPublic: true
       }
    }
  ],
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')

  if (to.meta.isPublic && isAuthenticated) {
    return next('/dashboard')
  }

  if (!to.meta.isPublic && !isAuthenticated) {
    return next('/login')
  }

  next()
})

export default router
