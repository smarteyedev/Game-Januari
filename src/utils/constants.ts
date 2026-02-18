/**
 * Constants - Application Constants
 */

import { MinigameId } from '@/domain/types'

export { MinigameId }

// Minigame ID mappings
export const MINIGAME_IDS = {
  automationSpotter: MinigameId.AutomationSpotter,
  dragAndDrop: MinigameId.DragAndDrop,
  memory: MinigameId.Memory,
  connections: MinigameId.Connections,
  scrambles: MinigameId.Scrambles,
  matrix: MinigameId.Matrix,
}

// API Endpoints
export const API_ENDPOINTS = {
  GUEST_SESSION: '/api/v1/guest/session',
  GAME_LAUNCH: '/api/v1/hpl/game/launch',
  SCORE_SUBMIT: (sessionId: string) => `/api/v1/hpl/session/${sessionId}/submit`,
  MINIGAME_LEVELS: (minigameId: string, level: number) =>
    `/api/v1/minigames/${minigameId}/levels/${level}`,
}

// Game Configuration Defaults
export const GAME_CONFIG = {
  DEFAULT_MAX_TIME: 180,
  SCORE_BASE: 50,
  SCORE_BONUS_PER_10_SEC: 10,
  SCORE_MAX: 100,
  CARD_FLIP_DELAY: 800,
}
