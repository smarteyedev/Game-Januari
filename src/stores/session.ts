import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import useApi from '@/composables/useApi'
import type { ApiResponse, GuestSession, GameSession } from '@/types/types'

export const useSessionStore = defineStore('session', () => {
  const guest = ref<GuestSession | null>(null)
  const game = ref<GameSession | null>(null)

  const { post } = useApi()

  /* -----------------------------
   * Helpers
   * ----------------------------- */

  function persistGuest(session: GuestSession | null) {
    guest.value = session

    if (session) {
      localStorage.setItem('guest_session', JSON.stringify(session))
    } else {
      localStorage.removeItem('guest_session')
    }
  }

  function ensureAuth() {
    if (!guest.value?.accessToken) {
      throw new Error('Guest is not authenticated')
    }
    return {
      Authorization: `Bearer ${guest.value.accessToken}`,
    }
  }

  function handleApiFailure(res: any) {
    if (!res || res.success === false || res.error) {
      const msg = res?.message ?? res?.error?.details ?? 'Unexpected API error'
      const err = new Error(msg)
      ;(err as any).apiError = res
      throw err
    }
  }

  /* -----------------------------
   * Guest session
   * ----------------------------- */

  async function createGuestSession() {
    const res = await post<
      ApiResponse<{
        guestId: string
        accessToken: string
        expiresAt: string
      }>
    >('/api/v1/guest/session')

    handleApiFailure(res)

    persistGuest({
      guestId: res.data!.guestId,
      accessToken: res.data!.accessToken,
      expiresAt: res.data!.expiresAt,
      gameId: crypto.randomUUID(),
    })
  }

  function loadSession() {
    const stored = localStorage.getItem('guest_session')
    if (stored) guest.value = JSON.parse(stored)
  }

  function clearSession() {
    persistGuest(null)
    game.value = null
  }

  /* -----------------------------
   * Game lifecycle
   * ----------------------------- */

  async function launchGame(minigameId: string) {
    if (!guest.value) throw new Error('No guest session')

    game.value = {
      gameId: guest.value.gameId,
      minigameId,
      state: 'launching',
    }

    const res = await post<ApiResponse<{ sessionId: string }>>(
      '/api/v1/hpl/game/launch',
      {
        gameId: guest.value.gameId,
        minigameId,
      },
      { headers: ensureAuth() },
    )

    handleApiFailure(res)

    game.value.sessionId = res.data!.sessionId
    game.value.state = 'playing'
  }

  async function submitScore(score: number, answers: any[] = [], timeMs = 0) {
    if (!game.value?.sessionId) {
      throw new Error('No active game session')
    }

    game.value.state = 'submitting'

    const res = await post(
      `/api/v1/hpl/session/${game.value.sessionId}/submit`,
      { score, answers, timeMs },
      { headers: ensureAuth() },
    )

    handleApiFailure(res)

    game.value.state = 'finished'
    return res
  }

  /* -----------------------------
   * Derived state
   * ----------------------------- */

  const isPlaying = computed(() => game.value?.state === 'playing')

  return {
    guest,
    game,
    isPlaying,

    createGuestSession,
    loadSession,
    clearSession,

    launchGame,
    submitScore,
  }
})
