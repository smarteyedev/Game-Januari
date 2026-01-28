<script setup lang="ts">
import { UiButton } from '@/components/atoms/button'
import InputField from '@/components/molecules/InputField.vue'
import useApi from '@/composables/useApi'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSessionStore } from '@/stores/session'
import { type ApiResponse } from '@/types/types'

const router = useRouter()
const sessionStore = useSessionStore()

const nama = ref('')
const kantor = ref('')
const unit = ref('')

const isFormValid = computed(() => {
  return nama.value.trim() && kantor.value.trim() && unit.value.trim()
})

const { post, loading, error } = useApi()

async function createGuestSession() {
  try {

    const res = await post<ApiResponse<{
      guestId: string
      accessToken: string
      expiresAt: string
    }>>('/api/v1/guest/session', {
      nama: nama.value,
      kantor: kantor.value,
      unit: unit.value
    })

    if (res.success && res.data) {
      // save session in Pinia
      sessionStore.setGuestSession({
        guestId: res.data.guestId,
        accessToken: res.data.accessToken,
        expiresAt: res.data.expiresAt
      })
    }
  } catch (err) {
    console.error('Failed to create guest session', err)
  }
}

async function goToGame() {
  if (!isFormValid.value) return

  await createGuestSession()
  router.push('/game')
}
</script>

<template>
  <div class="w-screen h-screen flex justify-center items-center">
    <div class="flex flex-col justify-center items-center w-100 h-100">
      <p class="text-2xl font-semibold text-gray-800 text-center mb-2">Selamat Datang!</p>
      <p class="text-sm text-gray-500 text-center mb-6">Silahkan isi data diri</p>
      <form
@submit.prevent="goToGame"
class="flex flex-col gap-4 w-full">
        <InputField
id="nama"
v-model="nama"
label="Nama"
required />

        <InputField
id="kantor"
v-model="kantor"
label="Kantor"
required />

        <InputField
id="unit"
v-model="unit"
label="Unit"
required />

        <UiButton
type="submit"
class="w-full py-2 rounded font-semibold"> Masuk </UiButton>
      </form>
    </div>
  </div>
</template>
