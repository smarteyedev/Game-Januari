<script setup lang="ts">
import GameIntroModal from './Modal/GameIntroModal.vue'
import GameResultModal from './Modal/GameResultModal.vue'
import GameResultSummaryModal from './Modal/GameResultSummaryModal.vue'
import type { IntroData, SuccessResultData } from '@/domain/types'
import type { TContainerPosition } from '@/components/molecules/modal/types'

interface Props {
  showIntro: boolean
  showResult: boolean
  showSummary: boolean
  title: string
  introData?: IntroData
  isWin: boolean
  successResult?: SuccessResultData | null
  containerPosition?: TContainerPosition
}

withDefaults(defineProps<Props>(), {
  containerPosition: 'relative',
  successResult: null,
})

const emit = defineEmits<{
  (e: 'update:showIntro', value: boolean): void
  (e: 'update:showResult', value: boolean): void
  (e: 'update:showSummary', value: boolean): void
  (e: 'start'): void
  (e: 'retry'): void
  (e: 'cleared'): void
  (e: 'toggle-summary'): void
}>()
</script>

<template>
  <GameIntroModal
    v-if="showIntro && introData"
    :modelValue="showIntro"
    @update:modelValue="emit('update:showIntro', $event)"
    :title="title"
    :introData="introData"
    @start="emit('start')"
    :containerPosition="containerPosition"
  />

  <GameResultModal
    v-else-if="showResult"
    :success="isWin"
    :successResult="successResult ?? undefined"
    :modelValue="showResult"
    @update:modelValue="emit('update:showResult', $event)"
    @retry="emit('retry')"
    @cleared="emit('cleared')"
    :containerPosition="containerPosition"
  />

  <GameResultSummaryModal
    v-else-if="showSummary"
    :resultSummary="successResult"
    :modelValue="showSummary"
    @update:modelValue="emit('update:showSummary', $event)"
    @toggle-summary="emit('toggle-summary')"
    :containerPosition="containerPosition"
  />
</template>
