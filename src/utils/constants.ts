/**
 * Constants - Application Constants
 * Centralized configuration for the entire application
 */

import { MinigameId } from '@/domain/types'

export { MinigameId }

// ============================================================================
// Minigame ID Mappings
// ============================================================================

/** Minigame ID constants mapped to enum values */
export const MINIGAME_IDS = {
  automationSpotter: MinigameId.AutomationSpotter,
  dragAndDrop: MinigameId.DragAndDrop,
  memory: MinigameId.Memory,
  connections: MinigameId.Connections,
  scrambles: MinigameId.Scrambles,
  matrix: MinigameId.Matrix,
} as const

// ============================================================================
// API Endpoints
// ============================================================================

/** API endpoint URL builders */
export const API_ENDPOINTS = {
  GUEST_SESSION: '/api/v1/guest/session',
  GAME_LAUNCH: '/api/v1/hpl/game/launch',
  SCORE_SUBMIT: (sessionId: string) => `/api/v1/hpl/session/${sessionId}/submit`,
  MINIGAME_LEVELS: (minigameId: string, level: number) =>
    `/api/v1/minigames/${minigameId}/levels/${level}`,
  AVAILABLE_LEVELS: (minigameId: string) => `/api/v1/minigames/${minigameId}/levels`,
} as const

// ============================================================================
// Game Configuration Defaults
// ============================================================================

/** Default game configuration values */
export const GAME_CONFIG = {
  /** Default maximum time for a game in seconds */
  DEFAULT_MAX_TIME: 180,
  /** Base score for winning */
  SCORE_BASE: 0,
  /** Bonus score per 10 seconds remaining */
  SCORE_BONUS_PER_10_SEC: 0,
  /** Maximum possible score */
  SCORE_MAX: 100,
  /** Delay for card flip animation in milliseconds */
  CARD_FLIP_DELAY: 800,
  /** Delay for showing match feedback in milliseconds */
  MATCH_FEEDBACK_DELAY: 1000,
} as const

// ============================================================================
// Scoring Configuration
// ============================================================================

/** Default scoring parameters */
export const SCORING_CONFIG = {
  /** Default time tolerance in seconds (grace period) */
  DEFAULT_TIME_TOLERANCE: 30,
  /** Weight for answer correctness in score calculation */
  ANSWER_WEIGHT: 0.7,
  /** Weight for time bonus in score calculation */
  TIME_WEIGHT: 0.3,
  /** Minimum score for passing */
  PASSING_SCORE: 50,
  /** Score threshold for perfect result */
  PERFECT_SCORE: 99,
} as const

// ============================================================================
// UI Configuration
// ============================================================================

/** UI-related constants */
export const UI_CONFIG = {
  /** Fullscreen toggle debounce in milliseconds */
  FULLSCREEN_DEBOUNCE: 300,
  /** Modal animation duration in milliseconds */
  MODAL_ANIMATION_DURATION: 300,
  /** Button click sound volume (0-1) */
  BUTTON_SOUND_VOLUME: 0.5,
} as const

// ============================================================================
// Storage Keys
// ============================================================================

/** Local storage key prefixes */
export const STORAGE_KEYS = {
  PREFIX: 'gbl_game_',
  SESSION: 'session',
  GUEST_ID: 'guest_id',
  TOKEN: 'token',
  GAME_STATE: 'game_state',
  SETTINGS: 'settings',
} as const

// ============================================================================
// Route Names
// ============================================================================

/** Application route names */
export const ROUTE_NAMES = {
  HOME: 'home',
  GAME_LIST: 'game-list',
  AUTOMATION_SPOTTER: 'automation-spotter',
  DRAG_AND_DROP: 'drag-and-drop',
  MEMORY_GAME: 'memory-game',
  CONNECTIONS_GAME: 'connections-game',
  SCRAMBLES_GAME: 'scrambles-game',
  MATRIX_GAME: 'matrix-game',
} as const
