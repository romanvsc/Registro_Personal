<script setup>
import { computed } from 'vue'
import { toastStore } from '../application/toastStore'
import AppIcon from './AppIcon.vue'

const visibleToasts = computed(() => toastStore.toasts.value.filter(toast =>
  typeof toast.message === 'string' && toast.message.trim() !== '',
))

function iconFor(type) {
  if (type === 'error') return 'error'
  if (type === 'warning') return 'advertencia'
  return 'exito'
}
</script>

<template>
  <div v-if="visibleToasts.length" class="toast-host" aria-live="polite" aria-atomic="false">
    <div
      v-for="toast in visibleToasts"
      :key="toast.id"
      class="toast"
      :class="`toast--${toast.type}`"
      :role="toast.type === 'error' ? 'alert' : 'status'"
    >
      <span class="toast__icon"><AppIcon :name="iconFor(toast.type)" /></span>
      <p>{{ toast.message }}</p>
      <button class="toast__close" type="button" aria-label="Cerrar aviso" @click="toastStore.dismissToast(toast.id)">×</button>
    </div>
  </div>
</template>

<style scoped>
.toast-host {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 70;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  width: min(360px, calc(100vw - 40px));
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 13px 14px;
  border: 1px solid var(--sand-300);
  border-radius: 14px;
  background: var(--cream-50, #fffdf7);
  box-shadow: 0 14px 40px rgba(40, 28, 20, 0.22);
  animation: toast-in 0.25s ease;
}

.toast__icon {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  flex: none;
  border-radius: 9px;
  background: var(--sage-100, #e3efe4);
}

.toast--error .toast__icon { background: var(--danger-100, #f6ddda); }
.toast--warning .toast__icon { background: #fbe9d3; }

.toast p {
  flex: 1;
  margin: 0;
  color: var(--cocoa-800);
  font-size: 14px;
  line-height: 1.4;
}

.toast__close {
  border: 0;
  background: transparent;
  color: var(--cocoa-500);
  font-size: 19px;
  line-height: 1;
  cursor: pointer;
}

@keyframes toast-in {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 560px) {
  .toast-host { top: 12px; right: 12px; width: calc(100vw - 24px); }
}

@media (prefers-reduced-motion: reduce) {
  .toast { animation: none; }
}
</style>
