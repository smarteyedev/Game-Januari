<template>
  <div class="flex flex-col gap-4 text-primary-700 text-body-xs md:text-h4 w-full">
    <div class="mb-5">
      <p class="font-extrabold">Kamu memahami konsep Automation dengan baik</p>
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
          Automation cocok untuk tugas repetitif dan berbasis aturan. Keputusan strategis tetap
          membutuhkan manusia.
        </p>
      </div>
    </div>
    <!-- Review Points // Do not delete keep this in case we need dynamic message in the futue
        <div v-if="success ? successResult?.reviewpoint?.length : failureResult?.reviewpoint?.length">
            <div v-for="(item, index) in (success ? successResult?.reviewpoint : failureResult?.reviewpoint)"
                :key="index" class="mb-4">
                <span class="font-extrabold">{{ item.point }}</span>
                <p class="font-semibold">{{ item.review }}</p>
            </div>
        </div>
        -->
  </div>
</template>

<script setup lang="ts">
import type { SuccessResultData } from '@/domain'

defineProps<{
  success: boolean
  successResult?: SuccessResultData
}>()
</script>
