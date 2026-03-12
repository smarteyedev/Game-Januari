import { reactive } from 'vue'

export interface DragPayload<T = unknown> {
  item: T
  sourceZone: string
  index: number
}

export interface ZoneMeta {
  id: string
  el: HTMLElement
}

export const dragState = reactive({
  dragging: false,
  payload: null as DragPayload | null,

  x: 0,
  y: 0,

  offsetX: 0,
  offsetY: 0,

  activeZone: null as string | null,

  zones: new Map<string, ZoneMeta>(),
})

export function registerZone(id: string, el: HTMLElement) {
  dragState.zones.set(id, { id, el })
}

export function unregisterZone(id: string) {
  dragState.zones.delete(id)
}

export function startDrag(payload: DragPayload, e: PointerEvent) {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()

  dragState.dragging = true
  dragState.payload = payload
  dragState.x = e.clientX
  dragState.y = e.clientY

  dragState.offsetX = e.clientX - rect.left
  dragState.offsetY = e.clientY - rect.top
}

export function moveDrag(e: PointerEvent) {
  dragState.x = e.clientX
  dragState.y = e.clientY

  detectZone()
}

export function endDrag() {
  dragState.dragging = false
  dragState.payload = null
  dragState.activeZone = null
}

function detectZone() {
  dragState.activeZone = null

  for (const zone of dragState.zones.values()) {
    const rect = zone.el.getBoundingClientRect()

    if (
      dragState.x > rect.left &&
      dragState.x < rect.right &&
      dragState.y > rect.top &&
      dragState.y < rect.bottom
    ) {
      dragState.activeZone = zone.id
      return
    }
  }
}
