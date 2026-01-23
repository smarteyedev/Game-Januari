<script setup lang="ts">
import IconLabel from './IconLabel.vue';

const props = defineProps<{
  title?: string
  description?: string
  key_points?: string[]
}>()

</script>

<template>
  <div class="flex flex-col gap-[40px] w-full text-center">
    <div class="flex flex-col gap-[16px]">
      <p class="text-lg font-bold">{{title}}</p>
      <p class="text-base">
        {{ description }}
      </p>
    </div>
    <div class="flex flex-col gap-[6px] text-left">
        <IconLabel
          v-for="(point, index) in key_points"
          :key="index"
          :label="point"
          :bullet="true"
        ></IconLabel>
    </div>
  </div>
</template>
