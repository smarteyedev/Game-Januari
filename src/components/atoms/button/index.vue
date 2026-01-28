<template>
  <component
    :is="tag"
    class="ui-button"
    :class="[
      `ui-button--${size}`,
      `ui-button--${color}`,
      `ui-button--${variant}`,
      {
        'ui-button--disabled': isDisabled,
        'ui-button--trailing': trailing,
        'ui-button--square': square,
      },
    ]"
    :disabled="isDisabled || undefined"
    :style="genStyle"
    type="button"
  >
    <!-- Prepend content, usually for icons or other elements -->
    <slot name="prepend" class="ui-button__prepend">
      <!-- Loading slot content (if loading is true) -->
      <UiAtomsIcon
        v-if="loading || icon"
        :name="loading ? 'uil-spinner' : icon"
        :width="getIconSize(size)"
        :height="getIconSize(size)"
        mode="svg"
        :class="{
          'animate-spin': loading,
        }"
      />
    </slot>

    <!-- Default slot for the label/text -->
    <div v-if="$slots.default && !square" class="ui-button__label">
      <slot />
    </div>

    <!-- Append content, usually for icons or other elements -->
    <slot name="append" class="ui-button__append">
      <UiAtomsIcon
        v-if="iconAppend"
        :name="iconAppend"
        :width="getIconSize(size)"
        :height="getIconSize(size)"
        mode="svg"
      />
    </slot>
  </component>
</template>

<script lang="ts" setup>
import UiAtomsIcon from '../icon/index.vue'
import { toKebabCase } from '@/utils/string.ts'
import type { IButtonProps, IButtonUi, TButtonSizes } from '@/components/atoms/button/types.ts'
import { computed, toRefs } from 'vue'

const props = withDefaults(defineProps<IButtonProps>(), {
  size: 'md',
  variant: 'solid',
  color: 'primary',
  disabled: false,
  loading: false,
  trailing: false,
  square: false,
  icon: '',
  tag: 'button',
})

const { ui } = toRefs(props)

const isDisabled = computed(() => props.disabled || props.loading)

const genStyle = computed(() => {
  const styles: Record<string, any> = {}

  for (const key in ui.value) {
    const value = ui.value[key as keyof IButtonUi]

    if (value) {
      const styleKey = `--button-${toKebabCase(key)}`
      styles[styleKey] = value
    }
  }

  return styles
})

function getIconSize(size: TButtonSizes) {
  const customSize = {
    xs: 14,
    sm: 16,
    md: 20,
    lg: 20,
    xl: 20,
  }
  return customSize[size]
}
</script>

<style lang="postcss" scoped>
@import 'style.css';
</style>
