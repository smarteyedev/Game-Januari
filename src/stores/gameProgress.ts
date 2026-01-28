import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useSessionStore } from '@/stores/session'
import type { LevelButtonState } from '@/types/types'

type GameKey = 'automationSpotter' | 'dragAndDropPrompt' | 'memoryGame'

const ORDER: GameKey[] = ['automationSpotter', 'dragAndDropPrompt', 'memoryGame']

const STORAGE_KEYS = {
  levels: 'game_levels_v1',
  bgmMuted: 'game_bgm_muted_v1',
  bgmVolume: 'game_bgm_volume_v1',
}

function loadOrDefault<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

const DEFAULT_LEVELS: Record<GameKey, LevelButtonState> = {
  automationSpotter: 'unlocked',
  dragAndDropPrompt: 'locked',
  memoryGame: 'locked',
}

export const useGameProgress = defineStore('gameProgress', () => {
  const levels = ref<Record<GameKey, LevelButtonState>>(loadOrDefault(STORAGE_KEYS.levels, DEFAULT_LEVELS))
  const bgmMuted = ref<boolean>(loadOrDefault(STORAGE_KEYS.bgmMuted, false))
  const bgmVolume = ref<number>(loadOrDefault(STORAGE_KEYS.bgmVolume, 0.1))

  function save() {
    try {
      localStorage.setItem(STORAGE_KEYS.levels, JSON.stringify(levels.value))
      localStorage.setItem(STORAGE_KEYS.bgmMuted, JSON.stringify(bgmMuted.value))
      localStorage.setItem(STORAGE_KEYS.bgmVolume, JSON.stringify(bgmVolume.value))
    } catch (e) {
      console.warn('Failed to persist game progress', e)
    }
  }

  function setLevelState(game: GameKey, state: LevelButtonState) {
    levels.value[game] = state
    save()
  }

  function markCleared(game: GameKey) {
    setLevelState(game, 'cleared')
    const idx = ORDER.indexOf(game)
    const next = ORDER[idx + 1]
    if (next && levels.value[next] === 'locked') {
      setLevelState(next, 'unlocked')
    }
  }

  function resetProgress() {
    levels.value = { ...DEFAULT_LEVELS }
    save()
  }

  function toggleBgmMuted() {
    bgmMuted.value = !bgmMuted.value
    save()
  }

  function setBgmVolume(v: number) {
    bgmVolume.value = v
    save()
  }

  // Reset progress when guest session changes
  try {
    const session = useSessionStore()
    watch(
      () => session.guest?.guestId,
      (id, prev) => {
        // ignore initial undefined, only reset when previous value existed and differs
        if (prev !== undefined && id !== prev) {
          resetProgress()
        }
        // also reset if session cleared
        if (prev !== undefined && id == null) {
          resetProgress()
        }
      },
    )
  } catch (e) {
    // If session store isn't available at import time, ignore silently
  }

  return {
    levels,
    bgmMuted,
    bgmVolume,
    markCleared,
    setLevelState,
    resetProgress,
    toggleBgmMuted,
    setBgmVolume,
  }
})
