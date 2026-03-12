import { createRouter, createWebHistory } from 'vue-router'
import { useSessionStore } from '@/stores/session'
import { pinia } from '@/main'

import {
  AutomationSpotterView,
  ConnectionsGameView,
  DragAndDropView,
  MemoryGameView,
  ScramblesGameView,
  MatrixGameView,
} from '@/features'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: () => import('@/views/GameListView.vue') },
    { path: '/automation-spotter', component: AutomationSpotterView },
    { path: '/drag-and-drop', component: DragAndDropView },
    { path: '/memory-game', component: MemoryGameView },
    { path: '/connections-game', component: ConnectionsGameView },
    { path: '/scrambles-game', component: ScramblesGameView },
    { path: '/matrix-game', component: MatrixGameView },
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
