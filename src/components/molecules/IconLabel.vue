<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { UiIcon } from '../atoms/icon';

const props = defineProps<{
  label: string
  iconName?: string   // icon name for Iconify
  iconPosition?: 'start' | 'end' // prepend or append
  iconWidth?: number
  iconHeight?: number
  bullet?: boolean
}>()

const slots = useSlots()
const hasIconSlot = !!slots.icon

const showIcon = computed(() => !!props.iconName || hasIconSlot)
</script>

<template>
  <div class="flex items-center gap-2">
    <!-- prepend icon -->
    <template v-if="showIcon && props.iconPosition === 'start'">
      <slot name="icon">
        <UiIcon v-if="props.iconName" :name="props.iconName" :width="props.iconWidth" :height="props.iconHeight" />
      </slot>
    </template>

    <!-- label -->
    <span>{{ props.label }}</span>

    <!-- append icon -->
    <template v-if="showIcon && props.iconPosition === 'end'">
      <slot name="icon">
        <UiIcon v-if="props.iconName" :name="props.iconName" :width="props.iconWidth" :height="props.iconHeight" />
      </slot>
    </template>

    <!-- fallback bullet -->
    <span v-if="props.bullet && !showIcon" class="mr-2">•</span>
  </div>
</template>
