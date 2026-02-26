import { ref, onMounted, onUnmounted } from 'vue'

export function useBreakpoint() {
  const isXs = ref(false)
  const isSm = ref(false)
  const isMd = ref(false)
  const isLg = ref(false)

  let xsQuery: MediaQueryList
  let smQuery: MediaQueryList
  let mdQuery: MediaQueryList
  let lgQuery: MediaQueryList

  function update() {
    isXs.value = xsQuery.matches
    isSm.value = smQuery.matches
    isMd.value = mdQuery.matches
    isLg.value = lgQuery.matches
  }

  onMounted(() => {
    xsQuery = window.matchMedia('(max-width: 479px)')
    smQuery = window.matchMedia('(max-width: 639px)')
    mdQuery = window.matchMedia('(min-width: 640px) and (max-width: 1023px)')
    lgQuery = window.matchMedia('(min-width: 1024px)')

    update()

    xsQuery.addEventListener('change', update)
    smQuery.addEventListener('change', update)
    mdQuery.addEventListener('change', update)
    lgQuery.addEventListener('change', update)
  })

  onUnmounted(() => {
    xsQuery.removeEventListener('change', update)
    smQuery.removeEventListener('change', update)
    mdQuery.removeEventListener('change', update)
    lgQuery.removeEventListener('change', update)
  })

  return { isXs, isSm, isMd, isLg }
}