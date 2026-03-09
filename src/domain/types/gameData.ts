/**
 * Game Data Types - TypeScript interfaces for game JSON data
 * These types define the structure of game data loaded from local assets or API
 */

import type { MinigameId } from './minigame'

// ============================================================================
// Shared Types
// ============================================================================

export interface Keypoint {
  id?: number
  icon_name?: string
  description: string
}

export interface IntroData {
  id?: number
  title: string
  description: string
  key_points: Keypoint[]
}

/**
 * Base interface for all level data
 */
export interface BaseLevelData {
  id?: number
  version?: string
  intro?: IntroData
  [key: string]: unknown
}

// Missing types for GameContent
export interface ConnectionGroupData {
  id: number
  category: string
  label: string
}

export interface MatrixRowData {
  id: number
  label: string
  answer: number
}

/**
 * Content structure for game data
 */
export interface GameContent {
  id?: number
  question?: string
  cards?: DragCardData[]
  items?: WordItemData[]
  pairs?: MemoryPairData[]
  connections?: ConnectionGroupData[]
  words?: string[]
  matrix?: MatrixRowData[]
  // Specific for some games
  card?: DragCardData[] | MemoryCardData[]
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
  content?: {
    id?: number
    question?: string
    card?: DragCardData[]
  }
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
  content?: {
    id?: number
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
  content?: {
    id?: number
    card?: MemoryCardData[]
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
  category: string
}

export interface TargetCategoryData {
  id: number
  category: string
  label: string
}

export interface ConnectionsLevelData extends BaseLevelData {
  content?: {
    id?: number
    target_category?: TargetCategoryData[]
    items?: ConnectionItemData[]
    gridSize?: number
  }
  config?: GameConfigData
}

// ============================================================================
// Scrambles Game Types
// ============================================================================

export interface ScramblesLevelData extends BaseLevelData {
  content?: {
    id?: number
    question?: string
    answer?: string
  }
  config?: GameConfigData
}

// ============================================================================
// Matrix Game Types
// ============================================================================

export interface MatrixOptionData {
  id: number
  label: string
}

export interface MatrixSubQuestionData {
  id: number
  label: string
  answer: number
}

export interface MatrixLevelData extends BaseLevelData {
  content?: {
    id?: number
    question?: string
    options?: MatrixOptionData[]
    subquestions?: MatrixSubQuestionData[]
    gridSize?: number
  }
  config?: GameConfigData
}

// ============================================================================
// Game Configuration
// ============================================================================

export interface GameConfigData {
  id?: number
  module_title?: string
  max_attempt?: number
  junk_letter?: number
  max_time?: number // Note: JSON uses snake_case sometimes
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
  | Array<BaseLevelData>
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
