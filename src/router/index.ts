import { createRouter, createWebHistory } from 'vue-router'
import { useSessionStore } from '@/stores/session'
import { useGameProgress } from '@/stores/gameProgress'
import { pinia } from '@/main'
import useApi from '@/composables/useApi'
import type { ApiResponse } from '@/types/types'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: () => import('@/views/GameListView.vue') },
    { path: '/automation-spotter', component: () => import('@/views/AutomationSpotterView.vue') },
    { path: '/drag-and-drop', component: () => import('@/views/DragAndDropView.vue') },
    { path: '/memory-game', component: () => import('@/views/MemoryGameView.vue') },
    { path: '/p/:token', component: () => import('@/views/GameListView.vue') },
  ],
})

router.beforeEach(async (to, _, next) => {
  const sessionStore = useSessionStore(pinia)
  sessionStore.loadSession()

  // If route contains a public token (launch from third-party), create guest session
  const rawToken = to.params?.token
  const token = Array.isArray(rawToken) ? rawToken[0] : rawToken
  if (token) {
    // Only create session if missing or different
    if (!sessionStore.guest || sessionStore.guest.accessToken !== String(token)) {
      const { post } = useApi()
      try {
        const res = await post<
          ApiResponse<{
            guestId: string
            accessToken: string
            expiresAt: string
          }>
        >('/api/v1/guest/session', { token: String(token) })

        if (!res || !res.success || !res.data) {
          throw new Error(res?.message || 'Login gagal')
        }

        sessionStore.setGuestSession({
          guestId: res.data.guestId,
          accessToken: res.data.accessToken,
          expiresAt: res.data.expiresAt,
          gameId: String(token),
        })

        try {
          const progress = useGameProgress(pinia)
          progress.resetProgress()
        } catch (e) {
          /* ignore */
        }
      } catch (err) {
        console.warn('Failed to create guest session from token', err)
      }
    }
  }

  if (to.meta.requiresPlayer && !sessionStore.guest?.accessToken) {
    next('/')
  } else {
    next()
  }
})

export default router
