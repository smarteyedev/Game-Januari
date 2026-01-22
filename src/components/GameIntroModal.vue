<script setup lang="ts">
import IconButton from '@/components/IconButton.vue'
import UnknownIcon from './icons/UnknownIcon.vue';

defineProps<{
  title: string
}>()

const emit = defineEmits<{
  (e: 'start'): void
  (e: 'close'): void
}>()
</script>

<template>
  <div class="fixed inset-0 z-50 bg-black/50">
    <div class="flex justify-center p-4">
      <div class="flex flex-col  max-h-[600px] gap-[48px] w-full bg-white rounded-xl p-[40px] justify-center items-center">
        <div>
            <UnknownIcon></UnknownIcon>
        </div>

        <slot />

        <div class="flex">
          <IconButton
            class="px-6 py-2 bg-[#00A3B5] text-white rounded-lg"
            @click="$emit('start')"
          >
            Start Game
          </IconButton>
        </div>
      </div>
    </div>
  </div>
</template>
