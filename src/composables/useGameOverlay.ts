import { ref } from 'vue'

export const useGameOverlay = () => {
  const showIntro = ref(false)
  const showResult = ref(false)
  const showSummary = ref(false)

  const openIntro = () => {
    showIntro.value = true
    showResult.value = false
    showSummary.value = false
  }

  const openResult = () => {
    showIntro.value = false
    showResult.value = true
    showSummary.value = false
  }

  const openSummary = () => {
    showIntro.value = false
    showResult.value = false
    showSummary.value = true
  }

  const closeAll = () => {
    showIntro.value = false
    showResult.value = false
    showSummary.value = false
  }

  const toggleSummary = () => {
    if (showSummary.value) {
      showSummary.value = false
      showResult.value = true
    } else {
      showSummary.value = true
      showResult.value = false
    }
  }

  return {
    showIntro,
    showResult,
    showSummary,
    openIntro,
    openResult,
    openSummary,
    closeAll,
    toggleSummary,
  }
}
