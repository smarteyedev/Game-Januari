<script setup lang="ts">
defineProps({
  icon: {
    type: String, // raw SVG string
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

import clickSound from '@/assets/sounds/btn_click.ogg'

const audio = new Audio(clickSound)

function playClick() {
  if (audio) {
    audio.currentTime = 0
    audio.volume = 1
    audio.play()
  }
}
</script>

<template>
  <button
  @click="playClick"
   class="inline-flex items-center justify-center cursor-pointer">
    <span class="flex justify-center items-center">
      <slot name="icon" />
    </span>
    <span class="text-white">
      <slot />
    </span>
  </button>
</template>
