<template>
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
    <div class="ui-progress-bar__text" v-if="showLabel">
      <slot name="label" v-bind="{ percent }"> {{ percent }}% </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IProgressBarProps } from '@/components/atoms/progressBar/types.ts'
import { computed, toRefs } from 'vue'

const props = withDefaults(defineProps<IProgressBarProps>(), {
  progress: 0,
  max: 100,
  showLabel: false,
  ui: () => ({}),
})

const { progress, max } = toRefs(props)

const percent = computed(() => {
  return Math.floor((Number(progress.value) / Number(max.value)) * 100) || 0
})
</script>

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
</style>
