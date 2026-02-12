import { ref, computed, onUnmounted, type Ref, type ComputedRef } from 'vue'
import { useSessionStore } from '@/stores/session'
import { useTimer } from './useTimer'
import type { GameState, GameResult } from '../types/game'
import { MINIGAME_IDS } from '@/utils/constants'

export type UseGameOptions = {
  /** Maximum time in seconds for the game */
  maxTime?: number
  /** Minigame ID for session tracking */
  minigameId?: string
  /** Callback when game is finished (win) */
  onWin?: (result: GameResult) => void
  /** Callback when game is lost (time out) */
  onLose?: () => void
  /** Callback when game session is submitted */
  onSubmit?: (result: GameResult) => void
  /** Auto-submit score when game ends */
  autoSubmit?: boolean
}

export type UseGameReturn = {
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
  finish: (won: boolean) => Promise<void>
  reset: () => void
  retry: () => Promise<void>

  // Session
  session: ReturnType<typeof useSessionStore>
}

export function useGame(options: UseGameOptions = {}): UseGameReturn {
  const {
    maxTime = 180,
    minigameId = MINIGAME_IDS.memory,
    onWin,
    onLose,
    onSubmit,
    autoSubmit = true,
  } = options

  const session = useSessionStore()

  // Game state
  const gameState = ref<GameState>('idle')
  const score = ref(0)
  const answers = ref<unknown[]>([])

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
  const isPlaying = computed(() => gameState.value === 'playing')
  const isFinished = computed(() => gameState.value === 'finished')
  const isWon = computed(() => gameState.value === 'finished' && score.value > 0)
  const isLost = computed(() => isTimeOver.value && !isWon.value)
  const canSubmit = computed(() => isPlaying.value || isFinished.value)

  /**
   * Handle game over - win or lose
   */
  async function handleGameOver(won: boolean, finalAnswers?: unknown[]) {
    stopTimer()
    gameState.value = 'submitting'

    // Calculate score (can be overridden by game-specific logic)
    score.value = won ? calculateScore() : 0

    if (finalAnswers) {
      answers.value = finalAnswers
    }

    // Auto submit if enabled
    if (autoSubmit) {
      await submitScore(score.value, answers.value)
    }

    gameState.value = 'finished'

    // Call callbacks
    const result: GameResult = {
      score: score.value,
      won,
      timeMs: (maxTime - time.value) * 1000,
      answers: answers.value,
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
   * Override this in specific games for custom scoring
   */
  function calculateScore(): number {
    const timeBonus = Math.floor(time.value / 10) // 10 points per 10 seconds remaining
    return Math.min(100, 50 + timeBonus) // Base 50 + time bonus, max 100
  }

  /**
   * Start a new game
   */
  async function startGame() {
    gameState.value = 'launching'

    try {
      await session.launchGame(minigameId)
      gameState.value = 'playing'
      startTimer()
    } catch (error) {
      console.error('Failed to start game:', error)
      gameState.value = 'error'
      throw error
    }
  }

  /**
   * Submit score to the server
   */
  async function submitScore(finalScore: number, finalAnswers?: unknown[]) {
    if (!session.game?.sessionId) {
      console.warn('No active game session to submit')
      return
    }

    try {
      await session.submitScore(
        finalScore,
        finalAnswers ?? answers.value,
        (maxTime - time.value) * 1000,
      )
    } catch (error) {
      console.error('Failed to submit score:', error)
      throw error
    }
  }

  /**
   * Finish the game manually (called by game-specific logic)
   */
  async function finish(won: boolean, finalAnswers?: unknown[]) {
    await handleGameOver(won, finalAnswers)
  }

  /**
   * Reset game state (keep session)
   */
  function reset() {
    stopTimer()
    time.value = maxTime
    score.value = 0
    answers.value = []
    gameState.value = 'idle'
  }

  /**
   * Retry the game (reset + start new)
   */
  async function retry() {
    reset()
    await startGame()
  }

  // Cleanup on unmount
  onUnmounted(() => {
    stopTimer()
  })

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

export default useGame
