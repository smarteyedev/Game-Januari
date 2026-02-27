import { ref, onMounted, onUnmounted } from 'vue'

export function useBreakpoint() {
  const isXs = ref(false)
  const isSm = ref(false)
  const isMd = ref(false)
  const isLg = ref(false)
  const isXl = ref(false)
  const is2Xl = ref(false)

  let xsQuery: MediaQueryList | null = null
  let smQuery: MediaQueryList | null = null
  let mdQuery: MediaQueryList | null = null
  let lgQuery: MediaQueryList | null = null
  let xlQuery: MediaQueryList | null = null
  let xxlQuery: MediaQueryList | null = null

  function update() {
    if (!xsQuery || !smQuery || !mdQuery || !lgQuery || !xlQuery || !xxlQuery) return

    isXs.value = xsQuery.matches
    isSm.value = smQuery.matches
    isMd.value = mdQuery.matches
    isLg.value = lgQuery.matches
    isXl.value = xlQuery.matches
    is2Xl.value = xxlQuery.matches
  }

  onMounted(() => {
    xsQuery  = window.matchMedia('(max-width: 639px)')
    smQuery  = window.matchMedia('(min-width: 640px) and (max-width: 767px)')
    mdQuery  = window.matchMedia('(min-width: 768px) and (max-width: 1023px)')
    lgQuery  = window.matchMedia('(min-width: 1024px) and (max-width: 1279px)')
    xlQuery  = window.matchMedia('(min-width: 1280px) and (max-width: 1535px)')
    xxlQuery = window.matchMedia('(min-width: 1536px)')

    update()

    xsQuery.addEventListener('change', update)
    smQuery.addEventListener('change', update)
    mdQuery.addEventListener('change', update)
    lgQuery.addEventListener('change', update)
    xlQuery.addEventListener('change', update)
    xxlQuery.addEventListener('change', update)
  })

  onUnmounted(() => {
    xsQuery?.removeEventListener('change', update)
    smQuery?.removeEventListener('change', update)
    mdQuery?.removeEventListener('change', update)
    lgQuery?.removeEventListener('change', update)
    xlQuery?.removeEventListener('change', update)
    xxlQuery?.removeEventListener('change', update)
  })

  return { isXs, isSm, isMd, isLg, isXl, is2Xl }
}