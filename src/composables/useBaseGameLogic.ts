import { ref, onMounted, watch } from 'vue'
import type { IntroData } from '@/domain/types'
import { levelRepository } from '@/infrastructure'
import {
  useGameService,
  type GameServiceOptions,
  type FinishOptions,
} from '@/application/services/GameService'

export interface BaseGameLogicOptions<T = any> extends GameServiceOptions {
  levelId?: number
  fetchLevel: (levelId: number, offline: boolean) => Promise<T>
  /** Index of intro data to fetch or custom intro data */
  introId?: number | IntroData
  /** If true, skip automatic intro fetching in onMounted */
  skipIntroFetch?: boolean
}

export function useBaseGameLogic<T = any>(options: BaseGameLogicOptions<T>) {
  const {
    levelId = 1,
    fetchLevel,
    minigameId,
    offline = true,
    maxTime = 180,
    introId = 0,
    skipIntroFetch = false,
  } = options

  // UI State
  const showIntro = ref(true)
  const attempts = ref(0)
  const introData = ref<IntroData | undefined>(undefined)
  const introLoading = ref(false)
  const gameLoading = ref(false)
  const gameError = ref<unknown>(null)

  // Game Service
  const gameService = useGameService({
    ...options,
    maxTime,
    minigameId,
    offline,
  })

  // Watch for timeout
  watch(
    () => gameService.isTimeOver.value,
    (over) => {
      if (over && !gameService._isWon.value && !gameService._isLost.value) {
        gameService.finish(false)
      }
    },
  )

  // Actions
  async function start() {
    showIntro.value = false
    await gameService.startGame()
  }

  async function retryGame(resetBoardFn: () => void) {
    attempts.value += 1
    resetBoardFn()
    await gameService.retry()
  }

  async function finishGame(won: boolean, finishOptions?: FinishOptions) {
    return gameService.finish(won, finishOptions)
  }

  function setIntroData(data: IntroData) {
    introData.value = data
  }

  // Lifecycle
  onMounted(async () => {
    gameLoading.value = true

    const fetchIntroPromise = (async () => {
      if (skipIntroFetch) return

      if (typeof introId === 'object' && introId !== null) {
        introData.value = introId as IntroData
        return
      }

      introLoading.value = true
      try {
        const intros = await levelRepository.getIntroData()
        const idx = typeof introId === 'number' ? introId : 0
        introData.value = intros[idx] || intros[0]
      } catch (err) {
        console.error('Failed to fetch intro data', err)
      } finally {
        introLoading.value = false
      }
    })()

    const fetchLevelPromise = (async () => {
      try {
        await fetchLevel(levelId, !!offline)
      } catch (err) {
        gameError.value = err
      }
    })()

    await Promise.all([fetchIntroPromise, fetchLevelPromise])
    gameLoading.value = false
  })

  return {
    ...gameService,
    // Alias some gameService members for convenience
    isPlaying: gameService._isPlaying,
    isFinished: gameService._isFinished,
    isWon: gameService._isWon,
    isLost: gameService._isLost,

    showIntro,
    attempts,
    introData,
    introLoading,
    gameLoading,
    gameError,
    start,
    retryGame,
    finishGame,
    setIntroData,
  }
}
