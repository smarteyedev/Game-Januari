<script setup lang="ts">
import { computed } from 'vue'
import Card from '@/components/molecules/Card.vue'
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

const textClass = computed(() => {
  if (!props.text) return ''

  const len = props.text.length
  if (len <= 30) return 'text-base leading-snug'
  if (len <= 60) return 'text-sm leading-snug'
  return 'text-xs leading-tight'
})
</script>

<template>
  <div class="w-full aspect-3/4 perspective" @click="!flipped && !matched && emit('flip')">
    <div
      class="relative w-full h-full transition-transform duration-500 transform preserve-3d"
      :class="{ 'rotate-y-180': flipped || matched }"
    >
      <!-- BACK -->
      <div
        class="absolute inset-0 flex items-center justify-center bg-primary-50 rounded-xl text-white text-3xl font-bold shadow-lg backface-hidden select-none cursor-pointer"
      >
        <span class="text-[#00A3B5] text-5xl">?</span>
      </div>

      <!-- FRONT -->
      <div
        class="absolute inset-0 flex items-center justify-center rounded-xl bg-white shadow-xl border-2 backface-hidden rotate-y-180 overflow-hidden"
        :class="matched ? 'bg-green-100 border-green-400' : 'border-indigo-200'"
      >
        <Card variant="content">
          <!-- TEXT CARD -->
          <p
            v-if="contentType === 'text'"
            class="w-full h-full flex items-center justify-center text-center px-3 wrap-break-word overflow-hidden"
            :class="textClass"
          >
            {{ text }}
          </p>

          <!-- LOGO CARD -->
          <component
            v-else-if="contentType === 'svg'"
            :is="LogoComponent"
            class="w-20 h-auto transition-colors duration-300"
          />

          <!-- IMAGE CARD  -->
          <div
            v-else-if="contentType === 'img'"
            class="w-full h-full flex items-center justify-center"
          >
            <img
              v-if="text"
              :src="text"
              alt="Card image"
              class="max-w-full max-h-full object-contain"
            />
          </div>
        </Card>
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
