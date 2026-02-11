export type ContentType = 'text' | 'svg' | 'img'

export interface FillBlank {
  sentence: string
  blanks: Blank[]
}

export interface Blank {
  id: number
  word: string
}

export interface DragCard {
  id: number
  label: string
  answer: boolean
  matched?: boolean
}

export interface Keypoint {
    icon_name?: string,
    description: string
}

export interface IntroData {
  title: string
  description: string
  key_points: Keypoint[]
}

// zone id is boolean because there is only two zone, its save memory.
export interface Zone {
  id: boolean // true for "Bisa", false for "Tidak Bisa"
  label: string
  cards: DragCard[]
}

export interface MemoryCard {
  id: number
  pairId: number
  contentType: ContentType
  value: string
  // runtime property
  flipped?: boolean
  matched?: boolean
}

export type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
  meta?: {
    ts: string
  }
}

export type LevelButtonState = 'unlocked' | 'cleared' | 'locked'

export interface GameIntroMapping {
  automationSpotter: IntroData
  dragAndDropPrompt: IntroData
  memoryGame: IntroData
}

export type GameState = 'idle' | 'launching' | 'playing' | 'submitting' | 'finished' | 'error'

export interface GameSession {
  gameId: string
  sessionId?: string
  minigameId?: string
  state: GameState
}

export interface GuestSession {
  guestId: string
  accessToken: string
  expiresAt: string
  gameId: string
  sessionId?: string
}
