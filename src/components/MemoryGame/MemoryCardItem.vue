<script setup lang="ts">
import { computed } from 'vue'
import ChatGptOutline from '@/components/icons/ChatGptLogo.vue'
import ChatGptFilled from '@/components/icons/ChatGptLogoFilled.vue'
import CanvaOutline from '@/components/icons/CanvaLogo.vue'
import CanvaLogoFilled from '@/components/icons/CanvaLogoFilled.vue'
import GeminiOutline from '@/components/icons/GeminiLogo.vue'
import GeminiFilled from '@/components/icons/GeminiLogoFilled.vue'
import MetaOutline from '@/components/icons/MetaLogo.vue'
import MetaFilled from '@/components/icons/MetaLogoFilled.vue'
import GithubOutline from '@/components/icons/GithubLogo.vue'
import GithubFilled from '@/components/icons/GithubLogoFilled.vue'

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
  <div
    class="w-full perspective min-w-[100px] min-h-[150px]"
    @click="!flipped && !matched && emit('flip')"
  >
    <div
      class="relative w-full h-full transition-transform duration-500 transform preserve-3d"
      :class="{ 'rotate-y-180': flipped || matched }"
    >
      <!-- BACK -->
      <div
        class="absolute inset-0 flex items-center justify-center bg-[#E2FEF7] rounded-xl text-white text-3xl font-bold shadow-lg backface-hidden select-none cursor-pointer"
      >
        <span class="text-[#00A3B5] text-5xl">?</span>
      </div>

      <!-- FRONT -->
      <div
        class="absolute inset-0 flex items-center justify-center rounded-xl bg-white shadow-xl border-2 backface-hidden rotate-y-180 overflow-hidden"
        :class="matched ? 'bg-green-100 border-green-400' : 'border-indigo-200'"
      >
        <!-- TEXT CARD -->
        <p
          v-if="contentType === 'text'"
          class="w-full h-full flex items-center justify-center text-center px-3 break-words overflow-hidden"
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
        <div v-else-if="contentType === 'img'" class="w-full h-full flex items-center justify-center">
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