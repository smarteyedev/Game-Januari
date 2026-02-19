<template>
  <BaseGame title="Connections Game" description="Connections game" :time="time" v-model:showIntro="showIntro"
    :introData="introData.data[3]">
    <div class="grid grid-cols-4 gap-2 border-b border-t p-2 min-w-100 min-h-12.5">
      <ConnectionsCard v-for="index in 4" :key="index" :label="solvedGroups[index - 1]?.label || ''"
        :state="solvedGroups[index - 1] ? 'solved' : 'idle'" :color="solvedGroups[index - 1]
          ? categoryColorMap[solvedGroups[index - 1].id]
          : 'bg-gray-200'" :clickable="false" />
    </div>

    <div class="p-2">
      <span class="text-h6 font-bold text-primary-700">Create a group of four</span>
    </div>
    <div class="grid grid-cols-8 gap-2">
      <ConnectionsCard v-for="item in items" :key="item.label" :label="item.label" :state="item.state"
        :color="categoryColorMap[item.category]" :clickable="item.state !== 'solved'" @click="toggleItem(item)" />
    </div>
    <!--Event message for user feedback-->
    <div class="p-2">
      <UiLabel v-if="wrongCount !== null && !(win || lose)"
        :label="`Wrong, you are ${wrongCount} away to form a correct group`" />
      <UiLabel v-if="solvedNewGroup !== null && !(win || lose)"
        :label="`You found a new group: ${solvedNewGroup.label}`" />
      <UiLabel v-if="win" :label="`You win`" />
      <UiLabel v-if="lose" :label="`you lose`" />
    </div>
    <!-- Control Buttons -->

    <template #footer>
      <div class="flex flex-col items-center">
        <div class="flex p-2 gap-2">
          <ButtonText text="Submit" variant="primary" :disabled="selected.length !== 4 || win || lose"
            @click="submitSelection">
          </ButtonText>

          <!--Hidden, if lose show restart, if win show continue-->
          <UiButton class="p-4 flex items-center rounded-sm" v-if="lose" @click="restartGame" :color="'error'">
            <span>Restart</span>
          </UiButton>
          <UiButton class="p-4 flex items-center rounded-sm" v-if="win" :color="'success'">
            <span>Continue</span>
          </UiButton>
        </div>
        <div class="p-2">
          <UiLabel :label="`You have ${attemptsLeft} attempts left`" />
        </div>
      </div>
    </template>
  </BaseGame>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { UiLabel } from '@/components/atoms/label'
import ConnectionsCard from '@/components/molecules/ConnectionsCard.vue'
import { UiButton } from '@/components/atoms/button'
import gameData from '@/assets/gameData/connection_game.json'
import BaseGame from '@/components/templates/BaseGame.vue'
import { MINIGAME_IDS } from '@/utils/constants'
import { useGameService } from '@/application'
import introData from '@/assets/gameData/intro.json'
import ButtonText from '@/components/atoms/ButtonText.vue'

type Category = {
  id: string
  label: string
}

type ItemState = 'idle' | 'selected' | 'solved'

type Item = {
  label: string
  category: string
  state: ItemState
}

type SolvedGroup = {
  id: string
  label: string
  color: string
}

const COLOR_POOL = [
  'bg-red-500',
  'bg-orange-500',
  'bg-amber-500',
  'bg-yellow-500',
  'bg-lime-500',
  'bg-green-500',
  'bg-emerald-500',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-sky-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-violet-500',
  'bg-purple-500',
  'bg-fuchsia-500',
  'bg-pink-500',
  'bg-rose-500',
]

const { time, isWon, startGame, finish, reset } = useGameService({
  maxTime: 180,
  minigameId: MINIGAME_IDS.connections,
})

const loading = ref(false)
const error = ref<unknown>(null)
const showIntro = ref(true)

const categoryColorMap = ref<Record<string, string>>({})
const categories = ref<Category[]>([])
const items = ref<Item[]>([])
const selected = ref<Item[]>([])
const categoryLabelMap = ref<Record<string, string>>({})
const solvedGroups = ref<SolvedGroup[]>([])
const maxAttempts = 4
const attemptsLeft = ref(maxAttempts)

const wrongCount = ref<number | null>(null)
const solvedNewGroup = ref<{ id: string; label: string } | null>(null)

const win = ref(false)
const lose = ref(false)

function shuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[result[i]!, result[j]!] = [result[j]!, result[i]!]
  }
  return result
}

function countAway(items: Item[]) {
  const freq: Record<string, number> = {}

  items.forEach((item) => {
    freq[item.category] = (freq[item.category] || 0) + 1
  })

  const maxSame = Math.max(...Object.values(freq))
  return 4 - maxSame
}

function colorFromCategory(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash)
  }
  return COLOR_POOL[Math.abs(hash) % COLOR_POOL.length]!
}

function assignCategoryColors(categories: { id: string }[]) {
  categories.forEach((cat, _) => {
    categoryColorMap.value[cat.id] = colorFromCategory(cat.id)
  })
}

onMounted(async () => {
  const data = gameData

  categories.value = data.category

  assignCategoryColors(data.category)

  categoryLabelMap.value = Object.fromEntries(data.category.map((c: any) => [c.id, c.label]))

  items.value = shuffle(
    data.items.map((item: any) => ({
      label: item.label,
      category: item.category,
      state: 'idle',
    })),
  )
})

function toggleItem(item: Item) {
  if (item.state === 'solved') return
  if (win.value || lose.value) return

  if (item.state === 'selected') {
    item.state = 'idle'
    selected.value = selected.value.filter((i) => i !== item)
    return
  }

  if (selected.value.length < 4) {
    item.state = 'selected'
    selected.value.push(item)
  }
}

function submitSelection() {
  if (selected.value.length !== 4) return
  if (win.value || lose.value) return

  solvedNewGroup.value = null
  wrongCount.value = null

  const categoryId = selected.value[0]!.category
  const isMatch = selected.value.every((item) => item.category === categoryId)

  if (!isMatch) {
    attemptsLeft.value--

    wrongCount.value = countAway(selected.value)

    selected.value.forEach((i) => (i.state = 'idle'))
    selected.value = []

    if (attemptsLeft.value <= 0) {
      lose.value = true
      revealAllGroups()
    }

    return
  }

  // correct group
  selected.value.forEach((item) => {
    item.state = 'solved'
  })

  solvedGroups.value.push({
    id: categoryId,
    label: categoryLabelMap.value[categoryId]!,
    color: categoryColorMap.value[categoryId]!,
  })

  solvedNewGroup.value = {
    id: categoryId,
    label: categoryLabelMap.value[categoryId]!,
  }

  selected.value = []

  // win condition
  if (solvedGroups.value.length === categories.value.length) {
    win.value = true
  }
}

function revealAllGroups() {
  const solvedCategoryIds = new Set(solvedGroups.value.map((g) => g.id))

  // mark all items as solved
  items.value.forEach((item) => {
    item.state = 'solved'
  })

  // add missing groups to solvedGroups
  categories.value.forEach((cat) => {
    if (!solvedCategoryIds.has(cat.id)) {
      solvedGroups.value.push({
        id: cat.id,
        label: categoryLabelMap.value[cat.id]!,
        color: categoryColorMap.value[cat.id]!,
      })
    }
  })
}

function restartGame() {
  attemptsLeft.value = maxAttempts
  win.value = false
  lose.value = false
  wrongCount.value = null
  solvedNewGroup.value = null
  solvedGroups.value = []
  selected.value = []

  items.value.forEach((item) => (item.state = 'idle'))
  items.value = shuffle(items.value)
}
</script>
