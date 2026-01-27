import { createRouter, createWebHistory } from 'vue-router'
import GameMapView from '../views/GameMapView.vue'
import LoginView from '@/views/LoginView.vue'
import { useSessionStore } from '@/stores/session'
import { pinia } from '@/main'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: LoginView },
    { path: '/game', component: GameMapView, meta: { requiresPlayer: true } },
  ],
})

router.beforeEach((to, from, next) => {
  const sessionStore = useSessionStore(pinia)
  sessionStore.loadSession()

  if (to.meta.requiresPlayer && !sessionStore.guest?.accessToken) {
    next('/')
  } else {
    next()
  }
})

export default router
