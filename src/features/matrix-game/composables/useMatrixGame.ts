import { ref } from 'vue'
import type { MatrixLevelData } from '@/domain/types'
import { levelRepository } from '@/infrastructure'
import { MinigameId } from '@/domain/types'

export interface MatrixQuestion {
  id: string
  label: string
  correctAnswer: number
}

export interface MatrixOption {
  value: number
  label: string
}

export function useMatrixGame() {
  const options = ref<MatrixOption[]>([])
  const questions = ref<MatrixQuestion[]>([])
  const answers = ref<Record<string, number | undefined>>({})
  const title = ref('')
  
  const isChecked = ref(false)
  const loading = ref(false)
  const error = ref<unknown>(null)

  async function fetchLevel(levelId: number = 1, offline: boolean = true) {
    loading.value = true
    error.value = null
    try {
      const data = await levelRepository.getLevel<MatrixLevelData>(
        MinigameId.Matrix,
        levelId,
        offline
      )
      
      const content = data.content
      title.value = content?.question || data.intro?.title || ''
      
      options.value = (content?.options || []).map(opt => ({
        value: opt.id,
        label: opt.label
      }))
      
      questions.value = (content?.subquestions || []).map(sq => ({
        id: String(sq.id),
        label: sq.label,
        correctAnswer: sq.answer
      }))
      
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
    answers.value = {}
    questions.value.forEach(q => {
      answers.value[q.id] = undefined
    })
    isChecked.value = false
  }

  function checkAnswers() {
    let correct = 0
    questions.value.forEach(q => {
      if (answers.value[q.id] === q.correctAnswer) {
        correct++
      }
    })
    
    isChecked.value = true
    const won = correct === questions.value.length
    
    return {
      won,
      correctCount: correct,
      totalCount: questions.value.length,
      responses: questions.value.map(q => ({
        questionId: q.id,
        answer: answers.value[q.id]
      }))
    }
  }

  return {
    options,
    questions,
    answers,
    title,
    isChecked,
    loading,
    error,
    fetchLevel,
    checkAnswers,
    resetBoard
  }
}
