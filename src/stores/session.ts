/**
 * Session Store - Pinia Store
 * Manages guest session
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { sessionRepository } from '@/infrastructure'
import type { GuestSession, GameSession, MinigameId } from '@/domain/types'
import { GameState } from '@/domain/types'
import { logger } from '@/infrastructure/logging'

/**
 * Session Store - Pinia store for managing guest sessions and game state
 * Provides reactive session management with persistent storage
 */
export const useSessionStore = defineStore('session', () => {
  // ==========================================================================
  // State
  // ==========================================================================

  const guest = ref<GuestSession | null>(null)
  const game = ref<GameSession | null>(null)

  // ==========================================================================
  // Computed
  // ==========================================================================

  const isPlaying = computed(() => game.value?.state === GameState.Playing)
  const hasActiveSession = computed(() => !!guest.value && !!guest.value.accessToken)

  // ==========================================================================
  // Actions
  // ==========================================================================

  /**
   * Initialize - load session from storage
   */
  function loadSession() {
    const stored = sessionRepository.loadSession()
    if (stored) {
      guest.value = stored
      logger.debug('Session loaded from storage', { guestId: stored.guestId })
    }
  }

  /**
   * Create new guest session
   */
  async function createGuestSession() {
    try {
      const session = await sessionRepository.createGuestSession()
      guest.value = session
      logger.info('Guest session created', { guestId: session.guestId })
      return session
    } catch (error) {
      logger.error(
        'Failed to create guest session',
        error instanceof Error ? error : new Error(String(error)),
      )
      throw error
    }
  }

  /**
   * Ensure we have a valid session
   */
  async function ensureSession() {
    if (!guest.value) {
      loadSession()
    }

    if (!guest.value || !guest.value.accessToken) {
      await createGuestSession()
    }

    return guest.value!
  }

  /**
   * Launch a game
   */
  async function launchGame(minigameId: MinigameId) {
    const session = await ensureSession()

    game.value = {
      gameId: session.gameId,
      minigameId,
      state: GameState.Launching,
    }

    // Note: Game launch is now handled by GameService
    // This store just tracks the current game state
    game.value.state = GameState.Playing

    logger.info('Game launched', { minigameId, gameId: session.gameId })
  }

  /**
   * Update game state
   */
  function updateGameState(state: GameState) {
    if (game.value) {
      game.value.state = state
      logger.debug('Game state updated', { state })
    }
  }

  /**
   * Clear session
   */
  function clearSession() {
    sessionRepository.clearSession()
    guest.value = null
    game.value = null
    logger.info('Session cleared')
  }

  // ==========================================================================
  // Return
  // ==========================================================================

  return {
    // State
    guest,
    game,

    // Computed
    isPlaying,
    hasActiveSession,

    // Actions
    loadSession,
    createGuestSession,
    ensureSession,
    launchGame,
    updateGameState,
    clearSession,
  }
})
