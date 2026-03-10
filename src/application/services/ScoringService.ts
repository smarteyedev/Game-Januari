/* ===============================
   Types
================================ */

export type ScoreContext = {
  total?: number
  correct?: number
  attempts?: number
  timeUsed?: number
  maxTime?: number
}

export type ScoringParams = {
  baseScore?: number
  maxScore?: number
  timeTolerance?: number
  answerWeight?: number
  timeWeight?: number
}

/* ===============================
   Helpers
================================ */

function safeNumber(value: number | undefined, fallback = 0): number {
  return Number.isFinite(value) ? value! : fallback
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/* ===============================
   Score Calculation
================================ */

export function computeScore(
  context: ScoreContext,
  params: ScoringParams = {}
): number {

  /* -------- sanitize inputs -------- */

  const total = Math.max(0, safeNumber(context.total))
  const correct = clamp(safeNumber(context.correct), 0, total)
  const attempts = Math.max(1, safeNumber(context.attempts, 1))
  const timeUsed = Math.max(0, safeNumber(context.timeUsed))
  const maxTime = Math.max(0, safeNumber(context.maxTime, 180))

  const timeTolerance = Math.max(0, safeNumber(params.timeTolerance, 30))

  let answerWeight = safeNumber(params.answerWeight, 0.7)
  let timeWeight = safeNumber(params.timeWeight, 0.3)

  /* -------- normalize weights (optional safety) -------- */

  const weightSum = answerWeight + timeWeight

  if (weightSum > 0) {
    answerWeight /= weightSum
    timeWeight /= weightSum
  }

  /* -------- Correct ratio (0–1) -------- */

  const correctRatio = total > 0 ? correct / total : 0

  const attemptFactor = Math.max(
    0,
    1 - 0.1 * (attempts - 1)
  )

  const adjustedCorrect = correctRatio * attemptFactor

  /* -------- Time ratio (0–1) -------- */

  let timeRatio = 1

  if (maxTime > 0) {
    const graceLimit = timeTolerance

    if (timeUsed > graceLimit) {
      timeRatio = clamp(
        (maxTime - timeUsed) / maxTime,
        0,
        1
      )
    }
  }

  /* -------- Final score -------- */

  const finalRatio =
    adjustedCorrect * answerWeight +
    (adjustedCorrect > 0 ? timeRatio * timeWeight : 0)

  const finalScore = Math.round(
    clamp(finalRatio, 0, 1) * 100
  )

  return finalScore
}

/* ===============================
   Feedback
================================ */

export function getFeedback(score: number): string {

  if (score >= 99)
    return "Selamat! Anda telah menunjukkan hasil yang sempurna. Semua jawaban dieksekusi dengan sangat baik."

  if (score >= 95)
    return "Hasil yang sangat memuaskan dengan tingkat ketelitian yang tinggi. Performa Anda sudah sangat baik."

  if (score >= 80)
    return "Performa sangat baik dan menunjukkan pemahaman kuat terhadap sebagian besar konsep."

  if (score >= 65)
    return "Pemahaman dasar sudah cukup baik, namun masih perlu penguatan agar lebih konsisten."

  if (score >= 50)
    return "Performa menunjukkan beberapa ketidaktepatan. Pemahaman dasar sudah ada tetapi perlu ditingkatkan."

  return "Pemahaman terhadap konsep masih perlu ditingkatkan. Disarankan lebih teliti dalam membaca dan mengerjakan."
}

export function getSpeedFeedback(speedRatio: number): string {
  if(speedRatio >= 0.8) {
    return "Waktu yang digunakan mencerminkan kecepatan dan efisiensi pengerjaan yang sangat baik. Performa ini mencerminkan kemampuan dalam pemahaman dan pengelolaan waktu yang baik."
  }
  if(speedRatio >= 0.51) {
    return "Waktu yang digunakan sudah cukup memadai dan menunjukkan kemampuan pemahaman serta pengelolaan waktu yang cukup baik. Masih terdapat ruang untuktin tingkat yang lebih optimal"
  }
  return "Waktu yang digunakan masih belum efisien. Performa ini menjadi indikator adanya ruang yang signifikan untuk perbaikan, khususnya dalam kecepatan."
}


export default {
  computeScore,
  getFeedback,
  getSpeedFeedback
}