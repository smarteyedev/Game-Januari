<template>
  <div
    class="ui-modal"
    :class="[
      `ui-modal--${size || 'md'}`,
      `ui-modal--scroll-${scrollMode || 'root'}`,
      {
        'ui-modal--divider': divider,
      },
    ]"
    :style="{
      '--modal-offset': ui?.offset,
      '--modal-content-gap': ui?.contentGap,
      '--modal-content-padding': ui?.padding,
      '--modal-footer-position': footerActionPosition(footer?.position),

      '--modal-min-height': ui?.minHeight,
      '--modal-max-height': ui?.maxHeight,
      '--modal-content-min-height': ui?.contentMinHeight,
      '--modal-content-max-height': ui?.contentMaxHeight,
    }"
  >
    <Transition name="overlay-fade">
      <div v-if="model && overlay" class="ui-modal__overlay" />
    </Transition>

    <Transition name="modal-fade">
      <div
        v-if="model"
        class="ui-modal__modal-container"
        :class="[modalPositionClass]"
        :style="{ position: props.containerPosition }"
        @click="!preventClose && onCancel()"
      >
        <div class="ui-modal__content-wrapper">
          <!-- -> Boundary hack for flex positioning issue -->

          <!-- Actual modal content -->
          <div class="ui-modal__content" :style="contentStyle" @click.stop>
            <!-- Header Slot -->
            <header
              v-if="title || $slots['header-title'] || $slots['header-extra']"
              class="ui-modal__header"
            >
              <div v-if="title || $slots['header-title']" class="ui-modal__title">
                <slot name="header-title">
                  <span v-if="title" class="ui-modal__title-text">{{ title }}</span>
                </slot>

                <slot name="close-btn" v-bind="{ onClick: onCancel }">
                  <UiAtomsIcon
                    name="uil-times"
                    class="ui-modal__close"
                    size="24"
                    @click="onCancel"
                  />
                </slot>
              </div>
              <!-- Extra content for header e.g. stepper -->
              <slot name="header-extra" />
            </header>

            <!-- Main Content Slot -->
            <div class="ui-modal__body">
              <slot />
            </div>

            <!-- Footer Slot with Default Close UiButton -->
            <footer v-if="footer || $slots.footer" class="ui-modal__footer-wrapper">
              <slot name="footer" v-bind="{ onNegativeClick: onCancel, onPositiveClick: onOK }">
                <div class="ui-modal__footer">
                  <div class="ui-modal__footer__action">
                    <slot name="footer-left" v-bind="{ onNegativeClick: onCancel }">
                      <UiButton
                        v-if="footer?.cancel"
                        color="ghost"
                        size="md"
                        variant="outline"
                        class="ui-modal__footer__action--cancel"
                        :disabled="footer?.cancelDisabled"
                        @click="onCancel"
                      >
                        {{ footer?.cancel }}
                      </UiButton>
                    </slot>
                    <slot name="footer-right" v-bind="{ onPositiveClick: onOK }">
                      <UiButton
                        v-if="footer?.ok"
                        size="md"
                        class="ui-modal__footer__action--ok"
                        :disabled="footer?.okDisabled"
                        @click="onOK"
                      >
                        {{ footer?.ok }}
                      </UiButton>
                    </slot>
                  </div>
                </div>
              </slot>
            </footer>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue'
import UiAtomsIcon from '../../atoms/icon/index.vue'
import type { IModalProps, TModalFooterPosition } from './types.ts'
import { UiButton } from '@/components/atoms/button/index.ts'

const props = withDefaults(defineProps<IModalProps>(), {
  preventClose: false,
  size: 'md',
  overlay: true,
  ui: () => ({}),
  position: 'center',
  scrollMode: 'root',
  contentStyle: () => ({}),
  containerPosition: 'fixed',
})

const model = defineModel<boolean>({ required: true })
const emit = defineEmits(['ok', 'cancel'])

defineSlots<{
  default: () => any
  'header-title': () => any
  'header-extra': () => any
  'close-btn': (props: { onClick: () => void }) => any
  footer: (props: { onNegativeClick: () => void; onPositiveClick: () => void }) => any
  'footer-left': (props: { onNegativeClick: () => void }) => any
  'footer-right': (props: { onPositiveClick: () => void }) => any
}>()

// Computed class for modal position
const modalPositionClass = computed(() => {
  return `ui-modal__position--${props.position}`
})

const footerActionPosition = (position?: TModalFooterPosition): string => {
  switch (position) {
    case 'left':
      return 'flex-start'
    case 'center':
      return 'center'
    case 'right':
      return 'flex-end'
    default:
      return 'flex-end'
  }
}

