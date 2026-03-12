import { ref } from 'vue'
import type { ConnectionsLevelData, TargetCategoryData, ConnectionItemData } from '@/domain/types'
import { levelRepository } from '@/infrastructure'
import { MinigameId } from '@/domain/types'
import { shuffle } from '@/utils/shuffle'

type ItemState = 'idle' | 'selected' | 'solved'

interface Item extends ConnectionItemData {
  state: ItemState
}

interface SolvedGroup {
  id: string
  label: string
  color: string
}

const COLOR_POOL = [
  'bg-red-200',
  'bg-orange-200',
  'bg-amber-200',
  'bg-yellow-200',
  'bg-lime-200',
  'bg-green-200',
  'bg-emerald-200',
  'bg-teal-200',
  'bg-cyan-200',
  'bg-sky-200',
  'bg-blue-200',
  'bg-indigo-200',
  'bg-violet-200',
  'bg-purple-200',
  'bg-fuchsia-200',
  'bg-pink-200',
  'bg-rose-200',
]

export function useConnectionsGame() {
  const categories = ref<TargetCategoryData[]>([])
  const items = ref<Item[]>([])
  const selected = ref<Item[]>([])
  const solvedGroups = ref<SolvedGroup[]>([])
  const isChecked = ref(false)
  
  const attemptsLeft = ref(4)
  const maxAttempts = ref(4)
  const wrongCount = ref<number | null>(null)
  const solvedNewGroup = ref<{ id: string; label: string } | null>(null)
  
  const categoryColorMap = ref<Record<string, string>>({})
  const categoryLabelMap = ref<Record<string, string>>({})
  
  const loading = ref(false)
  const error = ref<unknown>(null)

  function colorFromCategory(id: string) {
    let hash = 0
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash)
    }
    return COLOR_POOL[Math.abs(hash) % COLOR_POOL.length]!
  }

  async function fetchLevel(levelId: number = 1, offline: boolean = true) {
    loading.value = true
    error.value = null
    try {
      const data = await levelRepository.getLevel<ConnectionsLevelData>(
        MinigameId.Connections,
        levelId,
        offline
      )
      
      const content = data.content
      const config = data.config
      
      maxAttempts.value = config?.max_attempt || 4
      attemptsLeft.value = maxAttempts.value
      
      categories.value = content?.target_category || []
      
      // Assign colors and labels
      categoryColorMap.value = {}
      categoryLabelMap.value = {}
      categories.value.forEach(cat => {
        categoryColorMap.value[cat.category] = colorFromCategory(cat.category)
        categoryLabelMap.value[cat.category] = cat.label
      })

      const rawItems = content?.items || []
      items.value = shuffle(rawItems.map(item => ({
        ...item,
        state: 'idle'
      } as Item)))
      
      resetLocalState()
      
      return data
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  function resetLocalState() {
    attemptsLeft.value = maxAttempts.value
    wrongCount.value = null
    solvedNewGroup.value = null
    solvedGroups.value = []
    selected.value = []
    isChecked.value = false
    items.value.forEach(i => i.state = 'idle')
    items.value = shuffle(items.value)
  }

  function toggleItem(item: Item) {
    if (item.state === 'solved') return
    
    if (item.state === 'selected') {
      item.state = 'idle'
      selected.value = selected.value.filter(i => i !== item)
      return
    }

    if (selected.value.length < 4) {
      item.state = 'selected'
      selected.value.push(item)
    }
  }

  function countAway(selectedItems: Item[]) {
    const freq: Record<string, number> = {}
    selectedItems.forEach(item => {
      freq[item.category] = (freq[item.category] || 0) + 1
    })
    const maxSame = Math.max(...Object.values(freq))
    return 4 - maxSame
  }

  function submitSelection() {
    if (selected.value.length !== 4) return null

    solvedNewGroup.value = null
    wrongCount.value = null

    const categoryId = selected.value[0]!.category
    const isMatch = selected.value.every(item => item.category === categoryId)

    if (!isMatch) {
      attemptsLeft.value--
      wrongCount.value = countAway(selected.value)
      selected.value.forEach(i => i.state = 'idle')
      selected.value = []
      
      if (attemptsLeft.value <= 0) {
        revealAllGroups()
        return { success: false, gameOver: true }
      }
      return { success: false, gameOver: false }
    }

    // Success
    selected.value.forEach(item => { item.state = 'solved' })
    solvedGroups.value.push({
      id: categoryId,
      label: categoryLabelMap.value[categoryId]!,
      color: categoryColorMap.value[categoryId]!
    })
    solvedNewGroup.value = {
      id: categoryId,
      label: categoryLabelMap.value[categoryId]!
    }
    selected.value = []

    const win = solvedGroups.value.length === categories.value.length
    if(win){
      isChecked.value = true
    }
    return { success: true, win, gameOver: win }
  }

  function revealAllGroups() {
    const solvedIds = new Set(solvedGroups.value.map(g => g.id))
    items.value.forEach(i => i.state = 'solved')
    categories.value.forEach(cat => {
      if (!solvedIds.has(cat.category)) {
        solvedGroups.value.push({
          id: cat.category,
          label: cat.label,
          color: categoryColorMap.value[cat.category]!
        })
      }
    })
  }

  return {
    categories,
    items,
    selected,
    solvedGroups,
    attemptsLeft,
    maxAttempts,
    wrongCount,
    solvedNewGroup,
    categoryColorMap,
    loading,
    error,
    isChecked,
    fetchLevel,
    toggleItem,
    submitSelection,
    reset: resetLocalState
  }
}
