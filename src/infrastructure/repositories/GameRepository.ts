/**
 * Game Repository Implementation
 * Part of the infrastructure layer
 */

import type { IGameRepository, LevelData } from '@/domain/interfaces'
import {
  type GameSession,
  type MinigameId,
  MinigameId as MinigameIdEnum,
  type BaseLevelData,
  type LevelDataArrayResponse,
  type LevelDataRootArrayResponse,
  type LevelDataKeyedResponse,
} from '@/domain/types'
import { httpClient } from '../api/ApiClient'
import { API_ENDPOINTS } from '@/utils/constants'
import { logger } from '../logging'

export class GameRepository implements IGameRepository {
  async launchGame(
    gameId: string,
    minigameId: MinigameId,
    authToken: string,
  ): Promise<{ sessionId: string }> {
    const response = await httpClient.post<{ sessionId: string }>(
      API_ENDPOINTS.GAME_LAUNCH,
      { gameId, minigameId },
      { headers: { Authorization: `Bearer ${authToken}` } },
    )

    return response.data
  }

  async submitScore(
    sessionId: string,
    score: number,
    answers: unknown[],
    timeMs: number,
    authToken: string,
  ): Promise<void> {
    await httpClient.post(
      API_ENDPOINTS.SCORE_SUBMIT(sessionId),
      { score, answers, timeMs },
      { headers: { Authorization: `Bearer ${authToken}` } },
    )
  }

  async getGameSession(sessionId: string, authToken: string): Promise<GameSession> {
    const response = await httpClient.get<GameSession>(`/api/v1/hpl/session/${sessionId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })

    return response.data
  }
}

// Type for local JSON module
interface JsonModule<T> {
  default: T
  [key: string]: T
}

// Level Repository Implementation
export class LevelRepository {
  /**
   * Get level data for a specific minigame
   * Handles multiple JSON response formats for backward compatibility
   */
  async getLevel<T extends LevelData>(
    minigameId: MinigameId,
    level: number,
    offline = false,
  ): Promise<T> {
    if (offline) {
      return this.getLevelFromLocal<T>(minigameId, level)
    }

    const endpoint = this.getEndpoint(minigameId)
    const response = await httpClient.get<T>(API_ENDPOINTS.MINIGAME_LEVELS(endpoint, level))
    return response.data
  }

  /**
   * Load level data from local JSON assets
   */
  private async getLevelFromLocal<T extends LevelData>(
    minigameId: MinigameId,
    level: number,
  ): Promise<T> {
    // Load from local assets based on minigame id
    const mapping: Record<MinigameId, () => Promise<JsonModule<unknown>>> = {
      [MinigameIdEnum.AutomationSpotter]: () =>
        import('@/assets/gameData/automationSpotter/gamedata.json'),
      [MinigameIdEnum.DragAndDrop]: () => import('@/assets/gameData/dragAndDrop/gamedata.json'),
      [MinigameIdEnum.Memory]: () => import('@/assets/gameData/memoryGame/gamedata.json'),
      [MinigameIdEnum.Connections]: () =>
        import('@/assets/gameData/connectionsGame/gamedata.json'),
      [MinigameIdEnum.Scrambles]: () => import('@/assets/gameData/scramblesGame/gamedata.json'),
      [MinigameIdEnum.Matrix]: () => import('@/assets/gameData/matrixGame/gamedata.json'),
    }

    const loader = mapping[minigameId]
    if (!loader) {
      const error = new Error(`No local game data available for minigame: ${minigameId}`)
      logger.error('Level loading failed', error, { minigameId, level })
      throw error
    }

    try {
      const mod = await loader()
      // Vite returns JSON as default export
      const raw = (mod && (mod.default ?? mod)) || mod

      return this.parseLevelData<T>(raw, level)
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      logger.error('Failed to load local level data', error, { minigameId, level })
      throw error
    }
  }

  /**
   * Parse level data from various JSON formats
   * Supports:
   * 1) Old format: { data: [ ...levels ] }
   * 2) Root array format: [ { id, ... }, ... ]
   * 3) Object-per-level keyed by id (e.g. { "1": { ... } })
   * 4) New single-level structured format (e.g. { intro, config, content })
   */
  private parseLevelData<T extends LevelData>(raw: unknown, level: number): T {
    // Type guard for old format: { data: [ ...levels ] }
    if (
      typeof raw === 'object' &&
      raw !== null &&
      'data' in raw &&
      Array.isArray((raw as LevelDataArrayResponse).data)
    ) {
      const dataArray = (raw as LevelDataArrayResponse).data
      const found = dataArray.find((d: BaseLevelData) => d.id === level) || dataArray[0]
      logger.debug('Loaded level from data array format', { level, foundId: found?.id })
      return found as T
    }

    // Type guard for root array format: [ { id, ... }, ... ]
    if (Array.isArray(raw)) {
      const dataArray = raw as LevelDataRootArrayResponse
      const found = dataArray.find((d: BaseLevelData) => d.id === level) || dataArray[0]
      logger.debug('Loaded level from root array format', { level, foundId: found?.id })
      return found as T
    }

    // Type guard for keyed format: { "1": { ... }, "2": { ... } }
    if (typeof raw === 'object' && raw !== null) {
      const keyedRaw = raw as LevelDataKeyedResponse
      const levelKey = String(level)
      if (keyedRaw[levelKey] && typeof keyedRaw[levelKey] === 'object') {
        logger.debug('Loaded level from keyed format', { level, levelKey })
        return keyedRaw[levelKey] as T
      }

      // Single-level structured format - return whole object
      logger.debug('Loaded level from single-level format', { level })
      return raw as T
    }

    // Fallback: return as-is
    logger.warn('Unknown level data format, returning raw data', { level })
    return raw as T
  }

  /**
   * Get available levels for a minigame (when online)
   * Note: This requires backend API support
   */
  async getAvailableLevels(minigameId: MinigameId): Promise<number[]> {
    const endpoint = this.getEndpoint(minigameId)
    try {
      const response = await httpClient.get<number[]>(`/api/v1/minigames/${endpoint}/levels`)
      return response.data
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      logger.error('Failed to fetch available levels', error, { minigameId, endpoint })
      // Return empty array as fallback for offline mode
      return []
    }
  }

  /**
   * Map minigame ID to API endpoint
   */
  private getEndpoint(minigameId: MinigameId): string {
    const endpoints: Record<MinigameId, string> = {
      [MinigameIdEnum.AutomationSpotter]: 'automation-spotter',
      [MinigameIdEnum.DragAndDrop]: 'drag-and-drop',
      [MinigameIdEnum.Memory]: 'memory-game',
      [MinigameIdEnum.Connections]: 'connections-game',
      [MinigameIdEnum.Scrambles]: 'scrambles-game',
      [MinigameIdEnum.Matrix]: 'matrix-game',
    }
    return endpoints[minigameId]
  }
}

// Singleton instances
export const gameRepository = new GameRepository()
export const levelRepository = new LevelRepository()

export default GameRepository
