<script setup lang="ts">
import { UiLoading } from '@/components/atoms/loading'
import ButtonText from '@/components/atoms/ButtonText.vue'

interface Props {
    loading: boolean
    error: unknown
    retryFn?: () => void
}

defineProps<Props>()
</script>

<template>
    <div
v-if="loading"
class="grid place-items-center">
        <UiLoading />
    </div>

    <div
v-else-if="error"
class="flex flex-col items-center justify-center gap-4 p-8">
        <p class="text-h5 text-red-600">Failed to load game</p>
        <ButtonText
v-if="retryFn"
text="Retry"
variant="primary"
size="md"
@click="retryFn" />
        <p
v-else
class="text-body-sm text-gray-500">Please refresh the page</p>
    </div>

    <slot v-else />
</template>
