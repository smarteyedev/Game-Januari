<template>
  <div class="flex flex-col gap-4 text-primary-700 text-body-xs md:text-h4 w-full">
    <div class="mb-5 flex flex-col gap-4">
      <!-- If we have review points, show them -->
      <div v-if="successResult?.reviewpoint && successResult.reviewpoint.length > 0" class="flex flex-col gap-3 mt-2">
        <div v-for="(item, index) in successResult.reviewpoint" :key="index" class=" border-gray-100 pt-2">
          <span class="font-extrabold">{{ item.point }} : </span>
          <p class="font-semibold">{{ item.review }}</p>
        </div>
      </div>

      <!-- Fallback or legacy static message if no dynamic data 
      <div v-if="!successResult?.feedback && !successResult?.reviewpoint?.length" class="flex flex-col gap-3">
        <p class="font-extrabold">Kamu memahami konsep ini dengan baik</p>
        <div>
          <span class="font-extrabold">Kekuatan Anda : </span>
          <p class="font-semibold">
            Anda mampu menangani tugas administratif dengan rapi serta memahami perbedaan antara
            pekerjaan strategis dan operasional
          </p>
        </div>
        <div>
          <span class="font-extrabold">Yang bisa ditingkatkan : </span>
          <p class="font-semibold">
            Otomatisasi cocok untuk tugas repetitif dan berbasis aturan. Keputusan strategis tetap
            membutuhkan manusia.
          </p>
        </div>
      </div>
      -->
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SuccessResultData } from '@/domain'

defineProps<{
  success: boolean
  successResult?: SuccessResultData
}>()
</script>
