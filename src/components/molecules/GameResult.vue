<template>
    <div class="flex flex-col gap-4 text-primary-700 text-body-xs md:text-body-md">
        <div>
            <span class="font-extrabold ">{{ success ? successResult?.description : failureResult?.description }}</span>
        </div>
        <div>
            <span class="font-extrabold ">{{ success ? 'Kekuatan Anda' : 'Kegagalan Anda' }}</span>
            <p class="font-semibold">{{ success ? successResult?.power : failureResult?.failure }}</p>
        </div>
        <div>
            <span class="font-extrabold ">{{ success ? 'Kegagalan Anda' : 'Tips' }}</span>
            <p class="font-semibold">{{ success ? successResult?.improvement : failureResult?.tips }}</p>
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