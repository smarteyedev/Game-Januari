<template>
  <div class="flex flex-col md:flex-row justify-between gap-3.5">
    <div v-if="text"
      class="justify-center items-center flex w-full md:w-fit text-body-xs md:text-body-xl rounded-3xl font-black text-primary-700 border-[3px] border-primary-700 bg-white px-9 py-2 shadow-xl shadow-primary-700">
      <span class="text-center">
        {{ text }}
      </span>
    </div>
    <div class="flex w-full md:w-fit gap-2.5">

      <UiButton v-if="isXs || isSm" :size="!isXs && !isSm ? 'md' : 'xs'" :icon-size="!isXs && !isSm ? 32 : 24"
        :square="true" icon="ri:home-5-fill" />
      <UiButton v-if="isChecked" :size="!isXs && !isSm ? 'md' : 'xs'" variant="primary" text="View Summary"
        class="grow w-full md:grow-0 md:w-fit" />
      <UiButton v-if="(isXs || isSm) && !isChecked" :size="!isXs && !isSm ? 'md' : 'xs'" variant="secondary"
        :text="`Progress: ${current?.toFixed(0) || 0}/${target?.toFixed(0) || 100}`" class="grow w-full" />
      <UiButton :size="!isXs && !isSm ? 'md' : 'xs'" :icon-size="!isXs && !isSm ? 32 : 24" :square="true"
        icon="ic:outline-fullscreen" @click="$emit('toggle-fullscreen')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBreakpoint } from '@/composables/useBreakpoint';
import { UiButton } from './button';

const { isXs, isSm } = useBreakpoint()

defineProps<{
  text?: string
  current?: number
  target?: number
  isChecked?: boolean
}>()

defineEmits<{
  (e: 'toggle-fullscreen'): void
}>()
</script>
