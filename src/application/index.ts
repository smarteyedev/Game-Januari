/**
 * Application Layer - Barrel exports
 * Re-exports all application services for convenient imports
 */

// Services
export { useGameService } from './services/GameService'
export type { GameServiceOptions, GameServiceReturn } from './services/GameService'

export { computeScore, getFeedback } from './services/ScoringService'
export type { ScoreContext, ScoringParams } from './services/ScoringService'
