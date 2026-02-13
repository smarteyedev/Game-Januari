/**
 * Session Entity - Represents a user session in the game
 */

import { GameState, type MinigameId } from '../types'

export interface SessionData {
  guestId: string
  accessToken: string
  expiresAt: string
  gameId: string
  sessionId?: string
}

export class Session {
  private _guestId: string
  private _accessToken: string
  private _expiresAt: Date
  private _gameId: string
  private _sessionId?: string
  private _state: GameState = GameState.Idle

  constructor(data: SessionData) {
    this._guestId = data.guestId
    this._accessToken = data.accessToken
    this._expiresAt = new Date(data.expiresAt)
    this._gameId = data.gameId
    this._sessionId = data.sessionId
  }

  // Getters
  get guestId(): string {
    return this._guestId
  }

  get accessToken(): string {
    return this._accessToken
  }

  get expiresAt(): Date {
    return this._expiresAt
  }

  get gameId(): string {
    return this._gameId
  }

  get sessionId(): string | undefined {
    return this._sessionId
  }

  get state(): GameState {
    return this._state
  }

  get isExpired(): boolean {
    return new Date() > this._expiresAt
  }

  get authHeader(): string {
    return `Bearer ${this._accessToken}`
  }

  // State management
  setActiveGame(minigameId: MinigameId): void {
    this._state = GameState.Launching
  }

  setSessionId(sessionId: string): void {
    this._sessionId = sessionId
    this._state = GameState.Playing
  }

  setState(state: GameState): void {
    this._state = state
  }

  // Serialization
  toJSON(): SessionData {
    return {
      guestId: this._guestId,
      accessToken: this._accessToken,
      expiresAt: this._expiresAt.toISOString(),
      gameId: this._gameId,
      sessionId: this._sessionId,
    }
  }

  static fromJSON(data: SessionData): Session {
    return new Session(data)
  }
}

export default Session

