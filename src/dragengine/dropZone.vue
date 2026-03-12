<script setup lang="ts" generic="T">
import { onMounted, onUnmounted, ref, watch } from "vue"
import { dragState, registerZone, unregisterZone } from "./dragEngine"

const props = defineProps<{
    zoneId: string
    items: T[]
    maxDragItem: number
    swapping?: boolean
}>()

const emit = defineEmits(["move"])

const zoneRef = ref<HTMLElement>()

onMounted(() => {
    registerZone(props.zoneId, zoneRef.value!)
})

onUnmounted(() => {
    unregisterZone(props.zoneId)
})

watch(() => dragState.dragging, (v) => {

    if (!v && dragState.payload) {

        if (dragState.activeZone === props.zoneId) {

            emit("move", {
                from: dragState.payload.sourceZone,
                to: props.zoneId,
                index: dragState.payload.index
            })

        }

    }

})
</script>

<template>

    <div ref="zoneRef" class="dropzone" :class="{ active: dragState.activeZone === zoneId }">
        <slot />
    </div>

</template>

<style scoped>
.dropzone {
    min-height: 80px;
    border: 2px dashed #bbb;
    padding: 8px;
    transition: 0.2s;
}

.dropzone.active {
    border-color: #4f8cff;
    background: #eef5ff;
}
</style>