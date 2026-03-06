/**
 * Game Data Types - TypeScript interfaces for game JSON data
 * These types define the structure of game data loaded from local assets or API
 */

import type { MinigameId } from './index'

// ============================================================================
// Base Types
// ============================================================================

/**
 * Base interface for all level data
 */
export interface BaseLevelData {
  id?: number
  version?: string
}

/**
 * Content structure for game data
 */
export interface GameContent {
  question?: string
  cards?: DragCardData[]
  items?: WordItemData[]
  pairs?: MemoryPairData[]
  connections?: ConnectionGroupData[]
  words?: string[]
  matrix?: MatrixRowData[]
  [key: string]: unknown
}

// ============================================================================
// Automation Spotter Types
// ============================================================================

export interface DragCardData {
  id: number
  label: string
  answer: boolean
  matched?: boolean
}

export interface AutomationSpotterLevelData extends BaseLevelData {
  intro?: string
  content?: GameContent
  config?: GameConfigData
}

// ============================================================================
// Drag and Drop Types
// ============================================================================

export interface WordItemData {
  id: number
  word: string
  correctSlot?: number
}

export interface BlankSlotData {
  id: number
  correctWord: string
}

export interface DragAndDropLevelData extends BaseLevelData {
  intro?: string
  content?: {
    sentence?: string
    blanks?: BlankSlotData[]
    items?: WordItemData[]
  }
  config?: GameConfigData
}

// ============================================================================
// Memory Game Types
// ============================================================================

export interface MemoryPairData {
  pairId: number
  items: MemoryCardData[]
}

export interface MemoryCardData {
  id: number
  pairId: number
  contentType: 'text' | 'svg' | 'img'
  value: string
}

export interface MemoryLevelData extends BaseLevelData {
  intro?: string
  content?: {
    pairs?: MemoryPairData[]
    gridSize?: number
  }
  config?: GameConfigData
}

// ============================================================================
// Connections Game Types
// ============================================================================

export interface ConnectionItemData {
  id: number
  label: string
  group: number
}

export interface ConnectionGroupData {
  id: number
  name: string
  items: string[]
}

export interface ConnectionsLevelData extends BaseLevelData {
  intro?: string
  content?: {
    groups?: ConnectionGroupData[]
    gridSize?: number
  }
  config?: GameConfigData
}

// ============================================================================
// Scrambles Game Types
// ============================================================================

export interface ScrambleWordData {
  id: number
  word: string
  scrambled?: string
}

export interface ScramblesLevelData extends BaseLevelData {
  intro?: string
  content?: {
    words?: ScrambleWordData[]
    sentence?: string
  }
  config?: GameConfigData
}

// ============================================================================
// Matrix Game Types
// ============================================================================

export interface MatrixRowData {
  row: number
  cells: (string | number | boolean | null)[]
}

export interface MatrixQuestionData {
  id: number
  question: string
  correctAnswer: string | number | boolean
}

export interface MatrixLevelData extends BaseLevelData {
  intro?: string
  content?: {
    matrix?: MatrixRowData[]
    questions?: MatrixQuestionData[]
    rowHeaders?: string[]
    colHeaders?: string[]
  }
  config?: GameConfigData
}

// ============================================================================
// Game Configuration
// ============================================================================

export interface GameConfigData {
  maxTime?: number
  timeTolerance?: number
  answerWeight?: number
  timeWeight?: number
  shuffleCards?: boolean
  showFeedback?: boolean
  [key: string]: unknown
}

// ============================================================================
// Level Data Response Types
// ============================================================================

/**
 * Response format for level data (old format with data array)
 */
export interface LevelDataArrayResponse {
  data: BaseLevelData[]
}

/**
 * Response format for level data (root array format)
 */
export interface LevelDataRootArrayResponse extends Array<BaseLevelData> {}

/**
 * Response format for level data (keyed by id)
 */
export interface LevelDataKeyedResponse {
  [levelId: string]: BaseLevelData
}

/**
 * Union type for all possible level data response formats
 */
export type LevelDataResponse =
  | LevelDataArrayResponse
  | LevelDataRootArrayResponse
  | LevelDataKeyedResponse
  | BaseLevelData

// ============================================================================
// Minigame Level Data Map
// ============================================================================

export type MinigameLevelDataMap = {
  [MinigameId.AutomationSpotter]: AutomationSpotterLevelData
  [MinigameId.DragAndDrop]: DragAndDropLevelData
  [MinigameId.Memory]: MemoryLevelData
  [MinigameId.Connections]: ConnectionsLevelData
  [MinigameId.Scrambles]: ScramblesLevelData
  [MinigameId.Matrix]: MatrixLevelData
}

export type MinigameLevelData = MinigameLevelDataMap[keyof MinigameLevelDataMap]

