/**
 * Storage Service - LocalStorage abstraction
 * Part of the infrastructure layer
 */

import type { IStorageService } from '@/domain/interfaces'
import { logger } from '../logging'

// ============================================================================
// Constants
// ============================================================================

const STORAGE_PREFIX = 'gbl_game_'

/**
 * LocalStorage Service - Provides type-safe localStorage operations
 */
export class LocalStorageService implements IStorageService {
  private prefix: string

  constructor(prefix: string = STORAGE_PREFIX) {
    this.prefix = prefix
  }

  /**
   * Get full storage key with prefix
   */
  private getKey(key: string): string {
    return `${this.prefix}${key}`
  }

  /**
   * Get value from storage
   */
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.getKey(key))
      if (item === null) return null
      return JSON.parse(item) as T
    } catch (error) {
      logger.error(
        `Error reading from storage: ${key}`,
        error instanceof Error ? error : new Error(String(error)),
      )
      return null
    }
  }

  /**
   * Set value in storage
   */
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(this.getKey(key), JSON.stringify(value))
    } catch (error) {
      logger.error(
        `Error writing to storage: ${key}`,
        error instanceof Error ? error : new Error(String(error)),
      )
    }
  }

  /**
   * Remove value from storage
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(this.getKey(key))
    } catch (error) {
      logger.error(
        `Error removing from storage: ${key}`,
        error instanceof Error ? error : new Error(String(error)),
      )
    }
  }

  /**
   * Clear all values with the configured prefix
   */
  clear(): void {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key)
        }
      })
      logger.info('Storage cleared', { prefix: this.prefix })
    } catch (error) {
      logger.error(
        'Error clearing storage',
        error instanceof Error ? error : new Error(String(error)),
      )
    }
  }
}

// Singleton instance
export const storage = new LocalStorageService()

export default LocalStorageService
