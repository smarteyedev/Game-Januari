<template>
    <div class="flex flex-col gap-4 text-primary-700 text-body-xs md:text-h4 w-full">
        <div v-if="success ? successResult?.reviewpoint?.length : failureResult?.reviewpoint?.length">
            <div v-for="(item, index) in (success ? successResult?.reviewpoint : failureResult?.reviewpoint)"
                :key="index" class="mb-4">
                <span class="font-extrabold">{{ item.point }}</span>
                <p class="font-semibold">{{ item.review }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { FailureResultData, SuccessResultData } from '@/domain';

const props = defineProps<{
    success: boolean,
    successResult?: SuccessResultData,
    failureResult?: FailureResultData
}>()
</script>