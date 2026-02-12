/**
 * Centralized Game Types
 * Used across all game views and composables
 */

export type GameState = 'idle' | 'launching' | 'playing' | 'submitting' | 'finished' | 'error'

export interface GameResult {
  /** Final score (0-100) */
  score: number
  /** Whether the player won */
  won: boolean
  /** Time taken in milliseconds */
  timeMs: number
  /** Game-specific answers/responses */
  answers?: unknown[]
  /** Session ID for reference */
  sessionId?: string
}

export interface GameConfig {
  /** Game title displayed to user */
  title: string
  /** Game description/instructions */
  description: string
  /** Maximum time in seconds */
  maxTime: number
  /** Minigame ID for API */
  minigameId: string
}

export interface GameProgress {
  /** Current score */
  score: number
  /** Target score to complete */
  targetScore: number
  /** Current progress percentage */
  percentage: number
}

export type GameAction = 'start' | 'retry' | 'check' | 'continue' | 'submit'

export interface GameEventPayload {
  action: GameAction
  timestamp: number
  data?: unknown
}

