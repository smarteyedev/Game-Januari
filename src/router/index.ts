import { createRouter, createWebHistory } from 'vue-router'
import { useSessionStore } from '@/stores/session'
import { pinia } from '@/main'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: () => import('@/views/GameListView.vue') },
    { path: '/automation-spotter', component: () => import('@/views/AutomationSpotterView.vue') },
    { path: '/drag-and-drop', component: () => import('@/views/DragAndDropView.vue') },
    { path: '/memory-game', component: () => import('@/views/MemoryGameView.vue') },
    { path: '/connections-game', component: () => import('@/views/ConnectionsGameView.vue') },
    { path: '/scrambles-game', component: () => import('@/views/ScramblesGameView.vue') },
    { path: '/matrix-game', component: () => import('@/views/MatrixGameView.vue') },
    { path: '/p/:token', component: () => import('@/views/GameListView.vue') },
  ],
})

router.beforeEach(async () => {
  const session = useSessionStore(pinia)

  if (!session.guest) {
    session.loadSession()
  }

  if (!session.guest) {
    await session.createGuestSession()
  }
})

export default router
