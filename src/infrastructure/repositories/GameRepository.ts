/**
 * Game Repository Implementation
 * Part of the infrastructure layer
 */

import type { IGameRepository, LevelData } from '@/domain/interfaces'
import { type GameSession, type MinigameId, MinigameId as MinigameIdEnum } from '@/domain/types'
import { httpClient } from '../api/ApiClient'

export class GameRepository implements IGameRepository {
  async launchGame(
    gameId: string,
    minigameId: MinigameId,
    authToken: string,
  ): Promise<{ sessionId: string }> {
    const response = await httpClient.post<{ sessionId: string }>(
      '/api/v1/hpl/game/launch',
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
      `/api/v1/hpl/session/${sessionId}/submit`,
      { score, answers, timeMs },
      { headers: { Authorization: `Bearer ${authToken}` } },
    )
  }

  async getGameSession(sessionId: string, authToken: string): Promise<GameSession> {
    const response = await httpClient.get<GameSession>(
      `/api/v1/hpl/session/${sessionId}`,
      { headers: { Authorization: `Bearer ${authToken}` } },
    )

    return response.data
  }
}

// Level Repository Implementation
export class LevelRepository {
  async getLevel<T extends LevelData>(
    minigameId: MinigameId,
    level: number,
  ): Promise<T> {
    const endpoint = this.getEndpoint(minigameId)
    const response = await httpClient.get<T>(`/api/v1/minigames/${endpoint}/levels/${level}`)
    return response.data
  }

  async getAvailableLevels(minigameId: MinigameId): Promise<number[]> {
    const endpoint = this.getEndpoint(minigameId)
    const response = await httpClient.get<number[]>(`/api/v1/minigames/${endpoint}/levels`)
    return response.data
  }

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

