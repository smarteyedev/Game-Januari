<template>
  <div class="ui-loading" :style="genStyle">
    <slot name="loading-icon">
      <UiAtomsIcon
        name="uil-spinner"
        width="24"
        height="24"
        mode="svg"
        class="ui-loading__icon animate-spin"
      />
    </slot>
    <slot name="loading-label">
      <div class="ui-loading__label">
        {{ label }}
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import UiAtomsIcon from '../icon/index.vue'
import { toKebabCase } from '@/utils/string'
import type { ILoadingProps, ILoadingUi } from '@/components/atoms/loading/types.ts'
import { computed, toRefs } from 'vue'

const props = withDefaults(defineProps<ILoadingProps>(), {
  label: 'Please Wait...',
  ui: () => ({}),
})

const { ui } = toRefs(props)

const genStyle = computed(() => {
  const styles: Record<string, any> = {}

  for (const key in ui.value) {
    const value = ui.value[key as keyof ILoadingUi]

    if (value) {
      const styleKey = `--loading-${toKebabCase(key)}`
      styles[styleKey] = value
    }
  }

  return styles
})
</script>

<style lang="postcss" scoped>
@reference "#tailwind.css";

.ui-loading {
  --loading-icon-color: var(--color-primary-500);
  --loading-label-color: var(--color-gray-700);
}

.ui-loading {
  @apply relative w-full flex items-center gap-2 justify-center;
}

.ui-loading__icon {
  color: var(--loading-icon-color);
}

.ui-loading__label {
  @apply font-semibold text-center;
  color: var(--loading-label-color);
  font-size: 14px;
}
</style>
