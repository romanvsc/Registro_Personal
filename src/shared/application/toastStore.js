import { ref } from 'vue'

const toasts = ref([])
let nextId = 1

export function pushToast(message, type = 'success') {
  const id = nextId++
  toasts.value.push({ id, message, type })
  setTimeout(() => dismissToast(id), 4000)
}

export function dismissToast(id) {
  toasts.value = toasts.value.filter(toast => toast.id !== id)
}

export const toastStore = { toasts, pushToast, dismissToast }
