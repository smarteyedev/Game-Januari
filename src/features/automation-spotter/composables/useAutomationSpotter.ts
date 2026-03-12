import { ref, computed } from 'vue'
import type { DragCard, Zone, AutomationSpotterLevelData } from '@/domain/types'
import { levelRepository } from '@/infrastructure'
import { MinigameId } from '@/domain/types'
import { shuffle } from '@/utils/shuffle'

export function useAutomationSpotter() {
  const allCards = ref<DragCard[]>([])
  const sourceCards = ref<DragCard[]>([])
  const zones = ref<Zone[]>([
    { id: true, label: 'Bisa', cards: [] },
    { id: false, label: 'Tidak Bisa', cards: [] },
  ])
  const checkedMap = ref<Record<number, boolean>>({})
  const isChecked = ref(false)
  const question = ref('')
  const loading = ref(false)
  const error = ref<unknown>(null)

  const matchedCount = computed(() => {
    return Object.values(checkedMap.value).filter(Boolean).length
  })

  async function fetchLevel(levelId: number = 1, offline: boolean = true) {
    loading.value = true
    error.value = null
    try {
      const data = await levelRepository.getLevel<AutomationSpotterLevelData>(
        MinigameId.AutomationSpotter,
        levelId,
        offline
      )
      
      const content = data.content
      question.value = content?.question ?? ''
      const rawCards = content?.card ?? []
      
      allCards.value = shuffle(rawCards.map((c) => ({ ...c, matched: false })))
      resetBoard()
      
      return data
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  function resetBoard() {
    sourceCards.value = [...allCards.value]
    zones.value.forEach((zone) => (zone.cards = []))
    checkedMap.value = {}
    isChecked.value = false
  }

  function onMoved(ids: number[]) {
    if (!isChecked.value) return
    ids.forEach((id) => {
      if (checkedMap.value[id] !== undefined) {
        delete checkedMap.value[id]
      }
    })
  }

  function moveCard(payload: { from: string; to: string; index: number }) {
    if (isChecked.value) return
    if (payload.from === payload.to) return

    let item: DragCard | undefined

    // Find and remove item from source
    if (payload.from === 'pool') {
      item = sourceCards.value.splice(payload.index, 1)[0]
    } else {
      const sourceZone = zones.value.find((z) => String(z.id) === payload.from)
      if (sourceZone) {
        item = sourceZone.cards.splice(payload.index, 1)[0]
      }
    }

    if (!item) return

    // Add item to destination
    if (payload.to === 'pool') {
      sourceCards.value.push(item)
    } else {
      const targetZone = zones.value.find((z) => String(z.id) === payload.to)
      if (targetZone) {
        targetZone.cards.push(item)
      }
    }
  }

  function checkAnswers() {
    const result: Record<number, boolean> = {}
    
    zones.value.forEach((zone) => {
      zone.cards.forEach((card) => {
        result[card.id] = card.answer === zone.id
      })
    })

    checkedMap.value = result
    isChecked.value = true

    const isPerfect = 
      Object.values(result).every(Boolean) && 
      Object.keys(result).length === allCards.value.length

    return {
      isPerfect,
      correctCount: Object.values(result).filter(Boolean).length,
      totalCount: allCards.value.length
    }
  }

  return {
    allCards,
    sourceCards,
    zones,
    checkedMap,
    isChecked,
    question,
    loading,
    error,
    matchedCount,
    fetchLevel,
    onMoved,
    moveCard,
    checkAnswers,
    resetBoard
  }
}
