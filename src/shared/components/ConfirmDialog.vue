<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  message: { type: String, default: '' },
  cancelLabel: { type: String, default: 'Cancelar' },
  confirmLabel: { type: String, default: 'Confirmar' },
  busy: { type: Boolean, default: false },
})
const emit = defineEmits(['confirm', 'cancel'])
const cancelButton = ref(null)
const dialogRef = ref(null)
let previouslyFocused = null

function handleKeydown(event) {
  if (event.key === 'Escape' && !props.busy) {
    event.preventDefault()
    emit('cancel')
    return
  }
  if (event.key !== 'Tab') return

  const focusable = [...dialogRef.value?.querySelectorAll(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
  ) || []]
  if (!focusable.length) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

function cancel() {
  if (!props.busy) emit('cancel')
}

onMounted(() => {
  previouslyFocused = document.activeElement
  cancelButton.value?.focus()
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  if (previouslyFocused && typeof previouslyFocused.focus === 'function') previouslyFocused.focus()
})
</script>

<template>
  <div class="confirm-dialog__backdrop" role="presentation" @click.self="cancel">
    <div ref="dialogRef" class="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-dialog-title" :aria-describedby="message ? 'confirm-dialog-message' : undefined">
      <h2 id="confirm-dialog-title">{{ title }}</h2>
      <p v-if="message" id="confirm-dialog-message">{{ message }}</p>
      <div class="confirm-dialog__actions">
        <button ref="cancelButton" type="button" class="secondary-button" :disabled="busy" @click="emit('cancel')">{{ cancelLabel }}</button>
        <button type="button" class="danger-button" :disabled="busy" @click="emit('confirm')">
          {{ busy ? 'Eliminando…' : confirmLabel }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.confirm-dialog__backdrop {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(40, 28, 20, 0.45);
  backdrop-filter: blur(2px);
}

.confirm-dialog {
  width: min(420px, 100%);
  padding: 26px 24px 22px;
  border: 3px solid var(--neo-ink, #211914);
  border-radius: var(--neo-radius, 10px);
  background: var(--neo-paper, #fffaf1);
  box-shadow: 8px 8px 0 var(--neo-ink, #211914);
}

.confirm-dialog h2 {
  margin: 0 0 8px;
  font-size: 19px;
  color: var(--cocoa-900);
}

.confirm-dialog p {
  margin: 0 0 22px;
  color: var(--cocoa-700);
  font-size: 14.5px;
  line-height: 1.5;
}

.confirm-dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.confirm-dialog__actions .secondary-button,
.confirm-dialog__actions .danger-button {
  min-height: 46px;
}

.confirm-dialog__actions :disabled {
  opacity: 0.6;
  cursor: default;
  transform: none;
}
</style>
