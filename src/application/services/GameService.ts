/**
 * Game Service - Application Layer
 * Handles game-related use cases and business logic
 */

import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import { Game } from '@/domain/entities/Game'
import {
  GameState,
  type MinigameId,
  type GameResult,
  type GameResultResponse,
  type SuccessResultData,
} from '@/domain/types'
import { gameRepository, sessionRepository } from '@/infrastructure'
import { useTimer } from '@/composables/useTimer'
import { useSessionStore } from '@/stores/session'
import { computeScore, getFeedback, getSpeedFeedback, type ScoreContext, type ScoringParams } from './ScoringService'
import { logger } from '@/infrastructure/logging'
import dummyResultData from '@/assets/gameData/dummyResult.json'

// ============================================================================
// Types
// ============================================================================

export type GameServiceOptions = {
  /** Maximum time in seconds for the game */
  maxTime?: number
  /** Minigame ID for session tracking */
  minigameId: MinigameId
  /** If true will use backend service */
  offline?: boolean
  /** Callback when game is finished (win) */
  onWin?: (result: GameResult) => void
  /** Callback when game is lost (time out) */
  onLose?: () => void
  /** Callback when game session is submitted */
  onSubmit?: (result: GameResult) => void
  /** Auto-submit score when game ends */
  autoSubmit?: boolean
  /** Default scoring parameters */
  scoringParams?: ScoringParams
  /** Scoring strategy name to use */
  scoringStrategy?: string
}

export interface FinishOptions {
  answers?: unknown[]
  score?: number
  scoreContext?: ScoreContext
  scoringParams?: ScoringParams
  scoringStrategy?: string
}

