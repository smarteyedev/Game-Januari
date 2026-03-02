<template>
  <div class="ui-label" :style="genStyle">
    <label :for="name" class="ui-label__text">
      <slot name="label" v-bind="{ label }">
        {{ label }}
      </slot>
    </label>

    <Tooltip v-if="tooltip" placement="right" trigger="hover" v-bind="floatingVueConfig">
      <template #default="slotProps">
        <slot name="tooltip-icon" v-bind="slotProps">
          <UiAtomsIcon name="mdi-information-outline" width="17" height="17" mode="svg" class="text-gray-400" />
        </slot>
      </template>

      <template #popper>
        <div class="tooltip__content">
          <slot name="tooltip-content">
            {{ tooltip }}
          </slot>
        </div>
      </template>
    </Tooltip>
  </div>
</template>

<script lang="ts" setup>
import { Tooltip } from 'floating-vue'
import UiAtomsIcon from '../icon/index.vue'
import { toKebabCase } from '@/utils/string'
import type { ILabelProps, ILabelUi } from '@/components/atoms/label/types.ts'
import { computed, toRefs } from 'vue'

const props = withDefaults(defineProps<ILabelProps>(), {
  name: '',
  label: '',
  tooltip: '',
  ui: () => ({}),
  floatingVueConfig: () => ({}),
})

defineSlots<{
  label: (props: { label?: string }) => any
  'tooltip-icon': () => any
  'tooltip-content': () => any
}>()

const { ui } = toRefs(props)

const genStyle = computed(() => {
  const styles: Record<string, any> = {}

  for (const key in ui.value) {
    const value = ui.value[key as keyof ILabelUi]

    if (value) {
      const styleKey = `--label-${toKebabCase(key)}`
      styles[styleKey] = value
    }
  }

  return styles
})
</script>

<style lang="postcss" scoped>
@reference "#tailwind.css";

.ui-label {
  --label-color: var(--color-gray-900, inherit);
}

.ui-label {
  @apply flex items-center gap-2 text-gray-900;
}

.ui-label__text {
  @apply block text-sm font-semibold;
}
</style>
