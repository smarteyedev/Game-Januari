import { createRouter, createWebHistory } from 'vue-router'
import { useSessionStore } from '@/stores/session'
import { pinia } from '@/main'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: () => import('@/views/LoginView.vue') },
    { path: '/game', component: () => import('@/views/GameMapView.vue'), meta: { requiresPlayer: true } },
  ],
})

router.beforeEach((to, _, next) => {
  const sessionStore = useSessionStore(pinia)
  sessionStore.loadSession()

  if (to.meta.requiresPlayer && !sessionStore.guest?.accessToken) {
    next('/')
  } else {
    next()
  }
})

export default router
