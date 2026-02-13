/**
 * useGame - Game Composable
 * Legacy wrapper for backward compatibility
 * Use useGameService from application layer for new code
 */

import { useGameService } from '@/application/services/GameService'
import { MINIGAME_IDS } from '@/utils/constants'
import type { UseGameOptions, UseGameReturn } from './useGame.types'

/**
 * @deprecated Use useGameService from @/application/services/GameService instead
 */
export function useGame(options: UseGameOptions = {}): UseGameReturn {
  // Convert string minigameId to MinigameId enum if needed
  const minigameId = typeof options.minigameId === 'string' 
    ? MINIGAME_IDS[options.minigameId as keyof typeof MINIGAME_IDS] || options.minigameId
    : options.minigameId || MINIGAME_IDS.memory

  const service = useGameService({
    maxTime: options.maxTime,
    minigameId,
    onWin: options.onWin,
    onLose: options.onLose,
    onSubmit: options.onSubmit,
    autoSubmit: options.autoSubmit,
  })

  return {
    gameState: service.gameState,
    isPlaying: service.isPlaying,
    isFinished: service.isFinished,
    isWon: service.isWon,
    isLost: service.isLost,
    canSubmit: service.canSubmit,
    time: service.time,
    isTimeOver: service.isTimeOver,
    startTimer: service.startTimer,
    stopTimer: service.stopTimer,
    resetTimer: service.resetTimer,
    startGame: service.startGame,
    submitScore: service.submitScore,
    finish: service.finish,
    reset: service.reset,
    retry: service.retry,
    session: service.session,
  }
}

export default useGame
