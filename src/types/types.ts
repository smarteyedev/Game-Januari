export type ContentType = "text" | "svg" | "img"

export interface FillBlank{
    sentence: string
    blanks: Blank[]
}

export interface Blank{
    id: number
    word: string
}

export interface DragCard {
  id: number
  label: string
  answer: boolean
  matched?: boolean
}

// zone id is boolean because there is only two zone, its save memory.
export interface Zone {
  id: boolean  // true for "Bisa", false for "Tidak Bisa"
  label: string
  cards: DragCard[]
}

export interface MemoryCard {
    id: number;
    pairId: number;
    contentType: ContentType;
    text: string;
    // runtime property
    flipped?: boolean;
    matched?: boolean;
}

export type LevelButtonState = 'unlocked' | 'cleared' | 'locked'
