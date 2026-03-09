<template>
    <div class="flex flex-col text-primary-700 gap-4 w-full">
        <div class="flex flex-col gap-1.5">
            <div class="flex justify-between m-0 gap-0 border-b border-gray-100 pb-2">
                <span class="text-body-md md:text-body-lg font-extrabold text-primary-700">
                    Review
                </span>

                <UiButton :square="true" variant="ghost" icon="carbon-close-outline" :iconSize="20"
                    @click="$emit('toggle-summary')" />
            </div>

            <div v-if="reviewPoints.length > 0" class="flex flex-col gap-2">
                <div v-for="(item, index) in reviewPoints" :key="index" class="flex flex-col gap-1">
                    <p class="text-body-xs md:text-body-lg font-extrabold">
                        {{ item.point }}
                    </p>
                    <p class="text-body-xs md:text-body-lg">
                        {{ item.review }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SuccessResultData, FailureResultData, Reviewpoint } from '@/domain/types'
import { UiButton } from '../atoms/button'

const props = defineProps<{
    resultSummary?: SuccessResultData | FailureResultData
}>()

const reviewPoints = computed<Reviewpoint[]>(() => {
    console.log('result summary', props.resultSummary)
    // The resultSummary already contains the reviewpoint array directly
    return props.resultSummary?.reviewpoint ?? []
})

defineEmits<{
    (e: 'toggle-summary'): void
}>()
</script>
