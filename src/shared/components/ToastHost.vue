<script setup>
import { toastStore } from '../application/toastStore'
import AppIcon from './AppIcon.vue'
</script>

<template>
  <div class="toast-host" aria-live="polite" aria-atomic="false">
    <div v-for="toast in toastStore.toasts" :key="toast.id" class="toast" :class="`toast--${toast.type}`" role="status">
      <span class="toast__icon"><AppIcon :name="toast.type === 'error' ? 'error' : 'exito'" /></span>
      <p>{{ toast.message }}</p>
      <button type="button" aria-label="Cerrar aviso" @click="toastStore.dismissToast(toast.id)">×</button>
    </div>
  </div>
</template>

<style scoped>
.toast-host {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 70;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: min(360px, calc(100vw - 40px));
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
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

.toast--error .toast__icon {
  background: var(--danger-100, #f6ddda);
}

.toast p {
  flex: 1;
  margin: 0;
  color: var(--cocoa-800);
  font-size: 14px;
  line-height: 1.4;
}

.toast button {
  border: 0;
  background: transparent;
  color: var(--cocoa-500);
  font-size: 19px;
  line-height: 1;
  cursor: pointer;
}

@keyframes toast-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
