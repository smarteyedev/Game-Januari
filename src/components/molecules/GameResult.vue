<template>
    <div class="flex flex-col">
        <div>
            <span>{{ success ? successResult?.description : failureResult?.description }}</span>
        </div>
        <div>
            <span>{{ success ? 'Kekuatan Anda' : 'Kegagalan Anda' }}</span>
            <p>{{ success ? successResult?.power : failureResult?.failure }}</p>
        </div>
        <div>
            <span>{{ success ? 'Kegagalan Anda' : 'Tips' }}</span>
            <p>{{ success ? successResult?.improvement : failureResult?.tips }}</p>
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