export type GameServiceReturn = {
  // State
  _gameState: Ref<GameState>
  _isPlaying: ComputedRef<boolean>
  _isFinished: ComputedRef<boolean>
  _isWon: ComputedRef<boolean>
  _isLost: ComputedRef<boolean>
  _canSubmit: ComputedRef<boolean>

  // Timer
  time: Ref<number>
  isTimeOver: Ref<boolean>
  startTimer: () => void
  stopTimer: () => void
  resetTimer: () => void

  // Game actions
  startGame: () => Promise<void>
  submitScore: (score: number, answers?: unknown[]) => Promise<void>
  finish: (won: boolean, options?: FinishOptions) => Promise<void>
  reset: () => void
  retry: () => Promise<void>

  // Session store
  session: ReturnType<typeof useSessionStore>

  // Result data for modal
  successResultData: Ref<SuccessResultData | undefined>
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_MAX_TIME = 180

// ============================================================================
// Main Function
// ============================================================================

/**
 * Game Service - Manages game lifecycle and state
 * Provides reactive game state, timer management, and score submission
 */
export function useGameService(options: GameServiceOptions): GameServiceReturn {
  const {
    maxTime = DEFAULT_MAX_TIME,
    minigameId,
    offline = false,
    onWin,
    onLose,
    onSubmit,
    autoSubmit = true,
    scoringParams: defaultScoringParams = {},
    scoringStrategy: defaultScoringStrategy = 'default'
  } = options

  // Game entity
  const game = ref<Game>(
    new Game({
      gameId: '',
      minigameId,
      state: GameState.Idle,
    }),
  )

  // Timer
  const {
    time,
    isGameOver: isTimeOver,
    start: startTimer,
    stop: stopTimer,
    restart: resetTimer,
  } = useTimer(maxTime, {
    onFinish: () => {
      handleGameOver(false)
    },
  })

  // Computed states
  const _gameState = computed(() => game.value.state)
  const _isPlaying = computed(() => game.value.isPlaying)
  const _isFinished = computed(() => game.value.isFinished)
  const _isWon = computed(() => game.value.isFinished && _didWin.value)
  const _isLost = computed(() => game.value.isFinished && !_didWin.value)
  const _canSubmit = computed(() => _isPlaying.value || _isFinished.value)
  const _didWin = ref(false)

  // Result data for modal
  const successResultData = ref<SuccessResultData | undefined>(undefined)

  // ==========================================================================
  // Private Methods
  // ==========================================================================

  /**
   * Fetch game result data from API or use offline dummy data
   */
  async function fetchGameResultData(
    won: boolean,
  ): Promise<{ success?: SuccessResultData; failure?: unknown }> {
    const session = sessionRepository.getCurrentSession()

    if (offline || !session || !game.value.sessionId) {
      // Use offline dummy data
      logger.info('Using offline dummy result data', { won })
      const dummyData = dummyResultData as GameResultResponse
      // Always provide result data for both win and lose cases so the modal can show
      return won
        ? { success: dummyData.success }
        : { success: dummyData.failure ?? dummyData.success }
    }

    try {
      // Fetch from API
      const resultData = await gameRepository.getGameResult(
        game.value.sessionId,
        session.accessToken,
      )
      logger.info('Fetched game result data from API', { won, sessionId: game.value.sessionId })
      return won ? { success: resultData.success } : { failure: undefined }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      logger.error('Failed to fetch game result from API, using offline data', error)

      const dummyData = dummyResultData as GameResultResponse
      return won ? { success: dummyData.success } : { failure: undefined }
    }
  }

  /**
   * Handle game over - win or lose
   */
  async function handleGameOver(
    won: boolean, 
    finalAnswers?: unknown[], 
    finalScore?: number,
    scoreContext?: ScoreContext,
    scoringParams?: ScoringParams,
    scoringStrategy?: string
  ) {
    stopTimer()
    game.value.setSubmitting()

    _didWin.value = won
    
    let resolvedScore = 0
    if (typeof finalScore === 'number') {
      resolvedScore = finalScore
    } else if (won) {
      if (scoreContext) {
        resolvedScore = computeScore(
          { 
            timeUsed: maxTime - time.value, 
            maxTime, 
            ...scoreContext 
          }, 
          { 
            ...defaultScoringParams, 
            ...scoringParams 
          },
          scoringStrategy ?? defaultScoringStrategy
        )
      } else {
        resolvedScore = 100
      }
    }

    if (finalAnswers) {
      game.value.answers.push(...finalAnswers)
    }

    // Auto submit if enabled
    if (autoSubmit) {
      await submitScore(resolvedScore, game.value.answers)
    }

    // Fetch result data from API or use offline dummy data
    const resultData = await fetchGameResultData(won)
    if (resultData.success) {
      successResultData.value = {
        ...resultData.success,
        score: resolvedScore,
        feedback: getFeedback(resolvedScore),
        speedFeedback: getSpeedFeedback(time.value / maxTime),
      }
    }
    if (resultData.failure) {
      logger.debug('useGameService: set failureResultData', {
        minigameId,
        failure: resultData.failure,
      })
    }

    game.value.finish(won, resolvedScore, finalAnswers)

    // Call callbacks
    const result: GameResult = {
      score: game.value.score,
      won,
      timeMs: (maxTime - time.value) * 1000,
      answers: game.value.answers,
      sessionId: game.value.sessionId,
    }

    if (won) {
      logger.info('Game won', { minigameId, score: resolvedScore, timeMs: result.timeMs })
      onWin?.(result)
    } else {
      logger.info('Game lost', { minigameId, timeMs: result.timeMs })
      onLose?.()
    }

    onSubmit?.(result)
  }

  // ==========================================================================
  // Public Methods
  // ==========================================================================

  /**
   * Start a new game
   */
  async function startGame() {
    logger.debug('Starting game', { minigameId, offline, maxTime })

    if (offline) {
      // if offline or no backend simulate launched game
      game.value = new Game({
        gameId: 'offline-game',
        minigameId,
        state: GameState.Playing,
      })

      game.value.launch('offline-session')
      game.value.start()
      startTimer()
      logger.info('Game started in offline mode', { minigameId })
      return
    }

    // normal with backend flow
    const session = sessionRepository.getCurrentSession()
    if (!session) {
      const error = new Error('No guest session available')
      logger.error('Failed to start game', error, { minigameId })
      throw error
    }

    game.value = new Game({
      gameId: session.gameId,
      minigameId,
      state: GameState.Launching,
    })

    const response = await gameRepository.launchGame(
      session.gameId,
      minigameId,
      session.accessToken,
    )

    if (!response?.sessionId) {
      const error = new Error('launchGame did not return sessionId')
      logger.error('Failed to launch game', error, { minigameId })
      throw error
    }

    game.value.launch(response.sessionId)
    game.value.start()
    startTimer()
    logger.info('Game started with backend', { minigameId, sessionId: response.sessionId })
  }

  /**
   * Submit score to the server
   */
  async function submitScore(finalScore: number, finalAnswers?: unknown[]) {
    if (offline) {
      const feedback = getFeedback(finalScore)
      logger.info(`Offline mode → score: ${finalScore}, feedback: ${feedback}`)
      return
    }

    const session = sessionRepository.getCurrentSession()
    if (!session || !game.value.sessionId) {
      logger.warn('No active game session to submit')
      return
    }

    await gameRepository.submitScore(
      game.value.sessionId,
      finalScore,
      finalAnswers ?? game.value.answers,
      (maxTime - time.value) * 1000,
      session.accessToken,
    )

    logger.info('Score submitted', {
      sessionId: game.value.sessionId,
      score: finalScore,
      timeMs: (maxTime - time.value) * 1000,
    })
  }

  /**
   * Finish the game manually
   */
  function finish(won: boolean, finishOptions?: FinishOptions) {
    return handleGameOver(
      won, 
      finishOptions?.answers, 
      finishOptions?.score, 
      finishOptions?.scoreContext, 
      finishOptions?.scoringParams,
      finishOptions?.scoringStrategy
    )
  }

  /**
   * Reset game state
   */
  function reset() {
    stopTimer()
    time.value = maxTime
    _didWin.value = false
    game.value.reset()
    logger.debug('Game reset', { minigameId })
  }

  /**
   * Retry the game
   */
  async function retry() {
    reset()
    await startGame()
  }

  // Session store
  const session = useSessionStore()

  return {
    // State
    _gameState,
    _isPlaying,
    _isFinished,
    _isWon,
    _isLost,
    _canSubmit,

    // Timer
    time,
    isTimeOver,
    startTimer,
    stopTimer,
    resetTimer,

    // Game actions
    startGame,
    submitScore,
    finish,
    reset,
    retry,

    // Session
    session,

    // Result data for modal
    successResultData,
  }
}

export default useGameService
