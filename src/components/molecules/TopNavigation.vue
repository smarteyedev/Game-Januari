<template>
  <div class="flex flex-col justify-between gap-3.5">
    <div v-if="text && !isIntro">
      <Title :text="text" />
    </div>
    <div
class="flex w-full gap-2.5"
:class="{ 'justify-end': isIntro }">
      <UiButton
v-if="!isIntro"
:size="!isXs && !isSm ? 'md' : 'xs'"
:icon-size="!isXs && !isSm ? 32 : 24"
        :square="true"
icon="ri:home-5-fill"
@click="goToHome" />
      <UiButton
v-if="!isIntro"
:size="!isXs && !isSm ? 'md' : 'xs'"
variant="primary"
text="View Summary"
        class="grow w-full"
@click="$emit('toggle-summary')"
:disabled="!isChecked || !isWin" />
      <UiButton
:size="!isXs && !isSm ? 'md' : 'xs'"
:icon-size="!isXs && !isSm ? 32 : 24"
:square="true"
        icon="ic:outline-fullscreen"
@click="$emit('toggle-fullscreen')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameViewContext } from '@/composables/useGameViewContext'
import { UiButton } from '@/components/atoms/button'
import { useRouter } from 'vue-router'
import Title from '@/components/atoms/Title.vue'

const { isXs, isSm } = useGameViewContext()

defineProps<{
  text?: string
  current?: number
  target?: number
  isChecked?: boolean
  isWin?: boolean
  isShown?: boolean
  isIntro?: boolean
}>()

defineEmits<{
  (e: 'toggle-fullscreen'): void
  (e: 'toggle-summary'): void
}>()

const router = useRouter()

function goToHome() {
  router.push('/')
}
</script>
