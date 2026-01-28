<script setup lang="ts">
import { UiButton } from '@/components/atoms/button'
import InputField from '@/components/molecules/InputField.vue'
import useApi from '@/composables/useApi'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSessionStore } from '@/stores/session'
import type { ApiResponse } from '@/types/types'
import { UiLoading } from '@/components/atoms/loading'

const router = useRouter()
const sessionStore = useSessionStore()

const nama = ref('')
const kantor = ref('')
const unit = ref('')

const formError = ref<string | null>(null)

const isFormValid = computed(
  () => !!nama.value.trim() && !!kantor.value.trim() && !!unit.value.trim(),
)

const { post, loading } = useApi()

async function createGuestSession() {
  formError.value = null

  try {
    const res = await post<
      ApiResponse<{
        guestId: string
        accessToken: string
        expiresAt: string
      }>
    >('/api/v1/guest/session', {
      nama: nama.value,
      kantor: kantor.value,
      unit: unit.value,
    })

    if (!res.success || !res.data) {
      throw new Error(res.message || 'Login gagal')
    }

    sessionStore.setGuestSession({
      guestId: res.data.guestId,
      accessToken: res.data.accessToken,
      expiresAt: res.data.expiresAt,
    })

    return true
  } catch (err: any) {
    formError.value = err?.message || 'Terjadi kesalahan. Silakan coba lagi.'
    return false
  }
}

async function goToGame() {
  if (!isFormValid.value || loading.value) return

  const success = await createGuestSession()
  if (success) {
    router.push('/game')
  }
}
</script>

<template>
  <div class="w-screen h-screen flex justify-center items-center">
    <!-- loading state -->
    <div v-if="loading">
      <UiLoading class="grid place-items-center" />
    </div>

    <!-- error state (hard failure) -->
    <div v-else-if="formError" class="text-center">
      <p class="text-red-600 font-medium mb-4">
        {{ formError }}
      </p>
      <UiButton @click="formError = null" class="px-2"> Coba lagi </UiButton>
    </div>

    <!-- form -->
    <div v-else class="flex flex-col justify-center items-center w-100 h-100">
      <p class="text-2xl font-semibold text-gray-800 text-center mb-2">Selamat Datang!</p>

      <p class="text-sm text-gray-500 text-center mb-6">Silahkan isi data diri</p>

      <form @submit.prevent="goToGame" class="flex flex-col gap-4 w-full">
        <InputField id="nama" v-model="nama" label="Nama" required />
        <InputField id="kantor" v-model="kantor" label="Kantor" required />
        <InputField id="unit" v-model="unit" label="Unit" required />

        <!-- inline error (soft failure) -->
        <p v-if="formError" class="text-sm text-red-500 text-center">
          {{ formError }}
        </p>

        <UiButton
          type="submit"
          class="w-full py-2 rounded font-semibold"
          :disabled="!isFormValid || loading"
        >
          <span v-if="loading">Loading...</span>
          <span v-else>Masuk</span>
        </UiButton>
      </form>
    </div>
  </div>
</template>
