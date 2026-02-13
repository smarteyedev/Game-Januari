/**
 * Game Service - Application Layer
 * Handles game-related use cases and business logic
 */

import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import { Game, type GameData } from '@/domain/entities/Game'
import { GameState, type MinigameId, type GameResult } from '@/domain/types'
import { gameRepository, sessionRepository } from '@/infrastructure'
import { useTimer } from '@/composables/useTimer'
import { useSessionStore } from '@/stores/session'

export type GameServiceOptions = {
  /** Maximum time in seconds for the game */
  maxTime?: number
  /** Minigame ID for session tracking */
  minigameId: MinigameId
  /** Callback when game is finished (win) */
  onWin?: (result: GameResult) => void
  /** Callback when game is lost (time out) */
  onLose?: () => void
  /** Callback when game session is submitted */
  onSubmit?: (result: GameResult) => void
  /** Auto-submit score when game ends */
  autoSubmit?: boolean
}

export type GameServiceReturn = {
  // State
  gameState: Ref<GameState>
  isPlaying: ComputedRef<boolean>
  isFinished: ComputedRef<boolean>
  isWon: ComputedRef<boolean>
  isLost: ComputedRef<boolean>
  canSubmit: ComputedRef<boolean>

  // Timer
  time: Ref<number>
  isTimeOver: Ref<boolean>
  startTimer: () => void
  stopTimer: () => void
  resetTimer: () => void

  // Game actions
  startGame: () => Promise<void>
  submitScore: (score: number, answers?: unknown[]) => Promise<void>
  finish: (won: boolean, finalAnswers?: unknown[]) => Promise<void>
  reset: () => void
  retry: () => Promise<void>

  // Session store
  session: ReturnType<typeof useSessionStore>
}

export function useGameService(options: GameServiceOptions): GameServiceReturn {
  const {
    maxTime = 180,
    minigameId,
    onWin,
    onLose,
    onSubmit,
    autoSubmit = true,
  } = options

  // Game entity
  const game = ref<Game>(
    new Game({
      gameId: '',
      minigameId,
      state: GameState.Idle,
    }),
  )

  // Timer
  const {
    time,
    isGameOver: isTimeOver,
    start: startTimer,
    stop: stopTimer,
    restart: resetTimer,
  } = useTimer(maxTime, {
    onFinish: () => {
      handleGameOver(false)
    },
  })

  // Computed states
  const gameState = computed(() => game.value.state)
  const isPlaying = computed(() => game.value.isPlaying)
  const isFinished = computed(() => game.value.isFinished)
  const isWon = computed(() => game.value.isFinished && didWin.value)
  const isLost = computed(() => game.value.isFinished && !didWin.value)
  const canSubmit = computed(() => isPlaying.value || isFinished.value)
  const didWin = ref(false)

  /**
   * Handle game over - win or lose
   */
  async function handleGameOver(won: boolean, finalAnswers?: unknown[]) {
    stopTimer()
    game.value.setSubmitting()

    didWin.value = won
    const score = won ? calculateScore() : 0

    if (finalAnswers) {
      game.value.answers.push(...finalAnswers)
    }

    // Auto submit if enabled
    if (autoSubmit) {
      await submitScore(score, game.value.answers)
    }

    game.value.finish(won, score, finalAnswers)

    // Call callbacks
    const result: GameResult = {
      score: game.value.score,
      won,
      timeMs: (maxTime - time.value) * 1000,
      answers: game.value.answers,
      sessionId: game.value.sessionId,
    }

    if (won) {
      onWin?.(result)
    } else {
      onLose?.()
    }

    onSubmit?.(result)
  }

  /**
   * Calculate score based on time remaining
   */
  function calculateScore(): number {
    const timeBonus = Math.floor(time.value / 10)
    return Math.min(100, 50 + timeBonus)
  }

  /**
   * Start a new game
   */
  async function startGame() {
    const session = sessionRepository.getCurrentSession()
    if (!session) {
      throw new Error('No guest session available')
    }

    game.value = new Game({
      gameId: session.gameId,
      minigameId,
      state: GameState.Launching,
    })

    try {
      const { sessionId } = await gameRepository.launchGame(
        session.gameId,
        minigameId,
        session.accessToken,
      )

      game.value.launch(sessionId)
      game.value.start()
      startTimer()
    } catch (error) {
      game.value.setError()
      console.error('Failed to start game:', error)
      throw error
    }
  }

  /**
   * Submit score to the server
   */
  async function submitScore(finalScore: number, finalAnswers?: unknown[]) {
    const session = sessionRepository.getCurrentSession()
    if (!session || !game.value.sessionId) {
      console.warn('No active game session to submit')
      return
    }

    try {
      await gameRepository.submitScore(
        game.value.sessionId,
        finalScore,
        finalAnswers ?? game.value.answers,
        (maxTime - time.value) * 1000,
        session.accessToken,
      )
    } catch (error) {
      console.error('Failed to submit score:', error)
      throw error
    }
  }

  /**
   * Finish the game manually
   */
  async function finish(won: boolean, finalAnswers?: unknown[]) {
    await handleGameOver(won, finalAnswers)
  }

  /**
   * Reset game state
   */
  function reset() {
    stopTimer()
    time.value = maxTime
    game.value.reset()
  }

  /**
   * Retry the game
   */
  async function retry() {
    reset()
    await startGame()
  }

  // Session store
  const session = useSessionStore()

  return {
    // State
    gameState,
    isPlaying,
    isFinished,
    isWon,
    isLost,
    canSubmit,

    // Timer
    time,
    isTimeOver,
    startTimer,
    stopTimer,
    resetTimer,

    // Game actions
    startGame,
    submitScore,
    finish,
    reset,
    retry,

    // Session
    session,
  }
}

export default useGameService

