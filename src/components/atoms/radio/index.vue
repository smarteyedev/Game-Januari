<template>
  <label
    class="ui-radio"
    :class="{
      'ui-radio--disabled': disabled,
      'ui-radio--readonly': readonly,
    }"
    :style="genStyle"
  >
    <input
      v-bind="inputProps"
      class="ui-radio__input"
      type="radio"
      :value="value"
      :checked="modelValue === value"
      :disabled="disabled"
      @click="($event) => (readonly ? $event.preventDefault() : null)"
      @change="handleChange"
    />

    <slot
name="label"
v-bind="{ label }">
      <span class="ui-radio__label">{{ label }}</span>
    </slot>
  </label>
</template>

<script setup lang="ts">
import { toKebabCase } from '@/utils/string.ts'
import type { IRadioProps, IRadioUi } from '@/components/atoms/radio/types.ts'
import { computed, toRefs } from 'vue'

const props = defineProps<IRadioProps>()

const model = defineModel<string | number | boolean>()

const { ui } = toRefs(props)

const genStyle = computed(() => {
  const styles: Record<string, any> = {}

  for (const key in ui.value) {
    const value = ui.value[key as keyof IRadioUi]

    if (value) {
      const styleKey = `--radio-${toKebabCase(key)}`
      styles[styleKey] = value
    }
  }

  return styles
})

const handleChange = () => {
  model.value = props.value
}
</script>

<style lang="postcss" scoped>
@reference "#tailwind.css";

.ui-radio {
  --radio-color: var(--color-primary-500, #00a3b5);

  --radio-disabled-color: #d4d4d4;
  --radio-disabled-label-color: var(--color-gray-200);
  --radio-disabled-background-color: var(--color-gray-25);
  --radio-disabled-border-color: var(--color-gray-50);

  --radio-border-color: var(--color-gray-100);
}

.ui-radio {
  @apply flex items-center cursor-pointer gap-2 w-max;
}

.ui-radio__input {
  @apply appearance-none border w-5 h-5 grid rounded-full transition-all duration-200;
  place-content: center;
  border-color: var(--radio-border-color);
  position: relative;
}

/** a hack to allow manipulating source color by opacity without relying on color format */
.ui-radio__input:before {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border-radius: 100%;
  aspect-ratio: 1/1;
  opacity: 0.1;
  position: absolute;
}

.ui-radio__input:hover:not(:disabled):before {
  background: var(--radio-color);
  box-shadow: 0 0 0 3px var(--radio-color);
}

.ui-radio__input:hover:not(:disabled) {
  border-color: var(--radio-color);
}

.ui-radio__input:checked {
  border-color: var(--radio-color);
}

/** checked mark **/
.ui-radio__input:checked:after {
  width: 50%;
  height: 50%;
  content: '';
  display: block;
  border-radius: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--radio-color);
  border-color: var(--radio-color);
}

.ui-radio__label {
  @apply text-sm font-medium;

  &:empty {
    display: none;
  }
}

/** STATE **/
.ui-radio--readonly {
  &,
  .ui-radio__input,
  .ui-radio__label {
    @apply cursor-not-allowed;
  }
}

.ui-radio--disabled {
  @apply cursor-not-allowed;

  .ui-radio__input {
    @apply cursor-not-allowed;
    border-color: var(--radio-disabled-border-color);
    background-color: var(--radio-disabled-background-color);
  }

  .ui-radio__input:checked:disabled::after {
    background-color: var(--radio-disabled-color);
  }

  .ui-radio__label {
    color: var(--radio-disabled-label-color);
  }
}
</style>
