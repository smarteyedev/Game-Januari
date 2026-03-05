<template>
    <div class="flex flex-col text-primary-700 gap-4 w-full">
        <div class="flex flex-col gap-1.5">
            <div class="flex justify-between m-0 gap-0 border-b border-gray-100 pb-2">
                <span class="text-body-md md:text-body-lg font-extrabold text-primary-700">Ringkasan
                    Performa
                </span>
                <UiButton :square="true" variant="ghost" icon="carbon-close-outline" :iconSize="20"
                    @click="$emit('toggle-summary')" />
            </div>
            <p class="text-body-xs md:text-body-md font-semibold">{{ performance }}</p>
        </div>
        <div class="flex flex-col gap-1.5">

            <span
                class="text-body-md md:text-body-lg font-extrabold text-primary-700 border-b border-gray-100 pb-2">Analisis
                Kesalahan</span>

            <p class="text-body-xs md:text-body-md font-semibold">{{ analysis }}</p>

        </div>
        <div class="flex flex-col gap-1.5">
            <span
                class="text-body-md md:text-body-lg font-extrabold text-primary-700 border-b border-gray-100 pb-2">Insight
                Tambahan</span>
            <p class="text-body-xs md:text-body-md font-semibold">{{ insight }}</p>
        </div>
        <div class="flex flex-col gap-1.5">
            <span
                class="text-body-md md:text-body-lg font-extrabold text-primary-700 border-b border-gray-100 pb-2">Rekomendasi
                Peningkatan</span>
            <p class="text-body-xs md:text-body-md font-semibold">{{ recommendation }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SuccessResultData, FailureResultData, SummaryData } from '@/domain/types'
import { UiButton } from '../atoms/button';

const props = defineProps<{ resultSummary?: SuccessResultData | FailureResultData | SummaryData }>()

const performance = computed(() => {
    // prefer SummaryData
    const s = props.resultSummary as SummaryData | undefined
    if (s && 'performance' in s) return s.performance
    const suc = props.resultSummary as SuccessResultData | undefined
    if (suc && 'description' in suc) return suc.description
    const fail = props.resultSummary as FailureResultData | undefined
    if (fail && 'description' in fail) return fail.description
    return ''
})

const analysis = computed(() => {
    const s = props.resultSummary as SummaryData | undefined
    if (s && 'analysis' in s) return s.analysis
    const suc = props.resultSummary as SuccessResultData | undefined
    if (suc && 'power' in suc) return suc.power
    const fail = props.resultSummary as FailureResultData | undefined
    if (fail && 'failure' in fail) return fail.failure
    return ''
})

const insight = computed(() => {
    const s = props.resultSummary as SummaryData | undefined
    if (s && 'insight' in s) return s.insight
    const suc = props.resultSummary as SuccessResultData | undefined
    if (suc && 'improvement' in suc) return suc.improvement
    const fail = props.resultSummary as FailureResultData | undefined
    if (fail && 'tips' in fail) return fail.tips
    return ''
})

const recommendation = computed(() => {
    const s = props.resultSummary as SummaryData | undefined
    if (s && 'recomendation' in s) return s.recomendation
    // fall back to improvement or tips
    const suc = props.resultSummary as SuccessResultData | undefined
    if (suc && 'improvement' in suc) return suc.improvement
    const fail = props.resultSummary as FailureResultData | undefined
    if (fail && 'tips' in fail) return fail.tips
    return ''
})

defineEmits<{
    (e: 'toggle-summary'): void
}>()
</script>