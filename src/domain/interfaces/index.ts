/**
 * Repository Interfaces - Contracts for data access
 * These define the data operations required by the domain layer
 */

import type { GuestSession, GameSession, GameState, GameResult, MinigameId } from '../types'

// ============================================================================
// Session Repository Interface
// ============================================================================

export interface ISessionRepository {
  /**
   * Create a new guest session
   */
  createGuestSession(): Promise<GuestSession>

  /**
   * Load session from storage
   */
  loadSession(): GuestSession | null

  /**
   * Save session to storage
   */
  saveSession(session: GuestSession): void

  /**
   * Clear session from storage
   */
  clearSession(): void

  /**
   * Get current session
   */
  getCurrentSession(): GuestSession | null

  /**
   * Check if session is valid
   */
  isSessionValid(): boolean
}

// ============================================================================
// Game Repository Interface
// ============================================================================

export interface IGameRepository {
  /**
   * Launch a game session
   */
  launchGame(gameId: string, minigameId: MinigameId, authToken: string): Promise<{ sessionId: string }>

  /**
   * Submit game score
   */
  submitScore(
    sessionId: string,
    score: number,
    answers: unknown[],
    timeMs: number,
    authToken: string,
  ): Promise<void>

  /**
   * Get game session status
   */
  getGameSession(sessionId: string, authToken: string): Promise<GameSession>
}

// ============================================================================
// Level Repository Interface
// ============================================================================

export interface LevelData {
  id?: number
  [key: string]: unknown
}

export interface ILevelRepository {
  /**
   * Fetch level data for a specific game
   */
  getLevel<T extends LevelData>(minigameId: MinigameId, level: number): Promise<T>

  /**
   * Get available levels for a game
   */
  getAvailableLevels(minigameId: MinigameId): Promise<number[]>
}

// ============================================================================
// Storage Interface
// ============================================================================

export interface IStorageService {
  get<T>(key: string): T | null
  set<T>(key: string, value: T): void
  remove(key: string): void
  clear(): void
}

