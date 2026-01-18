<template>
  <div class="flex flex-col h-full gap-4 w-[90vw]">
    <!-- STAR RATING -->
    <div class="flex justify-center gap-3 mt-6">
      <span
        v-for="star in 5"
        :key="star"
        class="cursor-pointer select-none text-5xl leading-none"
        :class="star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'"
        @click="rating = star"
        @mouseenter="hoverRating = star"
        @mouseleave="hoverRating = 0"
      >
        ★
      </span>
    </div>

    <!-- FEEDBACK -->
    <textarea
      v-model="feedback"
      class="border p-3 rounded h-40 focus:outline-2 focus:outline-[#00A3B5]"
      placeholder="Tulis feedback..."
    />

    <!-- SUBMIT -->
    <button class="bg-[#00A3B5] hover:bg-teal-600 text-white px-4 py-2 rounded" @click="submit">
      Submit
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'submitted'): void
}>()

const rating = ref(0)
const hoverRating = ref(0)
const feedback = ref('')

const submit = () => {
  console.log({
    rating: rating.value,
    feedback: feedback.value,
  })

  emit('submitted')
}
</script>
