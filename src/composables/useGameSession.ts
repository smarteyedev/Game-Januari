import { ref } from 'vue'
import useApi from '@/composables/useApi'
import { useSessionStore } from '@/stores/session'
import type { ApiResponse } from '@/types/types'

export default function useGameSession( minigameId: string) {
  const sessionStore = useSessionStore()
  const { post, get, loading, error } = useApi()
  const sessionId = ref<string | null>(null)

  async function startSession() {
    if (!sessionStore.guest?.accessToken) return null
    const res = await post<ApiResponse<{ sessionId: string }>>(
      '/api/v1/hpl/game/launch',
      { gameId: sessionStore.guest.gameId, minigameId: minigameId },
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

    async function getSession() {
    if (!sessionStore.guest?.accessToken) return null
    const res = await get<ApiResponse<{ data: any }>>(
      `/api/v1/hpl/session/${sessionId.value}`,
      { headers: { Authorization: `Bearer ${sessionStore.guest.accessToken}` } },
    )
    if (res && (res.success === false || (res as any).error)) {
      const msg = res.message ?? (res as any).error?.details ?? 'API returned an error'
      const err = new Error(msg)
      ;(err as any).apiError = res
      throw err
    }

    return res.data
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

  async function apiNextGame() {
    if (!sessionId.value || !sessionStore.guest?.accessToken) return

    try {
      const res = await post(
        `/api/v1/hpl/game/${sessionStore.guest.gameId}/next`,
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
    }
  }

  return { sessionId, startSession, submitScore, apiNextGame, getSession, loading, error }
}
