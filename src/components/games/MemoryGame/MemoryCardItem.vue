<script setup lang="ts">
import { computed } from 'vue'
import ChatGptOutline from '@/components/atoms/svg/ChatGptLogo.vue'
import ChatGptFilled from '@/components/atoms/svg/ChatGptLogoFilled.vue'
import CanvaOutline from '@/components/atoms/svg/CanvaLogo.vue'
import CanvaLogoFilled from '@/components/atoms/svg/CanvaLogoFilled.vue'
import GeminiOutline from '@/components/atoms/svg/GeminiLogo.vue'
import GeminiFilled from '@/components/atoms/svg/GeminiLogoFilled.vue'
import MetaOutline from '@/components/atoms/svg/MetaLogo.vue'
import MetaFilled from '@/components/atoms/svg/MetaLogoFilled.vue'
import GithubOutline from '@/components/atoms/svg/GithubLogo.vue'
import GithubFilled from '@/components/atoms/svg/GithubLogoFilled.vue'
import type { CSSProperties } from 'vue'

const props = defineProps<{
  contentType: 'text' | 'svg' | 'img'
  logo?: string
  text?: string
  flipped: boolean
  matched: boolean
}>()

const logoMap = {
  chatgpt: {
    outline: ChatGptOutline,
    filled: ChatGptFilled,
  },
  meta: {
    outline: MetaOutline,
    filled: MetaFilled,
  },
  github: {
    outline: GithubOutline,
    filled: GithubFilled,
  },
  gemini: {
    outline: GeminiOutline,
    filled: GeminiFilled,
  },
  canva: {
    outline: CanvaOutline,
    filled: CanvaLogoFilled,
  },
}

const LogoComponent = computed(() => {
  if (!props.logo) return null
  const key = props.logo as keyof typeof logoMap
  return props.matched ? logoMap[key].filled : logoMap[key].outline
})

const emit = defineEmits<{
  (e: 'flip'): void
}>()

// Computed style for front side border and shadow
const frontStyle = computed<CSSProperties>(() => ({
  boxSizing: 'border-box',
  background: '#FFFFFF',
  borderRadius: '12px',
  border: props.matched ? '3px solid #10B981' : '3px solid #006082',
  boxShadow: props.matched ? '0px 4px 0px #10B981' : '0px 4px 0px #006082',
}))

// Computed style for back side border and shadow
const backStyle = computed<CSSProperties>(() => {
  return {
    boxSizing: 'border-box',
    background: '#E2FEF7',
    border: '3px solid #006082',
    boxShadow: '0px 4px 0px #006082',
    borderRadius: '12px',
  }
})
</script>

<template>
  <div
class="min-w-21.5 min-h-24.5 md:min-w-40 md:min-h-47.5 perspective cursor-pointer"
    @click="!flipped && !matched && emit('flip')">
    <div
class="relative w-full h-full transition-transform duration-500 transform preserve-3d"
      :class="{ 'rotate-y-180': flipped || matched }">
      <!-- BACK SIDE -->
      <div
class="absolute inset-0 backface-hidden"
:style="backStyle">
        <div class="w-full h-full flex items-center justify-center">
          <span class="text-primary-500 text-5xl font-bold">?</span>
        </div>
      </div>

      <!-- FRONT SIDE -->
      <div
class="absolute inset-0 backface-hidden rotate-y-180"
:style="frontStyle">
        <!-- TEXT CARD -->
        <div
v-if="contentType === 'text'"
class="w-full h-full flex items-center justify-center">
          <p class="font-semibold text-[10px] md:text-body-sm text-center text-black">
            {{ text }}
          </p>
        </div>

        <!-- LOGO CARD -->
        <div
v-else-if="contentType === 'svg'"
class="w-full h-full flex items-center justify-center">
          <component
:is="LogoComponent"
class="w-14 md:w-[128px] h-auto" />
        </div>

        <!-- IMAGE CARD -->
        <div
v-else-if="contentType === 'img'"
class="w-full h-full flex items-center justify-center p-4">
          <img
v-if="text"
:src="text"
alt="Card image"
class="max-w-full max-h-full object-contain" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.perspective {
  perspective: 1000px;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}

.preserve-3d {
  transform-style: preserve-3d;
}
</style>
