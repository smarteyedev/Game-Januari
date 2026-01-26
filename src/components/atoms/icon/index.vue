<script setup lang="ts">
import { Icon, addAPIProvider, addIcon, addCollection } from '@iconify/vue'
import type {IIconProps} from "@/components/atoms/icon/types.ts";
import { computed, toRefs } from 'vue';
const props = defineProps<IIconProps>()

const {width, height, size} = toRefs(props);

const normalizedWidth = computed(() => {
  return width?.value ?? size?.value;
})
const normalizedHeight = computed(() => {
  return height?.value ?? width?.value ?? size?.value;
})

defineExpose({
  addAPIProvider,
  addIcon,
  addCollection
})
</script>

<template>
  <Icon
    :icon="name"
    :width="normalizedWidth"
    :height="normalizedHeight"
  />
</template>
