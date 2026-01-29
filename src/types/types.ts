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

export interface IntroData {
  title: string
  description: string
  key_points: string[]
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

export type GameKey = 'automationSpotter' | 'dragAndDropPrompt' | 'memoryGame'

export interface GameIntroMapping {
  automationSpotter: IntroData
  dragAndDropPrompt: IntroData
  memoryGame: IntroData
}

export interface GuestSession {
  guestId: string
  accessToken: string
  expiresAt: string
}
