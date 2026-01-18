import { ref, onUnmounted } from 'vue'

export type UseTimerOptions = {
  immediate?: boolean
  onFinish?: () => void
}

export function useTimer(maxTime: number, options: UseTimerOptions = {}) {
  const time = ref<number>(maxTime)
  const timerId = ref<number | null>(null)
  const isGameOver = ref(false)
  const isRunning = ref(false)

  function clear() {
    if (timerId.value !== null) {
      clearInterval(timerId.value)
      timerId.value = null
    }
    isRunning.value = false
  }

  function start() {
    clear()
    time.value = maxTime
    isGameOver.value = false
    isRunning.value = true

    timerId.value = window.setInterval(() => {
      if (time.value > 0) {
        time.value--
      } else {
        clear()
        isGameOver.value = true
        options.onFinish?.()
      }
    }, 1000) as unknown as number
  }

  function stop() {
    clear()
  }

  function restart() {
    start()
  }

  onUnmounted(() => {
    clear()
  })

  if (options.immediate) start()

  return {
    time,
    isGameOver,
    isRunning,
    start,
    stop,
    restart,
  }
}

export default useTimer
