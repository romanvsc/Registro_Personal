import { readonly, ref } from 'vue'

const DEFAULT_ERROR_MESSAGE = 'Ocurrió un problema. Intentá nuevamente.'
const MAX_VISIBLE = 3
const VALID_TYPES = new Set(['success', 'error', 'warning', 'info'])
const INVALID_MESSAGES = new Set(['undefined', 'null', '[object object]'])
const DURATION_BY_TYPE = Object.freeze({
  success: 3000,
  error: 5000,
  warning: 4000,
  info: 4000,
})

const toastState = ref([])
const timers = new Map()
let nextId = 1

function normalizeType(type) {
  return VALID_TYPES.has(type) ? type : 'info'
}

export function normalizeToastMessage(value) {
  let candidate = value

  if (value instanceof Error) candidate = value.message
  else if (value && typeof value === 'object' && 'message' in value) candidate = value.message

  if (!['string', 'number', 'bigint'].includes(typeof candidate)) return ''

  const message = String(candidate).trim()
  return message && !INVALID_MESSAGES.has(message.toLowerCase()) ? message : ''
}

export function normalizeToast(input, legacyType) {
  const payload = input && typeof input === 'object' && !(input instanceof Error)
    ? input
    : { message: input, type: legacyType }
  const type = normalizeType(payload.type ?? legacyType ?? 'info')
  const normalizedMessage = normalizeToastMessage(payload.message)
  const message = normalizedMessage || (type === 'error' ? DEFAULT_ERROR_MESSAGE : '')

  if (!message) return null

  return {
    type,
    message,
    duration: DURATION_BY_TYPE[type],
  }
}

function clearToastTimer(id) {
  const timer = timers.get(id)
  if (timer) clearTimeout(timer)
  timers.delete(id)
}

export function dismissToast(id) {
  clearToastTimer(id)
  toastState.value = toastState.value.filter(toast => toast.id !== id)
}

export function pushToast(input, legacyType) {
  const normalized = normalizeToast(input, legacyType)
  if (!normalized) return null

  const duplicate = toastState.value.find(toast =>
    toast.type === normalized.type && toast.message === normalized.message,
  )
  if (duplicate) return duplicate.id

  while (toastState.value.length >= MAX_VISIBLE) {
    dismissToast(toastState.value[0].id)
  }

  const toast = { id: nextId++, ...normalized }
  toastState.value.push(toast)
  timers.set(toast.id, setTimeout(() => dismissToast(toast.id), toast.duration))
  return toast.id
}

export const success = message => pushToast({ type: 'success', message })
export const error = message => pushToast({ type: 'error', message })

export const toastStore = Object.freeze({
  toasts: readonly(toastState),
  pushToast,
  dismissToast,
  success,
  error,
})
