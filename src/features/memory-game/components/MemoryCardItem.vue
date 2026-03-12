<script setup lang="ts">
import { computed } from 'vue'
import { Card } from '@/components/atoms'
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

const emit = defineEmits<{
  (e: 'click'): void
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

// Styles from oldcard logic
const frontStyle = computed<CSSProperties>(() => ({
  boxSizing: 'border-box',
  background: '#FFFFFF',
  borderRadius: '12px',
  border: props.matched ? '3px solid #10B981' : '3px solid #006082',
  boxShadow: props.matched ? '0px 4px 0px #10B981' : '0px 4px 0px #006082',
}))

const backStyle = computed<CSSProperties>(() => ({
  boxSizing: 'border-box',
  background: '#E2FEF7',
  border: '3px solid #006082',
  boxShadow: '0px 4px 0px #006082',
  borderRadius: '12px',
}))

const customClass = 'min-w-21.5 min-h-24.5 md:min-w-40 md:min-h-47.5'
</script>

<template>
  <Card
    variant="flip"
    :flipped="flipped || matched"
    :custom-class="customClass"
    @click="emit('click')"
  >
    <!-- BACK SIDE (What is shown when UNFLIPPED) -->
    <template #back>
      <div
class="w-full h-full flex items-center justify-center"
:style="backStyle">
        <span class="text-primary-500 text-5xl font-bold">?</span>
      </div>
    </template>

    <!-- FRONT SIDE (What is shown when FLIPPED) -->
    <template #front>
      <div
class="w-full h-full flex items-center justify-center"
:style="frontStyle">
        <!-- TEXT CARD -->
        <div
v-if="contentType === 'text'"
class="w-full h-full flex items-center justify-center p-2">
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
          class="w-full h-full flex items-center justify-center p-4"
        >
          <img
            v-if="text"
            :src="text"
            alt="Card image"
            class="max-w-full max-h-full object-contain"
          />
        </div>
      </div>
    </template>
  </Card>
</template>
