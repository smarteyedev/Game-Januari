/**
 * Game Options - Centralized configuration for all games
 * Contains timer, game service, and game-specific options
 */

import type { MinigameId } from '@/domain/types'

// TIMER OPTIONS
export interface TimerOptions {
  /** Maximum time in seconds for the game */
  maxTime: number
  /** Auto-start timer immediately */
  immediate?: boolean
  /** Callback when timer finishes */
  onFinish?: () => void
}

export const DEFAULT_TIMER_OPTIONS: TimerOptions = {
  maxTime: 180,
  immediate: false,
}

// GAME SERVICE OPTIONS
export interface GameServiceOptions {
  /** Maximum time in seconds for the game */
  maxTime?: number
  /** Minigame ID for session tracking */
  minigameId: MinigameId
  /** If true will use offline mode (no backend) */
  offline?: boolean
  /** Auto-submit score when game ends */
  autoSubmit?: boolean
  /** Callback when game is finished (win) */
  onWin?: (result: unknown) => void
  /** Callback when game is lost (time out) */
  onLose?: () => void
  /** Callback when game session is submitted */
  onSubmit?: (result: unknown) => void
}

export const DEFAULT_GAME_SERVICE_OPTIONS = {
  maxTime: 180,
  offline: false,
  autoSubmit: true,
}

// BASE GAME OPTIONS
export interface BaseGameOptions {
  /** Game title displayed to user */
  title: string
  /** Game description/instructions */
  description?: string
  /** Current time in seconds */
  time: number
  /** Maximum time in seconds */
  maxTime?: number
  /** Loading state */
  loading?: boolean
  /** Error state */
  error?: unknown
  /** Retry function for error state */
  retryFn?: () => void
  /** Whether the intro modal should show */
  showIntro?: boolean
  /** Current progress value */
  currentProgress?: number
  /** Target progress value */
  targetProgress?: number
  /** Whether to show progress bar */
  showProgress?: boolean
  /** Whether the game is checked/done */
  isChecked?: boolean
  /** Whether the game is won */
  isWin?: boolean
  /** Whether the game is lost */
  hasLost?: boolean
  /** Whether to hide submit button */
  hideSubmit?: boolean
}

export const DEFAULT_BASE_GAME_OPTIONS: Partial<BaseGameOptions> = {
  maxTime: 180,
  loading: false,
  showIntro: false,
  showProgress: false,
  isChecked: false,
  isWin: false,
  hasLost: false,
  hideSubmit: false,
}

// GAME-SPECIFIC OPTIONS

// SCRAMBLES GAME

export interface ScramblesOptions {
  /** Maximum number of attempts allowed */
  maxAttempts: number
  /** Number of junk letters to add (makes game harder) */
  junkLetters: number
}

export const DEFAULT_SCRAMBLES_OPTIONS: ScramblesOptions = {
  maxAttempts: 4,
  junkLetters: 3,
}

// CONNECTIONS GAME

export interface ConnectionsOptions {
  /** Maximum number of attempts allowed */
  maxAttempts: number
  /** Color pool for categories */
  colorPool: string[]
}

export const DEFAULT_CONNECTIONS_OPTIONS: ConnectionsOptions = {
  maxAttempts: 4,
  colorPool: [
    'bg-red-200',
    'bg-orange-200',
    'bg-amber-200',
    'bg-yellow-200',
    'bg-lime-200',
    'bg-green-200',
    'bg-emerald-200',
    'bg-teal-200',
    'bg-cyan-200',
    'bg-sky-200',
    'bg-blue-200',
    'bg-indigo-200',
    'bg-violet-200',
    'bg-purple-200',
    'bg-fuchsia-200',
    'bg-pink-200',
    'bg-rose-200',
  ],
}

// MEMORY GAME

export interface MemoryGameOptions {
  /** Delay in milliseconds before flipping cards back */
  cardFlipDelay: number
}

export const DEFAULT_MEMORY_GAME_OPTIONS: MemoryGameOptions = {
  cardFlipDelay: 800,
}

// DRAG AND DROP GAME

export interface DragAndDropOptions {
  /** No specific options currently */
}

export const DEFAULT_DRAG_AND_DROP_OPTIONS: DragAndDropOptions = {}

// AUTOMATION SPOTTER GAME

export interface AutomationSpotterOptions {
  /** No specific options currently */
}

export const DEFAULT_AUTOMATION_SPOTTER_OPTIONS: AutomationSpotterOptions = {}

// MATRIX GAME

export interface MatrixGameOptions {
  /** No specific options currently */
}

export const DEFAULT_MATRIX_GAME_OPTIONS: MatrixGameOptions = {}

// SCORING OPTIONS

export interface ScoringOptions {
  /** Base score for winning */
  baseScore: number
  /** Bonus points per 10 seconds remaining */
  scoreBonusPer10Sec: number
  /** Maximum possible score */
  maxScore: number
}

export const DEFAULT_SCORING_OPTIONS: ScoringOptions = {
  baseScore: 50,
  scoreBonusPer10Sec: 10,
  maxScore: 100,
}

// ALL GAME OPTIONS (UNION TYPE)

export type GameOptions = {
  timer: TimerOptions
  gameService: GameServiceOptions
  baseGame: BaseGameOptions
  scoring: ScoringOptions
} & (
  | { gameType: 'scrambles'; gameSpecific: ScramblesOptions }
  | { gameType: 'connections'; gameSpecific: ConnectionsOptions }
  | { gameType: 'memory'; gameSpecific: MemoryGameOptions }
  | { gameType: 'dragAndDrop'; gameSpecific: DragAndDropOptions }
  | { gameType: 'automationSpotter'; gameSpecific: AutomationSpotterOptions }
  | { gameType: 'matrix'; gameSpecific: MatrixGameOptions }
)

// HELPER FUNCTION

/**
 * Get default game options based on game type
 */
export function getDefaultGameOptions(gameType: GameOptions['gameType']) {
  const baseOptions = {
    timer: DEFAULT_TIMER_OPTIONS,
    gameService: DEFAULT_GAME_SERVICE_OPTIONS,
    scoring: DEFAULT_SCORING_OPTIONS,
  }

  switch (gameType) {
    case 'scrambles':
      return { ...baseOptions, gameType, gameSpecific: DEFAULT_SCRAMBLES_OPTIONS }
    case 'connections':
      return { ...baseOptions, gameType, gameSpecific: DEFAULT_CONNECTIONS_OPTIONS }
    case 'memory':
      return { ...baseOptions, gameType, gameSpecific: DEFAULT_MEMORY_GAME_OPTIONS }
    case 'dragAndDrop':
      return { ...baseOptions, gameType, gameSpecific: DEFAULT_DRAG_AND_DROP_OPTIONS }
    case 'automationSpotter':
      return { ...baseOptions, gameType, gameSpecific: DEFAULT_AUTOMATION_SPOTTER_OPTIONS }
    case 'matrix':
      return { ...baseOptions, gameType, gameSpecific: DEFAULT_MATRIX_GAME_OPTIONS }
    default:
      return baseOptions
  }
}
