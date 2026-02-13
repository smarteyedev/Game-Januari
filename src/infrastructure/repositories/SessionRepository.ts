/**
 * Session Repository Implementation
 * Part of the infrastructure layer
 */

import type { ISessionRepository } from '@/domain/interfaces'
import type { GuestSession } from '@/domain/types'
import { httpClient } from '../api/ApiClient'
import { storage } from '../storage/LocalStorageService'

const STORAGE_KEY = 'guest_session'

export class SessionRepository implements ISessionRepository {
  private currentSession: GuestSession | null = null

  async createGuestSession(): Promise<GuestSession> {
    const response = await httpClient.post<
      GuestSession & { expiresAt: string }
    >('/api/v1/guest/session')

    const session: GuestSession = {
      guestId: response.data.guestId,
      accessToken: response.data.accessToken,
      expiresAt: response.data.expiresAt,
      gameId: crypto.randomUUID(),
    }

    this.saveSession(session)
    this.currentSession = session

    return session
  }

  loadSession(): GuestSession | null {
    const stored = storage.get<GuestSession>(STORAGE_KEY)
    if (stored) {
      this.currentSession = stored
      return stored
    }
    return null
  }

  saveSession(session: GuestSession): void {
    storage.set(STORAGE_KEY, session)
    this.currentSession = session
  }

  clearSession(): void {
    storage.remove(STORAGE_KEY)
    this.currentSession = null
  }

  getCurrentSession(): GuestSession | null {
    return this.currentSession
  }

  isSessionValid(): boolean {
    if (!this.currentSession) return false
    
    const expiresAt = new Date(this.currentSession.expiresAt)
    return new Date() < expiresAt
  }
}

// Singleton instance
export const sessionRepository = new SessionRepository()

export default SessionRepository

