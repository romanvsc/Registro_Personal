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
  border: 2px solid var(--neo-ink, #211914);
  border-left: 7px solid var(--felicia-500, #6e7533);
  border-radius: var(--neo-radius-sm, 7px);
  background: var(--neo-paper, #fffaf1);
  box-shadow: 5px 5px 0 var(--neo-ink, #211914);
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

.toast--error { border-left-color: var(--neo-coral, #e15a49); }
.toast--warning { border-left-color: var(--neo-orange, #ef6b1d); }
.toast--error .toast__icon { background: var(--danger-100, #ffd7d1); }
.toast--warning .toast__icon { background: var(--dorito-100, #ffd7ae); }

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
