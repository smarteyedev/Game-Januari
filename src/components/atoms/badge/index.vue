<template>
  <div
    class="ui-badge"
    :class="[
      `ui-badge--${variant}`,
      `ui-badge--${color}`,
      `ui-badge--${size}`,
      `ui-badge--${type}`,
      {
        [`ui-badge--square`]: square,
      },
    ]"
    :style="genStyle"
  >
    <!-- prepend slot -->
    <slot name="prepend" class="ui-badge__prepend">
      <UiAtomsIcon
        v-if="icon"
        :name="icon"
        :width="getIconSize(size)"
        :height="getIconSize(size)"
        mode="svg"
        class="ui-badge__icon"
      />
    </slot>

    <!-- default slot -->
    <div v-if="$slots.default" class="ui-badge__label">
      <slot />
    </div>

    <!-- append slot -->
    <slot name="append" class="ui-badge__append">
      <UiAtomsIcon
        v-if="iconAppend"
        :name="iconAppend"
        :width="getIconSize(size)"
        :height="getIconSize(size)"
        mode="svg"
        class="ui-badge__icon"
      />
    </slot>
  </div>
</template>

<script setup lang="ts">
import UiAtomsIcon from '../icon/index.vue'
import { toKebabCase } from '@/utils/string.ts'
import type { IBadgeProps, IBadgeUi, TBadgeSize } from '@/components/atoms/badge/types.ts'
import { computed, toRefs } from 'vue'

const props = withDefaults(defineProps<IBadgeProps>(), {
  color: 'primary',
  variant: 'soft',
  size: 'md',
  type: 'badge',
  square: false,
})

const { ui, color, variant, size, type, square } = toRefs(props)

const genStyle = computed(() => {
  const styles: Record<string, any> = {}

  for (const key in ui.value) {
    const value = ui.value[key as keyof IBadgeUi]

    if (value) {
      const styleKey = `--badge-${toKebabCase(key)}`
      styles[styleKey] = value
    }
  }

  return styles
})

function getIconSize(size: TBadgeSize) {
  const customSize = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 16,
  }
  return customSize[size]
}
</script>

<style lang="postcss" scoped>
@import './style.css';
</style>
