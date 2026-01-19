<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabaseClient'

interface Score {
  automationSpotter: number
  dragAndDrop: number
  memoryGame: number
}

const score = ref<Score>({
  automationSpotter: 0,
  dragAndDrop: 0,
  memoryGame: 0,
})

const name = ref('-')
const kantor = ref('-')
const unit = ref('-')

onMounted(async () => {
  const playerId = localStorage.getItem('player_id')
  if (!playerId) return

  const { data: player } = await supabase
    .from('Player')
    .select('nama, kantor, unit')
    .eq('id', playerId)
    .single()

  if (player) {
    name.value = player.nama
    kantor.value = player.kantor
    unit.value = player.unit
  }

  const sessionId = sessionStorage.getItem('score_session_id')
  if (!sessionId) return

  const { data: scoreData } = await supabase
    .from('Score')
    .select('automationSpotter, dragAndDrop, memoryGame')
    .eq('id', sessionId)
    .single()

  if (scoreData) {
    score.value = scoreData
  }
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="mt-4 font-semibold text-base">
      <p>Nama: {{ name }}</p>
      <p>Kantor: {{ kantor }}</p>
      <p>Unit: {{ unit }}</p>
    </div>

    <div class="flex justify-center items-center gap-6 mt-4">
      <div class="p-4 border rounded flex flex-col items-center">
        <p class="font-semibold">Automation Spotter</p>
        <p>Score:</p>
        <p>{{ score.automationSpotter ?? 0 }}</p>
      </div>

      <div class="p-4 border rounded flex flex-col items-center">
        <p class="font-semibold">Drag and Drop Prompt</p>
        <p>Score:</p>
        <p>{{ score.dragAndDrop ?? 0 }}</p>
      </div>

      <div class="p-4 border rounded flex flex-col items-center">
        <p class="font-semibold">Memory Game</p>
        <p>Score:</p>
        <p>{{ score.memoryGame ?? 0 }}</p>
      </div>
    </div>
  </div>
</template>
