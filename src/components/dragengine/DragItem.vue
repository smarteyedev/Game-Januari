<script setup lang="ts" generic="T">
import { startDrag, moveDrag, endDrag, dragState } from "@/composables/useDragEngine"
import { computed } from "vue"

const props = defineProps<{
    itemData: T
    index: number
    zoneId: string
}>()

const emit = defineEmits(["dragEnd"])

const isDragging = computed(() => 
    dragState.dragging && 
    dragState.payload?.sourceZone === props.zoneId && 
    dragState.payload?.index === props.index
)

function pointerDown(e: PointerEvent) {
    e.stopPropagation()
    const el = e.currentTarget as HTMLElement
    el.setPointerCapture(e.pointerId)

    startDrag(
        {
            item: props.itemData,
            sourceZone: props.zoneId,
            index: props.index
        },
        e
    )

    window.addEventListener("pointermove", pointerMove)
    window.addEventListener("pointerup", pointerUp)
}

function pointerMove(e: PointerEvent) {
    moveDrag(e)
}

async function pointerUp(e: PointerEvent) {
    window.removeEventListener("pointermove", pointerMove)
    window.removeEventListener("pointerup", pointerUp)

    moveDrag(e)
    emit("dragEnd")
    await endDrag()
}
</script>

<template>
    <div 
        class="drag-item-container" 
        style="touch-action: none;"
        @pointerdown="pointerDown"
    >
        <slot
:item="itemData"
:isDragging="isDragging" />
    </div>
</template>
