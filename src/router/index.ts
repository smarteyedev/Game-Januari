import { createRouter, createWebHistory } from 'vue-router'
import GameMapView from '../views/GameMapView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: LoginView },
    { path: '/game', component: GameMapView, meta: { requiresPlayer: true } },
  ],
})

router.beforeEach((to, from, next) => {
  const playerId = localStorage.getItem('player_id')

  if (to.meta.requiresPlayer && !playerId) {
    next('/')
  } else {
    next()
  }
})

export default router
