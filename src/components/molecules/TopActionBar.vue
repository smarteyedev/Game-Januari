<template>
  <div class="flex flex-col justify-between gap-3.5">
    <div v-if="text"
      class="justify-center items-center flex w-full text-body-xs md:text-body-md xl:text-body-xl rounded-3xl font-black text-primary-700 border-[3px] border-primary-700 bg-white px-9 py-2 shadow-xl shadow-primary-700">
      <span class="text-center">
        {{ text }}
      </span>
    </div>
    <div class="flex w-full gap-2.5">
      <UiButton :size="!isXs && !isSm ? 'md' : 'xs'" :icon-size="!isXs && !isSm ? 32 : 24" :square="true"
        icon="ri:home-5-fill" @click="goToHome" />
      <UiButton :size="!isXs && !isSm ? 'md' : 'xs'" variant="primary" text="View Summary" class="grow w-full"
        @click="$emit('toggle-summary')" :disabled="!isChecked || !isWin" />
      <UiButton :size="!isXs && !isSm ? 'md' : 'xs'" :icon-size="!isXs && !isSm ? 32 : 24" :square="true"
        icon="ic:outline-fullscreen" @click="$emit('toggle-fullscreen')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBreakpoint } from '@/composables/useBreakpoint'
import { UiButton } from '@/components/atoms/button'
import { useRouter } from 'vue-router'

const { isXs, isSm } = useBreakpoint()

defineProps<{
  text?: string
  current?: number
  target?: number
  isChecked?: boolean
  isWin?: boolean
  isShown?: boolean
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
