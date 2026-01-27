<template>
  <header class="relative z-10 flex h-12 w-full items-center justify-between p-9.5">
    <!-- Title badge -->
    <UiBadge
      size="lg"
      variant="soft"
      color="primary"
      class="h-12 min-w-103.75 rounded-[10px] bg-primary-50 px-4 text-center text-[20px] font-semibold leading-7 flex items-center justify-center"
    >
      {{ title }}
    </UiBadge>

    <!-- Actions -->
    <div class="flex items-center gap-6">
      <UiButton
        square
        variant="solid"
        size="lg"
        class="h-12 w-13 rounded-[10px] p-2 flex items-center justify-center"
        @click="$emit('toggleFullscreen')"
      >
        <template #prepend>
          <UiAtomsIcon
name="material-symbols:fullscreen"
class="h-9 w-9 text-white" />
        </template>
      </UiButton>
    </div>
  </header>
</template>

<script setup lang="ts">
import UiBadge from '@/components/atoms/badge/index.vue'
import UiButton from '@/components/atoms/button/index.vue'
import UiAtomsIcon from '@/components/atoms/icon/index.vue'

const props = withDefaults(defineProps<{ title?: string }>(), {
  title: 'Explore Artificial Intelligence (AI) Tools',
})

defineEmits<{
  (e: 'toggleFullscreen'): void
}>()
</script>
