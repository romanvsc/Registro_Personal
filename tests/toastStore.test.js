import assert from 'node:assert/strict'
import {
  error,
  normalizeToast,
  normalizeToastMessage,
  pushToast,
  toastStore,
} from '../src/shared/application/toastStore.js'

function clearToasts() {
  for (const toast of [...toastStore.toasts.value]) toastStore.dismissToast(toast.id)
}

clearToasts()

assert.equal(normalizeToastMessage(undefined), '')
assert.equal(normalizeToastMessage(null), '')
assert.equal(normalizeToastMessage({}), '')
assert.equal(normalizeToastMessage('[object Object]'), '')
assert.equal(normalizeToastMessage('  Registro creado.  '), 'Registro creado.')
assert.equal(normalizeToastMessage(new Error(' Error de red. ')), 'Error de red.')

assert.equal(pushToast({ type: 'success', message: '   ' }), null)
assert.equal(pushToast({ type: 'success', message: {} }), null)
assert.equal(toastStore.toasts.value.length, 0)

const fallbackId = error({})
assert.ok(fallbackId)
assert.equal(toastStore.toasts.value[0].message, 'Ocurrió un problema. Intentá nuevamente.')
assert.equal(toastStore.toasts.value[0].duration, 5000)
clearToasts()

const firstId = pushToast({ type: 'success', message: 'Registro creado.' })
const duplicateId = pushToast({ type: 'success', message: 'Registro creado.' })
assert.equal(duplicateId, firstId)
assert.equal(toastStore.toasts.value.length, 1)
assert.equal(toastStore.toasts.value[0].duration, 3000)

pushToast({ type: 'info', message: 'Uno' })
pushToast({ type: 'warning', message: 'Dos' })
pushToast({ type: 'error', message: 'Tres' })
assert.equal(toastStore.toasts.value.length, 3)
assert.deepEqual(toastStore.toasts.value.map(toast => toast.message), ['Uno', 'Dos', 'Tres'])

assert.deepEqual(normalizeToast({ type: 'error', message: undefined }), {
  type: 'error',
  message: 'Ocurrió un problema. Intentá nuevamente.',
  duration: 5000,
})

clearToasts()
console.log('ToastStore tests: OK')
