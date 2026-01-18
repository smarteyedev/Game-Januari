export function toPercentString(value: number, decimals = 0): string {
  const percent = Math.min(Math.max(value * 100, 0), 100)
  return percent.toFixed(decimals) + '%'
}

export function toTimeMmss(time: number) {
  const minutes = Math.floor(time / 60)
  const seconds = time % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
