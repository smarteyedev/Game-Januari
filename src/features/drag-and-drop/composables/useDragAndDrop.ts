import { ref, computed } from 'vue'
import type { Blank, DragAndDropLevelData } from '@/domain/types'
import { levelRepository } from '@/infrastructure'
import { MinigameId } from '@/domain/types'
import { shuffle } from '@/utils/shuffle'

export type BoardPart = 
  | { type: 'text'; value: string }
  | { type: 'slot'; id: number; item: Blank | null }

export function useDragAndDrop() {
  const board = ref<BoardPart[]>([])
  const items = ref<Blank[]>([])
  const slots = ref<Record<number, Blank | null>>({})
  const slotCorrectness = ref<Record<number, boolean | null>>({})
  const isChecked = ref(false)
  const isLocked = ref(false)
  const loading = ref(false)
  const error = ref<unknown>(null)
  
  const sentence = ref('')
  const rawBlanks = ref<Blank[]>([])
  const correctCount = ref(0)

  const totalSlots = computed(() => {
    return board.value.filter((part): part is Extract<BoardPart, { type: 'slot' }> => 
      part.type === 'slot'
    ).length
  })

  const filledCount = computed(() => {
    return Object.values(slots.value).filter((item): item is Blank => item !== null).length
  })

  async function fetchLevel(levelId: number = 1, offline: boolean = true) {
    loading.value = true
    error.value = null
    try {
      const data = await levelRepository.getLevel<DragAndDropLevelData>(
        MinigameId.DragAndDrop,
        levelId,
        offline
      )
      
      const content = data.content
      sentence.value = content?.sentence ?? ''
      rawBlanks.value = (content?.blanks as unknown as Blank[]) ?? []
      
      loadBoard()
      
      return data
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  function parseSentence(s: string): BoardPart[] {
    const regex = /\{\{(\d+)\}\}/g
    const result: BoardPart[] = []
    let lastIndex = 0
    let match

    while ((match = regex.exec(s)) !== null) {
      if (match.index > lastIndex) {
        result.push({ type: 'text', value: s.slice(lastIndex, match.index) })
      }
      result.push({ type: 'slot', id: Number(match[1]), item: null })
      lastIndex = regex.lastIndex
    }

    if (lastIndex < s.length) {
      result.push({ type: 'text', value: s.slice(lastIndex) })
    }

    return result
  }

  function loadBoard() {
    board.value = parseSentence(sentence.value)
    slots.value = {}
    slotCorrectness.value = {}
    items.value = shuffle([...rawBlanks.value])

    board.value.forEach((part) => {
      if (part.type === 'slot') {
        slots.value[part.id] = null
        slotCorrectness.value[part.id] = null
      }
    })

    isChecked.value = false
    isLocked.value = false
    correctCount.value = 0
  }

  function moveWord(payload: { from: string; to: string; index: number }) {
    if (isLocked.value) return

    let item: Blank | null = null

    // Get item from source
    if (payload.from === 'pool') {
      const spliced = items.value.splice(payload.index, 1)
      if (spliced.length > 0) {
        item = spliced[0] ?? null
      }
    } else if (payload.from.startsWith('board-')) {
      const slotId = Number(payload.from.replace('board-', ''))
      item = slots.value[slotId] || null
      slots.value[slotId] = null
    }

    if (!item) return

    // Put item in target
    if (payload.to === 'pool') {
      items.value.push(item)
    } else if (payload.to.startsWith('board-')) {
      const slotId = Number(payload.to.replace('board-', ''))
      const existing = slots.value[slotId]

      // If target has an item, swap it
      if (existing) {
        if (payload.from === 'pool') {
          items.value.push(existing)
        } else if (payload.from.startsWith('board-')) {
          const fromSlotId = Number(payload.from.replace('board-', ''))
          slots.value[fromSlotId] = existing
        }
      }

      slots.value[slotId] = item
    }
  }

  function checkAnswers() {
    isChecked.value = true
    
    let count = 0
    Object.entries(slots.value).forEach(([slotIdStr, item]) => {
      const slotId = Number(slotIdStr)
      const isCorrect = item && item.id === slotId
      slotCorrectness.value[slotId] = isCorrect
      if (isCorrect) count++
    })

    correctCount.value = count
    const won = count === totalSlots.value
    isLocked.value = true

    return {
      won,
      correctCount: count,
      totalSlots: totalSlots.value
    }
  }

  function reset() {
    loadBoard()
  }

  return {
    board,
    items,
    slots,
    slotCorrectness,
    isChecked,
    isLocked,
    loading,
    error,
    totalSlots,
    correctCount,
    filledCount,
    fetchLevel,
    moveWord,
    checkAnswers,
    reset
  }
}
