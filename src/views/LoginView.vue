<script setup lang="ts">
import InputField from '@/components/InputField.vue'
import { supabase } from '@/lib/supabaseClient'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const nama = ref('')
const kantor = ref('')
const unit = ref('')

const isFormValid = computed(() => {
  return nama.value.trim() !== '' && kantor.value.trim() !== '' && unit.value.trim() !== ''
})

async function goToGame() {
  if (!isFormValid.value) return

  let playerId: string

  const { data, error } = await supabase
    .from('Player')
    .select('id')
    .eq('nama', nama.value)
    .maybeSingle()

  if (error) return console.error(error)

  if (data) {
    playerId = data.id
  } else {
    const { data: newPlayer, error: insertError } = await supabase
      .from('Player')
      .insert({ nama: nama.value, kantor: kantor.value, unit: unit.value })
      .select('id')
      .single()

    if (insertError) return console.error(insertError)

    playerId = newPlayer.id
  }

  localStorage.setItem('player_id', playerId)

  // --- CREATE SCORE SESSION IMMEDIATELY ---
  const { data: scoreData, error: scoreError } = await supabase
    .from('Score')
    .insert({ player_id: playerId })
    .select('id')
    .single()

  if (scoreError) return console.error(scoreError)

  sessionStorage.setItem('score_session_id', scoreData.id)

  router.push('/game')
}
</script>

<template>
  <div class="w-screen h-screen flex justify-center items-center">
    <div class="flex flex-col justify-center items-center w-[400px] h-[400px]">
      <p class="text-2xl font-semibold text-gray-800 text-center mb-2">Selamat Datang!</p>
      <p class="text-sm text-gray-500 text-center mb-6">Silahkan isi data diri</p>
      <form @submit.prevent="goToGame" class="flex flex-col gap-4 w-full">
        <InputField id="nama" v-model="nama" label="Nama" required />

        <InputField id="kantor" v-model="kantor" label="Kantor" required />

        <InputField id="unit" v-model="unit" label="Unit" required />

        <button class="w-full bg-[#00A3B5] hover:bg-teal-600 text-white py-2 rounded font-semibold">
          Masuk
        </button>
      </form>
    </div>
  </div>
</template>
