import { ref } from 'vue'
import useApi from '@/composables/useApi'
import { useSessionStore } from '@/stores/session'
import type { ApiResponse } from '@/types/types'

export default function useGameSession(gameId: string, minigameId: string) {
  const sessionStore = useSessionStore()
  const { post, loading, error } = useApi()
  const sessionId = ref<string | null>(null)

  // Invalidate previous session
  async function invalidateSession() {
    if (!sessionId.value || !sessionStore.guest?.accessToken) return
    try {
      await post(
        `/api/v1/hpl/session/${sessionId.value}/invalidate`,
        {},
        { headers: { Authorization: `Bearer ${sessionStore.guest.accessToken}` } },
      )
    } catch (err) {
      console.warn('Failed to invalidate previous session', err)
    } finally {
      sessionId.value = null
    }
  }

  async function startSession() {
    // Invalidate old session before creating a new one
    await invalidateSession()

    if (!sessionStore.guest?.accessToken) return null
    const res = await post<ApiResponse<{ sessionId: string }>>(
      '/api/v1/hpl/game/launch',
      { gameId: gameId, minigameId: minigameId },
      { headers: { Authorization: `Bearer ${sessionStore.guest.accessToken}` } },
    )
    if (res && (res.success === false || (res as any).error)) {
      const msg = res.message ?? (res as any).error?.details ?? 'API returned an error'
      const err = new Error(msg)
      ;(err as any).apiError = res
      throw err
    }

    if (res.success && res.data?.sessionId) sessionId.value = res.data.sessionId
    return sessionId.value
  }

  async function submitScore(score: number, answers: any[] = [], timeMs = 0) {
    if (!sessionId.value || !sessionStore.guest?.accessToken) return

    try {
      const res = await post(
        `/api/v1/hpl/session/${sessionId.value}/submit`,
        { score, answers, timeMs },
        { headers: { Authorization: `Bearer ${sessionStore.guest.accessToken}` } },
      )

      // Treat API-level failures as exceptions as well
      if (res && (res.success === false || (res as any).error)) {
        const msg = res.message ?? (res as any).error?.details ?? 'API returned an error'
        const err = new Error(msg)
        ;(err as any).apiError = res
        throw err
      }

      return res
    } catch (err) {
      console.error('Failed to submit score', err)
      throw err
    }
  }

  async function apiFinishGame(gameId: string) {
    if (!sessionId.value || !sessionStore.guest?.accessToken) return

    try {
      const res = await post(
        `/api/v1/hpl/game/${gameId}/next`,
        { sessionId: sessionId.value },
        { headers: { Authorization: `Bearer ${sessionStore.guest.accessToken}` } },
      )

      // Treat API-level failures as exceptions as well
      if (res && (res.success === false || (res as any).error)) {
        const msg = res.message ?? (res as any).error?.details ?? 'API returned an error'
        const err = new Error(msg)
        ;(err as any).apiError = res
        throw err
      }

      return res
    } catch (err) {
      console.error('Failed to finish game', err)
      throw err
    } finally {
      sessionId.value = null
    }
  }

  return { sessionId, startSession, submitScore, loading, error, invalidateSession, apiFinishGame }
}
