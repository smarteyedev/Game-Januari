/**
 * Legacy useGame Types
 * Kept for backward compatibility
 */

import type { Ref, ComputedRef } from 'vue'
import type { GameState, GameResult, MinigameId } from '@/domain/types'

export type UseGameOptions = {
  /** Maximum time in seconds for the game */
  maxTime?: number
  /** Minigame ID for session tracking */
  minigameId?: MinigameId | string
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
  finish: (won: boolean, finalAnswers?: unknown[]) => Promise<void>
  reset: () => void
  retry: () => Promise<void>

  // Session (legacy - use any to avoid circular dependency)
  session: any
}

