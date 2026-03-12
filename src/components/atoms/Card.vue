<template>
  <!-- FLIP VARIANT -->
  <div
v-if="variant === 'flip'"
class="perspective cursor-pointer"
:class="[sizeClass, customClass]"
    @click="handleClick">
    <div
class="relative w-full h-full transition-transform duration-500 transform preserve-3d"
      :class="{ 'rotate-y-180': flipped }">
      <!-- BACK -->
      <div
class="absolute inset-0 backface-hidden"
:class="backClass">
        <slot name="back">
          <div class="flex items-center justify-center w-full h-full">
            ?
          </div>
        </slot>
      </div>

      <!-- FRONT -->
      <div
class="absolute inset-0 backface-hidden rotate-y-180"
:class="frontClass">
        <slot name="front" />
      </div>
    </div>
  </div>

  <!-- CONNECTIONS VARIANT -->
  <button
    v-else-if="variant === 'connections'"
    @click="clickable && !disabled && handleClick()"
    :class="[
      'min-w-[72px] min-h-[72px] w-full font-bold border-gray-500 border rounded-2xl gap-2.5 transition-all',
      connectionsStateClass,
      clickable && !disabled ? 'cursor-pointer hover:brightness-110' : 'cursor-default',
      customClass
    ]"
  >
    <span class="text-center font-semibold text-body-xs md:text-body-xl">
      <slot>{{ label }}</slot>
    </span>
  </button>

  <!-- DRAGGABLE DEFAULT VARIANT -->
  <DragItem
    v-else-if="draggable && !disabled"
    :item-data="dragData?.item"
    :index="dragData?.index ?? 0"
    :zone-id="dragData?.zoneId ?? ''"
    @drag-end="emit('drag-end')"
    :class="[
      baseClass,
      customClass,
      'cursor-grab'
    ]"
  >
    <div
@click="handleClick"
:class="{ 'flex items-center justify-center': centered }">
      <slot>
        {{ label }}
      </slot>
    </div>
  </DragItem>

  <!-- NON-DRAGGABLE DEFAULT VARIANT -->
  <div
v-else
@click="handleClick"
:class="[
    baseClass,
    customClass,
    {
      'cursor-default': disabled,
      'flex items-center justify-center': centered,
    },
  ]">
    <slot>
      {{ label }}
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DragItem from '@/components/dragengine/DragItem.vue'

const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'flip' | 'connections'
    label?: string
    flipped?: boolean
    draggable?: boolean
    disabled?: boolean
    centered?: boolean

    customClass?: string
    frontClass?: string
    backClass?: string
    sizeClass?: string

    // Connections Variant specific
    state?: 'idle' | 'selected' | 'solved'
    color?: string
    clickable?: boolean

    // New Drag Data prop
    dragData?: {
      item: any
      index: number
      zoneId: string
    }
  }>(),
  {
    variant: 'default',
    flipped: false,
    draggable: false,
    disabled: false,
    centered: false,
    customClass: '',
    frontClass: '',
    backClass: '',
    sizeClass: 'min-w-24 min-h-24',
    // Connections defaults
    state: 'idle',
    clickable: true,
  },
)

const emit = defineEmits<{
  (e: 'click', ev?: MouseEvent): void
  (e: 'drag-end'): void
}>()

const baseClass =
  'select-none break-words flex items-center justify-center'

function handleClick(ev?: MouseEvent) {
  if (props.disabled) return
  emit('click', ev)
}

// Connections Logic
const connectionsStateClass = computed(() => {
  if (props.variant !== 'connections') return ''
  if (props.state === 'selected') return 'bg-primary-100'
  if (props.state === 'solved') return props.color
  return 'bg-gray-50'
})
</script>

<style scoped>
.perspective {
  perspective: 1000px;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}

.preserve-3d {
  transform-style: preserve-3d;
}
</style>
