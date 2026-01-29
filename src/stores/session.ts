import type { GuestSession } from '@/types/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSessionStore = defineStore('session', () => {
  const guest = ref<GuestSession | null>(null)

  function setGuestSession(session: GuestSession) {
    guest.value = session
    localStorage.setItem('guest_session', JSON.stringify(session))
  }

  function loadSession() {
    const stored = localStorage.getItem('guest_session')
    if (stored) guest.value = JSON.parse(stored)
  }

  function clearSession() {
    guest.value = null
    localStorage.removeItem('guest_session')
  }

  return { guest, setGuestSession, loadSession, clearSession }
})
