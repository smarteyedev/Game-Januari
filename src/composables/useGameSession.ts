import { ref } from 'vue'
import useApi from '@/composables/useApi'
import { useSessionStore } from '@/stores/session'
import type { ApiResponse } from '@/types/types'

export default function useGameSession(gameId: string) {
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
        { headers: { Authorization: `Bearer ${sessionStore.guest.accessToken}` } }
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
      '/api/v1/hpl/session/start',
      { minigameId: gameId },
      { headers: { Authorization: `Bearer ${sessionStore.guest.accessToken}` } }
    )
    if (res.success && res.data?.sessionId) sessionId.value = res.data.sessionId
    return sessionId.value
  }

async function submitScore(score: number, answers: any[] = [], timeMs = 0) {
  if (!sessionId.value || !sessionStore.guest?.accessToken) return

  try {
    const res = await post(
      `/api/v1/hpl/session/${sessionId.value}/submit`,
      { score, answers, timeMs },
      { headers: { Authorization: `Bearer ${sessionStore.guest.accessToken}` } }
    )

    console.log('Submit score response:', res)

    return res
  } catch (err) {
    console.error('Failed to submit score', err)
    throw err
  } finally {
    sessionId.value = null
  }
}

  return { sessionId, startSession, submitScore, loading, error, invalidateSession }
}
