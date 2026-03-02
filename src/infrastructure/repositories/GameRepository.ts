/**
 * Game Repository Implementation
 * Part of the infrastructure layer
 */

import type { IGameRepository, LevelData } from '@/domain/interfaces'
import { type GameSession, type MinigameId, MinigameId as MinigameIdEnum } from '@/domain/types'
import { httpClient } from '../api/ApiClient'
import { API_ENDPOINTS } from '@/utils/constants'

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

// Level Repository Implementation
export class LevelRepository {
  async getLevel<T extends LevelData>(
    minigameId: MinigameId,
    level: number,
    offline = false,
  ): Promise<T> {
    if (offline) {
      // Load from local assets based on minigame id
      const mapping: Record<MinigameId, () => Promise<any>> = {
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
        throw new Error('No local game data available for this minigame')
      }

      const mod = await loader()
      // Vite returns JSON as default export
      const data: T = (mod && (mod.default ?? mod)) || mod

      const raw: any = data as any

      // 1) Old format: { data: [ ...levels ] }
      if (Array.isArray(raw.data)) {
        const found = raw.data.find((d: any) => d.id === level) || raw.data[0]
        return found as T
      }

      // 2) Root array format: [ { id, ... }, ... ]
      if (Array.isArray(raw)) {
        const found = raw.find((d: any) => d.id === level) || raw[0]
        return found as T
      }

      // 3) Object-per-level keyed by id (e.g. { "1": { ... } })
      if (raw[level] && typeof raw[level] === 'object') {
        return raw[level] as T
      }

      // 4) New single-level structured format (e.g. { intro, config, content })
      // Return the whole object and let callers read fields they need.
      return raw as T
    }

    const endpoint = this.getEndpoint(minigameId)
    const response = await httpClient.get<T>(API_ENDPOINTS.MINIGAME_LEVELS(endpoint, level))
    return response.data
  }

  /* TODO
  async getAvailableLevels(minigameId: MinigameId): Promise<number[]> {
    const endpoint = this.getEndpoint(minigameId)
    const response = await httpClient.get<number[]>(`/api/v1/minigames/${endpoint}/levels`)
    return response.data
  }
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
