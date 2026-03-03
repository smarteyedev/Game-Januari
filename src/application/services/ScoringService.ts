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

/**
 * Compute score with a flexible context and parameters.
 * Default behaviour matches the AutomationSpotter formula: combines correctness and time.
 */
export function computeScore(
  context: ScoreContext,
  params: ScoringParams = {}
): number {

  const {
    total = 0,
    correct = 0,
    attempts = 1,
    timeUsed = 0,
    maxTime = 180,
  } = context

  const timeTolerance = params.timeTolerance ?? 30
  const answerWeight = params.answerWeight ?? 0.7
  const timeWeight = params.timeWeight ?? 0.3

  // ----- Correct ratio (0–1) -----
  const correctRatio = total > 0 ? correct / total : correct
  const attemptFactor = Math.max(0, 1 - 0.1 * (Math.max(1, attempts) - 1))
  const adjustedCorrect = correctRatio * attemptFactor

  // ----- Time ratio (0–1) -----
let timeRatio = 1

if (maxTime > 0) {
  const graceLimit = timeTolerance
  if (timeUsed > graceLimit) {
    const raw = (maxTime - timeUsed) / maxTime
    timeRatio = Math.max(0, raw)
  }
}

  // ----- Weighted result -----
  const finalRatio =
    (adjustedCorrect * answerWeight) +
    (adjustedCorrect > 0 ? timeRatio * timeWeight : 0)

  return Math.round(Math.max(0, Math.min(1, finalRatio)) * 100)
}

export function getFeedback(score: number): string {
  if (score >= 99) return "Selamat! Anda telah menunjukkan hasil hasil yang sempurna. jawaban terjawab dengan eksekusi yang optimal. Hasil ini menunjukkan keasiapan yang sempurna."
  if (score >= 95) return "Hasil yang sangat mernuaskan dengan tingkat ketelitian dan pemahaman yang hampir menyeluruh. Terdapat sedikit ruang untuk penyempurnaan,namun performa Anda sudah sangat baik."
  if (score >= 80) return "Performa sangat baik dan menunjukkan pemahaman yang kuat terhadap sebagian besar konsep. Namun masih terdapat beberapa kesalahan yang perlu diperbaiki."
  if (score >= 65) return "Pemahaman dasar sudah cukup memadai, namun masih dipertukan penguatan agar pembelajaran dapat dipahami secara tebih menyeluruh."
  if(score >= 50) return "Performa masih menunjukkan beberapa ketidaktepatan dalam memahi konsep yang diuji. Pemahaman dasar sudah ada, nambum ditingkakan kemabali."
  return "Hasil menunjukkan pernahaman yang memadai terhadap konsep yang diuji dan masih membutuhkan perbaikan. Diharapkan lebih teliti dalam membaca dan mengerjakan."
}

export default { computeScore }
