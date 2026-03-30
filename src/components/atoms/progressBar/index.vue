<script setup lang="ts">
import type { IProgressBarProps } from '@/components/atoms/progressBar/types.ts'
import { computed, toRefs } from 'vue'
import { UiIcon } from '../icon'

const props = withDefaults(
  defineProps<
    IProgressBarProps & {
      variant?: 'default' | 'with-icon'
      current?: number
      target?: number
    }
  >(),
  {
    progress: 0,
    max: 100,
    showLabel: false,
    variant: 'default',
    ui: () => ({}),
  },
)

const { progress, max, current, target } = toRefs(props)

const percent = computed(() => {
  return Math.floor((Number(progress.value) / Number(max.value)) * 100) || 0
})

const isComplete = computed(() => {
  return (target?.value ?? 0) > 0 && (current?.value ?? 0) >= (target?.value ?? 0)
})
</script>

<template>
  <div
class="ui-progress-wrapper"
:class="`ui-progress--${variant}`">
    <!-- BAR -->
    <div
      class="ui-progress-bar"
      :style="{
        '--progress-total': progress || 0,
        '--progress-max': max || 100,
        '--progress-background-color': ui?.backgroundColor,
        '--progress-color': ui?.color,
      }"
    >
      <div class="ui-progress-bar__meter"></div>
      <div class="ui-progress-bar__value"></div>

      <div
class="ui-progress-bar__text"
v-if="showLabel">
        <slot
name="label"
v-bind="{ percent }">{{ percent }}%</slot>
      </div>
    </div>

    <!-- ICON VARIANT -->
    <template v-if="variant === 'with-icon'">
      <UiIcon
        name="mdi:star"
        size="20"
        :class="[
          'shrink-0 transition-all duration-300',
          isComplete ? 'text-yellow-400 scale-110' : 'text-gray-300',
        ]"
      />

      <span class="ui-progress-counter"> {{ current }} / {{ target }} </span>
    </template>
  </div>
</template>

<style scoped>
.ui-progress-bar {
  --progress-total: 0;
  --progress-max: 100;
  --progress-color: var(--color-primary-500);
  --progress-label-color: var(--color-gray-50, white);
  --progress-background-color: var(--color-gray-50, #eaeaea);

  --progress-percentage: calc((var(--progress-total) / var(--progress-max)) * 100%);

  width: 100%;
  height: 10px;
  overflow: hidden;
  position: relative;
  font-size: 7px;
  border-radius: inherit;
}

.ui-progress-bar__meter,
.ui-progress-bar__value {
  border-radius: inherit;
  height: 100%;
}

.ui-progress-bar__meter {
  width: 100%;
  background-color: var(--progress-background-color, #eaeaea);
}

.ui-progress-bar__text,
.ui-progress-bar__value {
  max-width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.ui-progress-bar__text {
  max-width: 100%;
  min-width: var(--progress-percentage, 0);
  position: absolute;
  top: 0;
  left: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  text-align: center;
  color: var(--progress-label-color);
}

.ui-progress-bar__value {
  width: var(--progress-percentage, 0);
  background-color: var(--progress-color);
  transition: width linear 500ms;
}

.ui-progress-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ui-progress--with-icon .ui-progress-bar {
  min-width: 140px;
}

.ui-progress-counter {
  font-weight: 600;
  white-space: nowrap;
}
</style>
