export type GamePhase = 'memorize' | 'answer' | 'result' | 'finish'
export type Order = 'Ascending' | 'Descending'
export type Validity = 'True' | 'False' | 'Indeterminate'
export type LeaderboardEntry = {
  name: string
  score: number
  date: number
}

export interface SortingItem {
  name: string
  value: number
}

export interface SortingGameLevel {
  criteria: string
  items: SortingItem[]
}

export interface LogicGameLevel {
  statement: string
  conclusion: string
  validity: Validity
}

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
  idTarget: string
  droppedZone?: string
}

export type MemoryCard = {
  id: number
  pairId: number
  type: 'text' | 'logo'
  text?: string
  logo?: string
  flipped: boolean
  matched: boolean
}

export type LevelButtonState = 'unlocked' | 'cleared' | 'locked'
