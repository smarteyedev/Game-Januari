/**
 * Storage Service - LocalStorage abstraction
 * Part of the infrastructure layer
 */

import type { IStorageService } from '@/domain/interfaces'

const STORAGE_PREFIX = 'gbl_game_'

export class LocalStorageService implements IStorageService {
  private prefix: string

  constructor(prefix: string = STORAGE_PREFIX) {
    this.prefix = prefix
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`
  }

  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.getKey(key))
      if (item === null) return null
      return JSON.parse(item) as T
    } catch (error) {
      console.error(`Error reading from storage: ${key}`, error)
      return null
    }
  }

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(this.getKey(key), JSON.stringify(value))
    } catch (error) {
      console.error(`Error writing to storage: ${key}`, error)
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(this.getKey(key))
    } catch (error) {
      console.error(`Error removing from storage: ${key}`, error)
    }
  }

  clear(): void {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error('Error clearing storage', error)
    }
  }
}

// Singleton instance
export const storage = new LocalStorageService()

export default LocalStorageService

