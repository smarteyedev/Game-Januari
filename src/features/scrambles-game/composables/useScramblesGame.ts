import { ref, computed } from 'vue'
import type { ScramblesLevelData } from '@/domain/types'
import { levelRepository } from '@/infrastructure'
import { MinigameId } from '@/domain/types'
import { shuffle } from '@/utils/shuffle'

type Submission = {
  value: string
  correct: boolean
}

export function useScramblesGame() {
  const question = ref('')
  const answer = ref('')
  const userInput = ref<(string | null)[]>([])
  const submissions = ref<Submission[]>([])
  const hints = ref<(string | null)[]>([])
  const attempts = ref(4)
  const maxAttempts = ref(4)
  const junkLettersCount = ref(3)

  const loading = ref(false)
  const error = ref<unknown>(null)
  const isChecked = ref(false)

  const displayInput = computed(() => {
    return userInput.value.map((c, i) => hints.value[i] ?? c ?? '').join('')
  })

  const answerChars = computed(() => {
    const realChars = answer.value.split('')
    const exclude = new Set(realChars)

    const junkChars = Array.from({ length: junkLettersCount.value }, () => getRandomLetter(exclude))

    return shuffle([...realChars, ...junkChars]).map((c, i) => ({ c, i }))
  })

  function getRandomLetter(exclude: Set<string>): string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const available = alphabet.split('').filter((c) => !exclude.has(c))
    if (available.length === 0) return 'X'
    return available[Math.floor(Math.random() * available.length)]!
  }

  async function fetchLevel(levelId: number = 1, offline: boolean = true) {
    loading.value = true
    error.value = null
    try {
      const data = await levelRepository.getLevel<ScramblesLevelData>(
        MinigameId.Scrambles,
        levelId,
        offline,
      )

      const content = data.content
      const config = data.config

      question.value = content?.question || ''
      answer.value = (content?.answer || '').toUpperCase()

      maxAttempts.value = config?.max_attempt || 4
      junkLettersCount.value = config?.junk_letter || 3

      resetBoard()

      return data
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  function resetBoard() {
    attempts.value = maxAttempts.value
    submissions.value = []
    hints.value = Array(answer.value.length).fill(null)
    userInput.value = Array(answer.value.length).fill(null)
    isChecked.value = false
  }

  function onCharInput(char: string) {
    for (let i = 0; i < userInput.value.length; i++) {
      if (!hints.value[i] && userInput.value[i] === null) {
        userInput.value[i] = char
        return
      }
    }
  }

  function deleteChar() {
    for (let i = userInput.value.length - 1; i >= 0; i--) {
      if (!hints.value[i] && userInput.value[i] !== null) {
        userInput.value[i] = null
        return
      }
    }
  }

  function submitAnswer() {
    const guess = displayInput.value
    const correct = guess === answer.value

    submissions.value.push({ value: guess, correct })

    if (correct) {
      isChecked.value = true
      return { correct: true, gameOver: true, win: true }
    }

    attempts.value--

    if (attempts.value <= 0) {
      // reveal full answer
      hints.value = answer.value.split('')
      userInput.value = Array(answer.value.length).fill(null)
      submissions.value.push({ value: answer.value, correct: true })
      isChecked.value = true
      return { correct: false, gameOver: true, win: false }
    }

    // reveal one random hint
    revealRandomHint()
    userInput.value = Array(answer.value.length).fill(null)

    return { correct: false, gameOver: false }
  }

  function revealRandomHint() {
    const candidates = []
    for (let i = 0; i < answer.value.length; i++) {
      if (hints.value[i] === null) {
        candidates.push(i)
      }
    }
    if (candidates.length) {
      const index = candidates[Math.floor(Math.random() * candidates.length)]!
      hints.value[index] = answer.value[index]!
      userInput.value[index] = null
    }
  }

  function countCharInAnswer(char: string) {
    return answer.value.split('').filter((c) => c === char).length
  }

  function countCharUsed(char: string) {
    return displayInput.value.split('').filter((c) => c === char).length
  }

  function isCharDisabled(char: string) {
    const allowed = countCharInAnswer(char)
    const used = countCharUsed(char)
    return allowed === 0 ? used >= 1 : used >= allowed
  }

  return {
    question,
    answer,
    userInput,
    submissions,
    hints,
    attempts,
    maxAttempts,
    displayInput,
    answerChars,
    isChecked,
    loading,
    error,
    fetchLevel,
    onCharInput,
    deleteChar,
    submitAnswer,
    resetBoard,
    isCharDisabled,
  }
}
