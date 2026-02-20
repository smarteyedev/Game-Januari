/**
 * Game Service - Application Layer
 * Handles game-related use cases and business logic
 */

import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import { Game } from '@/domain/entities/Game'
import { GameState, type MinigameId, type GameResult } from '@/domain/types'
import { gameRepository, sessionRepository } from '@/infrastructure'
import { useTimer } from '@/composables/useTimer'
import { useSessionStore } from '@/stores/session'

export type GameServiceOptions = {
  /** Maximum time in seconds for the game */
  maxTime?: number
  /** Minigame ID for session tracking */
  minigameId: MinigameId
  /** If true will use backend service */
  offline?: boolean
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
  offline = false,
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
    const score = won ? 100 : 0

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
   * Calculate score based on time remaining TODO
   
  function calculateScore(): number {
    const timeBonus = Math.floor(time.value / 10)
    return Math.min(100, 50 + timeBonus)
  }
    */

  /**
   * Start a new game
   */
async function startGame() {
  if (offline) {
    // if offline or no backend simulate launched game
    game.value = new Game({
      gameId: 'offline-game',
      minigameId,
      state: GameState.Playing,
    })

    game.value.launch('offline-session')
    game.value.start()
    startTimer()
    return
  }

  // normal with backend flow
  const session = sessionRepository.getCurrentSession()
  if (!session) {
    throw new Error('No guest session available')
  }

  game.value = new Game({
    gameId: session.gameId,
    minigameId,
    state: GameState.Launching,
  })

  const response = await gameRepository.launchGame(
    session.gameId,
    minigameId,
    session.accessToken,
  )

  if (!response?.sessionId) {
    throw new Error('launchGame did not return sessionId')
  }

  game.value.launch(response.sessionId)
  game.value.start()
  startTimer()
}

  /**
   * Submit score to the server
   */
async function submitScore(finalScore: number, finalAnswers?: unknown[]) {
  if (offline) {
    console.log('Offline mode → score:', finalScore)
    return
  }

  const session = sessionRepository.getCurrentSession()
  if (!session || !game.value.sessionId) {
    console.warn('No active game session to submit')
    return
  }

  await gameRepository.submitScore(
    game.value.sessionId,
    finalScore,
    finalAnswers ?? game.value.answers,
    (maxTime - time.value) * 1000,
    session.accessToken,
  )
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
  didWin.value = false
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
