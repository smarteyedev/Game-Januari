<template>
  <div class="flex flex-col h-full gap-4 w-full">
    <!-- STAR RATING -->
    <StarRating v-model="rating" :max="5" />

    <!-- FEEDBACK -->
    <textarea v-model="feedback" class="border p-3 rounded h-40 focus:outline-2 focus:outline-[#00A3B5]"
      placeholder="Tulis feedback..." />

    <!-- SUBMIT -->
    <UiButton class="bg-[#00A3B5] hover:bg-teal-600 text-white px-4 py-2 rounded" @click="submit">
      Submit
    </UiButton>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { UiButton } from '../atoms/button'
import StarRating from '../molecules/StarRating.vue'

const emit = defineEmits<{
  (e: 'submitted'): void
}>()

const rating = ref(0)
const feedback = ref('')

const submit = () => {
  console.log({
    rating: rating.value,
    feedback: feedback.value,
  })

  emit('submitted')
}
</script>
