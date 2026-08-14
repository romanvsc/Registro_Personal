<script setup>
defineProps({
  title: { type: String, required: true },
  message: { type: String, default: '' },
  confirmLabel: { type: String, default: 'Confirmar' },
  busy: { type: Boolean, default: false },
})
defineEmits(['confirm', 'cancel'])
</script>

<template>
  <div class="confirm-dialog__backdrop" role="presentation" @click.self="$emit('cancel')">
    <div class="confirm-dialog" role="alertdialog" aria-modal="true" :aria-label="title">
      <h2>{{ title }}</h2>
      <p v-if="message">{{ message }}</p>
      <div class="confirm-dialog__actions">
        <button type="button" class="secondary-button" :disabled="busy" @click="$emit('cancel')">Cancelar</button>
        <button type="button" class="danger-button" :disabled="busy" @click="$emit('confirm')">
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
  border-radius: 18px;
  background: var(--cream-50, #fffdf7);
  box-shadow: 0 18px 50px rgba(40, 28, 20, 0.28);
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

.confirm-dialog__actions :disabled {
  opacity: 0.6;
  cursor: default;
  transform: none;
}
</style>