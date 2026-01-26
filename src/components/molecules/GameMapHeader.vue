<template>
    <header class="relative z-10 flex h-12 w-full items-center justify-between p-9.5">
        <!-- Title badge -->
        <UiBadge size="lg" variant="soft" color="primary" class="
        h-12 min-w-103.75
        rounded-[10px]
        bg-primary-50
        px-4
        text-center
        text-[20px] font-semibold leading-7
        flex items-center justify-center
      ">
            Explore Artificial Intelligence (AI) Tools
        </UiBadge>

        <!-- Actions -->
        <div class="flex items-center gap-6">
            <UiButton square variant="solid" size="lg" class="
          h-12 w-13
          rounded-[10px]
          p-2
          flex items-center justify-center
        " @click="$emit('toggleFullscreen')">
                <template #prepend>
                    <UiIcon name="material-symbols:fullscreen" class="h-9 w-9 text-white" />
                </template>
            </UiButton>
        </div>
    </header>
</template>


<script setup lang="ts">
import UiBadge from '@/components/atoms/badge/index.vue';
import UiButton from '@/components/atoms/button/index.vue';
import { UiIcon } from '../atoms/icon';

defineEmits<{
    (e: 'toggleFullscreen'): void
}>()
</script>

<style scoped>
.gamemap-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    position: relative;
    z-index: 10;
}

.gamemap-header__actions {
    display: flex;
    gap: 1rem;
}
</style>
