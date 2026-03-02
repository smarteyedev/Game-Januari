<template>
  <div
    class="justify-center items-center flex w-full md:w-fit text-body-xs md:text-body-xl rounded-3xl font-black text-primary-700 border-[3px] border-primary-700 bg-white px-9 py-2 shadow-xl shadow-primary-700"
  >
    <span class="text-center">
      {{ text }}
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>
