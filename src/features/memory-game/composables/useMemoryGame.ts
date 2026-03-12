import { ref, computed } from 'vue'
import type { MemoryCard, MemoryLevelData } from '@/domain/types'
import { levelRepository } from '@/infrastructure'
import { MinigameId } from '@/domain/types'
import { shuffle } from '@/utils/shuffle'

export function useMemoryGame() {
  const cards = ref<MemoryCard[]>([])
  const turns = ref(0)
  const loading = ref(false)
  const error = ref<unknown>(null)

  // Game state
  const isLocked = ref(false)
  const firstCard = ref<MemoryCard | null>(null)

  const isAllMatched = computed(() => {
    return cards.value.length > 0 && cards.value.every((c) => c.matched)
  })

  // Load level data
  async function fetchLevel(levelId: number = 1, offline: boolean = true) {
    loading.value = true
    error.value = null
    try {
      // Use 'any' cast temporarily if strict typing fails due to the recent type changes
      // but ideally we trust the repository to return the right shape now.
      const data = await levelRepository.getLevel<MemoryLevelData>(
        MinigameId.Memory,
        levelId,
        offline,
      )

      const rawCards = data.content?.card || []

      // Initialize cards
      cards.value = shuffle(
        rawCards.map(
          (c) =>
            ({
              ...c,
              // Ensure these properties exist for the UI
              flipped: false,
              matched: false,
            }) as MemoryCard,
        ),
      )

      return data
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  // Core Mechanic: Flip Card
  function flipCard(card: MemoryCard) {
    if (isLocked.value || card.flipped || card.matched) return

    card.flipped = true
    turns.value++

    if (!firstCard.value) {
      firstCard.value = card
      return
    }

    checkForMatch(firstCard.value, card)
  }

  function checkForMatch(card1: MemoryCard, card2: MemoryCard) {
    if (card1.pairId === card2.pairId) {
      // Match found
      card1.matched = true
      card2.matched = true
      firstCard.value = null
    } else {
      // No match
      isLocked.value = true
      setTimeout(() => {
        card1.flipped = false
        card2.flipped = false
        firstCard.value = null
        isLocked.value = false
      }, 800)
    }
  }

  function reset() {
    turns.value = 0
    firstCard.value = null
    isLocked.value = false
    cards.value.forEach((c) => {
      c.flipped = false
      c.matched = false
    })
    cards.value = shuffle(cards.value)
  }

  return {
    cards,
    turns,
    loading,
    error,
    isAllMatched,
    fetchLevel,
    flipCard,
    reset,
  }
}
