<script setup lang="ts">
import IconButton from './IconButton.vue'

const props = withDefaults(
  defineProps<{
    title: string
  }>(),
  {
    title: 'Judul',
  },
)

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <div class="fixed inset-0 z-50 bg-black/50">
    <div class="flex justify-center p-4">
      <div
        class="max-w-[95vw] w-full max-h-[90vh] bg-white rounded-xl flex flex-col overflow-hidden"
      >
        <div class="overflow-auto px-6 py-4 flex flex-col">
          <div
            class="sticky top-0 bg-white z-10 flex items-center justify-between h-12 border-b border-[#EAEAEA]"
          >
            <span class="text-lg font-semibold">
              {{ title }}
            </span>

            <IconButton @click="$emit('close')" class="h-8 w-8 flex items-center justify-center">
              <!-- icon -->
              <template #icon>
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                  <line
                    x1="4"
                    y1="4"
                    x2="20"
                    y2="20"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                  <line
                    x1="20"
                    y1="4"
                    x2="4"
                    y2="20"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>
              </template>
            </IconButton>
          </div>

          <slot />
        </div>
      </div>
    </div>
  </div>
</template>