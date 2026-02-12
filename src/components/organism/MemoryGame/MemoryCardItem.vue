<script setup lang="ts">
import { computed } from 'vue'
import ChatGptOutline from '@/components/atoms/iconComponent/ChatGptLogo.vue'
import ChatGptFilled from '@/components/atoms/iconComponent/ChatGptLogoFilled.vue'
import CanvaOutline from '@/components/atoms/iconComponent/CanvaLogo.vue'
import CanvaLogoFilled from '@/components/atoms/iconComponent/CanvaLogoFilled.vue'
import GeminiOutline from '@/components/atoms/iconComponent/GeminiLogo.vue'
import GeminiFilled from '@/components/atoms/iconComponent/GeminiLogoFilled.vue'
import MetaOutline from '@/components/atoms/iconComponent/MetaLogo.vue'
import MetaFilled from '@/components/atoms/iconComponent/MetaLogoFilled.vue'
import GithubOutline from '@/components/atoms/iconComponent/GithubLogo.vue'
import GithubFilled from '@/components/atoms/iconComponent/GithubLogoFilled.vue'
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
  <div class="w-full min-w-40 aspect-4/5 perspective cursor-pointer" @click="!flipped && !matched && emit('flip')">
    <div class="relative w-full h-full transition-transform duration-500 transform preserve-3d"
      :class="{ 'rotate-y-180': flipped || matched }">
      <!-- BACK SIDE -->
      <div class="absolute inset-0 backface-hidden" :style="backStyle">
        <div class="w-full h-full flex items-center justify-center">
          <span class="text-primary-500 text-5xl font-bold">?</span>
        </div>
      </div>

      <!-- FRONT SIDE -->
      <div class="absolute inset-0 backface-hidden rotate-y-180" :style="frontStyle">
        <!-- TEXT CARD -->
        <div v-if="contentType === 'text'" class="w-full h-full flex items-center justify-center p-4">
          <p class="font-inter font-medium text-xs leading-4.5 text-center text-black" style="
              font-family: 'Inter', sans-serif;
              font-style: normal;
              font-weight: 500;
              font-size: 12px;
              line-height: 18px;
              text-align: center;
              color: #000000;
            ">
            {{ text }}
          </p>
        </div>

        <!-- LOGO CARD -->
        <div v-else-if="contentType === 'svg'" class="w-full h-full flex items-center justify-center">
          <component :is="LogoComponent" class="w-20 h-auto" />
        </div>

        <!-- IMAGE CARD -->
        <div v-else-if="contentType === 'img'" class="w-full h-full flex items-center justify-center p-4">
          <img v-if="text" :src="text" alt="Card image" class="max-w-full max-h-full object-contain" />
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
