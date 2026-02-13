/**
 * Game Entity - Represents game state and logic
 */

import { GameState, type MinigameId, type GameResult } from '../types'

export interface GameData {
  gameId: string
  minigameId: MinigameId
  sessionId?: string
  state: GameState
  score?: number
  startTime?: Date
  endTime?: Date
}

export class Game {
  private _gameId: string
  private _minigameId: MinigameId
  private _sessionId?: string
  private _state: GameState
  private _score: number = 0
  private _startTime?: Date
  private _endTime?: Date
  private _answers: unknown[] = []

  constructor(data: Partial<GameData> & { minigameId: MinigameId; gameId: string }) {
    this._gameId = data.gameId
    this._minigameId = data.minigameId
    this._sessionId = data.sessionId
    this._state = data.state ?? GameState.Idle
    this._score = data.score ?? 0
    this._startTime = data.startTime
    this._endTime = data.endTime
  }

  // Getters
  get gameId(): string {
    return this._gameId
  }

  get minigameId(): MinigameId {
    return this._minigameId
  }

  get sessionId(): string | undefined {
    return this._sessionId
  }

  get state(): GameState {
    return this._state
  }

  get score(): number {
    return this._score
  }

  get startTime(): Date | undefined {
    return this._startTime
  }

  get endTime(): Date | undefined {
    return this._endTime
  }

  get answers(): unknown[] {
    return this._answers
  }

  get isPlaying(): boolean {
    return this._state === GameState.Playing
  }

  get isFinished(): boolean {
    return this._state === GameState.Finished
  }

  get durationMs(): number | undefined {
    if (!this._startTime || !this._endTime) return undefined
    return this._endTime.getTime() - this._startTime.getTime()
  }

  // State management
  launch(sessionId: string): void {
    this._sessionId = sessionId
    this._state = GameState.Launching
  }

  start(): void {
    this._state = GameState.Playing
    this._startTime = new Date()
  }

  setSubmitting(): void {
    this._state = GameState.Submitting
  }

  finish(won: boolean, score: number, answers?: unknown[]): void {
    this._state = GameState.Finished
    this._endTime = new Date()
    this._score = won ? score : 0
    if (answers) {
      this._answers = answers
    }
  }

  setError(): void {
    this._state = GameState.Error
  }

  reset(): void {
    this._state = GameState.Idle
    this._score = 0
    this._startTime = undefined
    this._endTime = undefined
    this._answers = []
  }

  // Serialization
  toJSON(): GameData {
    return {
      gameId: this._gameId,
      minigameId: this._minigameId,
      sessionId: this._sessionId,
      state: this._state,
      score: this._score,
      startTime: this._startTime,
      endTime: this._endTime,
    }
  }

  toResult(won: boolean): GameResult {
    return {
      score: this._score,
      won,
      timeMs: this.durationMs ?? 0,
      answers: this._answers,
      sessionId: this._sessionId,
    }
  }
}

export default Game

