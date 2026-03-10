import { computed, onMounted, onUnmounted, ref } from 'vue'
import clickSound from '@/assets/sounds/btn_click.ogg'

export function useGameViewContext() {
  const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1200)

  function updateWidth() {
    windowWidth.value = window.innerWidth
  }

  onMounted(() => {
    window.addEventListener('resize', updateWidth)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateWidth)
  })

  const isXs = computed(() => windowWidth.value < 640)
  const isSm = computed(() => windowWidth.value >= 640 && windowWidth.value < 768)
  const isMd = computed(() => windowWidth.value >= 768 && windowWidth.value < 1024)

  const buttonSize = computed(() => {
    if (isXs.value) return 'xs'
    if (isSm.value) return 'sm'
    if (isMd.value) return 'md'
    return 'xl'
  })

  // Audio handling
  let audio: HTMLAudioElement | null = null
  
  function playClick() {
    if (typeof window === 'undefined') return
    
    if (!audio) {
      audio = new Audio(clickSound)
    }
    
    audio.currentTime = 0
    audio.volume = 1
    audio.play().catch(() => { })
  }

  return {
    buttonSize,
    playClick,
    isXs,
    isSm,
    isMd
  }
}