const closeModal = () => {
  model.value = false
}

const onOK = () => {
  emit('ok')
}

const onCancel = () => {
  emit('cancel')
  closeModal()
}

// Handle "Escape" key to close modal
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && model.value) {
    if (!props.preventClose) {
      onCancel()
    }
  }
}

// Prevent scrolling when modal is open
watch(model, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

// Restore scrolling on unmount
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.ui-modal {
  --modal-content-gap: 1.25rem;
  --modal-content-padding: 1.25rem;
  --modal-footer-position: ;
  --modal-offset: 1rem;

  /* fine grain control of when overflow behave */
  --modal-min-height: 4rem;
  --modal-max-height: 100%;
  --modal-content-min-height: var(--modal-min-height, 40px);
  --modal-content-max-height: unset;
}

.ui-modal--scroll-modal,
.ui-modal--scroll-content {
  .ui-modal__content {
    min-height: var(--modal-min-height);
    max-height: var(--modal-max-height);
    overflow: auto;
  }
}

.ui-modal--scroll-content {
  .ui-modal__body {
    min-height: var(--modal-content-min-height);
    max-height: var(--modal-content-max-height);
    flex: 1;
    overflow: auto;
  }
}

.ui-modal {
  position: relative;
  z-index: 50;
}

.ui-modal__overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
}

.ui-modal__modal-container {
  inset: 0;
  display: flex;
  flex-direction: column;
  top: 0;
  left: 0;
  overflow: auto;
  /* this ensure that container will scroll if modal is overflowing and overflow is visible */
}

/*
this class is a "boundary" container meant as anchor for the actual content (target)
when parent container have positioning (align/justify) set within flex system,
to allow overflow to behave correctly for the target.
*/
.ui-modal__content-wrapper {
  min-height: 10px;
  /* css hack to allow flex positioned inner content to not being cut off bu boundary in Y axis */
  min-width: 10px;
  /* css hack to allow flex positioned inner content to not being cut off bu boundary in X axis due */
  width: 100%;
  padding: var(--modal-offset, 1rem);
  overflow: visible;
}

.ui-modal__content {
  background: #fff;
  padding: var(--modal-content-padding, 1.25rem);
  border-radius: 0.75rem;
  width: 100%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: var(--modal-content-gap, 1.25rem);
}

.ui-modal__body {
  @apply flex-1;
}

/* Modal size variations */
.ui-modal--xs .ui-modal__content-wrapper {
  max-width: 384px;
}

.ui-modal--sm .ui-modal__content-wrapper {
  max-width: 512px;
}

.ui-modal--md .ui-modal__content-wrapper {
  max-width: 768px;
}

.ui-modal--lg .ui-modal__content-wrapper {
  max-width: 1024px;
}

.ui-modal--full .ui-modal__content-wrapper,
.ui-modal--full .ui-modal__content {
  --modal-offset: 0;

  width: 100%;
  height: 100%;
  border-radius: 0;
}

/* Positioning styles */
.ui-modal__position--top-left {
  justify-content: flex-start;
  align-items: flex-start;
}

.ui-modal__position--top-center {
  justify-content: flex-start;
  align-items: center;
}

.ui-modal__position--top-right {
  justify-content: flex-start;
  align-items: flex-end;
}

.ui-modal__position--center-left {
  justify-content: center;
  align-items: flex-start;
}

.ui-modal__position--center {
  justify-content: center;
  align-items: center;
}

.ui-modal__position--center-right {
  justify-content: center;
  align-items: flex-end;
}

.ui-modal__position--bottom-left {
  justify-content: flex-end;
  align-items: flex-start;
}

.ui-modal__position--bottom-center {
  justify-content: flex-end;
  align-items: center;
}

.ui-modal__position--bottom-right {
  justify-content: flex-end;
  align-items: flex-end;
}

/* Header */
.ui-modal__header {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.ui-modal__title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ui-modal__title-text {
  font-size: var(--text-xl, 20px);
  font-weight: 500;
}

.ui-modal__close {
  cursor: pointer;
  color: #a9a9a9;
}

/* Footer */
.ui-modal__footer {
  display: flex;
  justify-content: var(--modal-footer-position, flex-end);
}

.ui-modal__footer__action {
  display: flex;
  gap: 0.75rem;
}

.ui-modal--divider {
  .ui-modal__header {
    padding-bottom: 0.625rem;
    border-bottom: 1px solid #eaeaea;
  }

  .ui-modal__footer {
    padding-top: 1rem;
    border-top: 1px solid #eaeaea;
  }
}

/* Transition for Overlay */
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

/* Transition for Modal Content */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
