/**
 * Domain Types - Core business types
 * These are the foundational types used across all layers
 */

// ============================================================================
// ENUMS
// ============================================================================

export enum GameState {
  Idle = 'idle',
  Launching = 'launching',
  Playing = 'playing',
  Submitting = 'submitting',
  Finished = 'finished',
  Error = 'error',
}

export enum LevelButtonState {
  Unlocked = 'unlocked',
  Cleared = 'cleared',
  Locked = 'locked',
}

export enum MinigameId {
  AutomationSpotter = 'automation-spotter',
  DragAndDrop = 'drag-and-drop',
  Memory = 'memory-game',
  Connections = 'connections-game',
  Scrambles = 'scrambles-game',
  Matrix = 'matrix-game',
}

export enum ContentType {
  Text = 'text',
  Svg = 'svg',
  Image = 'img',
}

// ============================================================================
// ENTITIES
// ============================================================================

export interface GuestSession {
  guestId: string
  accessToken: string
  expiresAt: string
  gameId: string
  sessionId?: string
}

export interface GameSession {
  gameId: string
  sessionId?: string
  minigameId?: string
  state: GameState
}

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
  minigameId: MinigameId
}

export interface GameProgress {
  /** Current score */
  score: number
  /** Target score to complete */
  targetScore: number
  /** Current progress percentage */
  percentage: number
}

// ============================================================================
// API TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  meta?: {
    ts: string
  }
}

export interface ApiError {
  code: string
  details?: string
  message: string
}

// ============================================================================
// GAME SPECIFIC TYPES
// ============================================================================

export interface Keypoint {
  icon_name?: string
  description: string
}

export interface IntroData {
  title: string
  description: string
  key_points: Keypoint[]
}

export interface GameIntroMapping {
  automationSpotter: IntroData
  dragAndDropPrompt: IntroData
  memoryGame: IntroData
}

export interface Blank {
  id: number
  word: string
}

export interface FillBlank {
  sentence: string
  blanks: Blank[]
}

export interface DragCard {
  id: number
  label: string
  answer: boolean
  matched?: boolean
}

export interface Zone {
  id: boolean
  label: string
  cards: DragCard[]
}

export interface MemoryCard {
  id: number
  pairId: number
  contentType: ContentType
  value: string
  flipped?: boolean
  matched?: boolean
}
