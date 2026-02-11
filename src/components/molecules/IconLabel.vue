<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { UiIcon } from '../atoms/icon'

const props = defineProps<{
  label: string
  iconName?: string
  iconPosition?: 'start' | 'end'
  iconWidth?: number
  iconHeight?: number
  bullet?: boolean
  iconColor?: string
}>()

const slots = useSlots()
const hasIconSlot = !!slots.icon

const showIcon = computed(() => !!props.iconName || hasIconSlot)
</script>

<template>
  <div class="flex gap-2 items-center">
    <!-- prepend icon -->
    <template v-if="showIcon && props.iconPosition === 'start'">
      <slot name="icon">
        <UiIcon
v-if="props.iconName"
:name="props.iconName"
:width="props.iconWidth"
:height="props.iconHeight"
          :color="props.iconColor" />
      </slot>
    </template>

    <span
v-if="!showIcon && props.bullet"
class="bullet-list-item">{{ props.label }}</span>
    <span v-else>{{ props.label }}</span>

    <!-- append icon -->
    <template v-if="showIcon && props.iconPosition === 'end'">
      <slot name="icon">
        <UiIcon
v-if="props.iconName"
:name="props.iconName"
:width="props.iconWidth"
:height="props.iconHeight"
          :color="props.iconColor" />
      </slot>
    </template>
  </div>
</template>

<style scoped>
.bullet-list-item {
  position: relative;
  padding-left: 1rem;
}

.bullet-list-item::before {
  content: "•";
  position: absolute;
  left: 0;
}
</style>