<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProfileAvatar from './ProfileAvatar.vue'

defineProps({ user: { type: Object, required: true } })
const emit = defineEmits(['edit-profile', 'logout'])

const open = ref(false)
const root = ref(null)
const trigger = ref(null)
const firstItem = ref(null)
const menuId = `account-menu-${useId()}`
const route = useRoute()

async function toggle() {
  open.value = !open.value
  if (open.value) {
    await nextTick()
    firstItem.value?.focus()
  }
}

function close({ restoreFocus = false } = {}) {
  if (!open.value) return
  open.value = false
  if (restoreFocus) nextTick(() => trigger.value?.focus())
}

function select(eventName) {
  close()
  emit(eventName)
}

function onDocumentPointerDown(event) {
  if (open.value && !root.value?.contains(event.target)) close()
}

function onKeydown(event) {
  if (event.key === 'Escape' && open.value) {
    event.preventDefault()
    close({ restoreFocus: true })
  }
}

function onFocusOut(event) {
  if (open.value && !root.value?.contains(event.relatedTarget)) close()
}

function onPanelKeydown(event) {
  if (event.key !== 'Tab' || !window.matchMedia('(max-width: 900px)').matches) return
  const items = [...root.value.querySelectorAll('.account-menu__popover button:not(:disabled)')]
  if (!items.length) return
  const first = items[0]
  const last = items.at(-1)
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerDown)
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown)
  document.removeEventListener('keydown', onKeydown)
})

watch(() => route.fullPath, () => close())
</script>

<template>
  <div ref="root" class="account-menu" @focusout="onFocusOut">
    <button ref="trigger" class="account-menu__trigger" type="button" :aria-controls="menuId" :aria-expanded="open" @click="toggle">
      <ProfileAvatar :user="user" size="sm" decorative />
      <span class="account-menu__text"><strong>{{ user.name }}</strong><small>Mi perfil</small></span>
      <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5.8 7.5 4.2 4.2 4.2-4.2" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"/></svg>
    </button>

    <Transition name="account-backdrop">
      <button v-if="open" class="account-menu__backdrop" type="button" tabindex="-1" aria-label="Cerrar opciones de cuenta" @click="close({ restoreFocus: true })"></button>
    </Transition>

    <Transition name="account-menu">
      <div v-if="open" :id="menuId" class="account-menu__popover" role="group" aria-label="Opciones de cuenta" @keydown="onPanelKeydown">
        <div class="account-menu__identity">
          <ProfileAvatar :user="user" size="md" decorative />
          <span class="account-menu__text"><strong>{{ user.name }}</strong><small>{{ user.email }}</small></span>
        </div>
        <button ref="firstItem" type="button" @click="select('edit-profile')">
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 14.8V16h1.2l8.9-8.9-1.2-1.2L4 14.8Zm11.1-9.7.8-.8a1.2 1.2 0 0 0-1.7-1.7l-.8.8 1.7 1.7Z" fill="currentColor"/></svg>
          Editar perfil
        </button>
        <button type="button" class="account-menu__logout" @click="select('logout')">
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M8.2 3.5H4.8A1.8 1.8 0 0 0 3 5.3v9.4a1.8 1.8 0 0 0 1.8 1.8h3.4M12.2 6.5 15.7 10l-3.5 3.5M7.2 10h8.2" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7"/></svg>
          Cerrar sesión
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.account-menu { position: relative; }
.account-menu__trigger { display: flex; align-items: center; gap: 10px; min-height: 48px; max-width: 260px; padding: 5px 8px 5px 6px; border: 1px solid transparent; border-radius: 15px; color: var(--cocoa-900); background: transparent; cursor: pointer; text-align: left; }
.account-menu__trigger:hover, .account-menu__trigger[aria-expanded="true"] { border-color: var(--sand-200); background: var(--cream-50); }
.account-menu__text { min-width: 0; flex: 1; }
.account-menu strong, .account-menu small { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.account-menu strong { font-size: 14px; }.account-menu small { margin-top: 2px; color: var(--cocoa-600); font-size: 11.5px; }
.account-menu__trigger > svg { width: 18px; height: 18px; flex: none; color: var(--cocoa-600); transition: transform .18s ease; }
.account-menu__trigger[aria-expanded="true"] > svg { transform: rotate(180deg); }
.account-menu__popover { position: absolute; right: 0; bottom: calc(100% + 10px); left: 0; z-index: 20; width: 100%; padding: 8px; border: 1px solid var(--sand-200); border-radius: 18px; background: var(--cream-50); box-shadow: var(--shadow-float); }
.account-menu__backdrop { display: none; }
.account-menu__identity { display: flex; align-items: center; gap: 11px; margin-bottom: 6px; padding: 10px; border-bottom: 1px solid var(--sand-100); }
.account-menu__popover > button { display: flex; align-items: center; gap: 10px; width: 100%; min-height: 44px; padding: 0 12px; border: 0; border-radius: 10px; color: var(--cocoa-800); background: transparent; font-weight: 700; cursor: pointer; }
.account-menu__popover > button:hover, .account-menu__popover > button:focus-visible { background: var(--dorito-50); color: var(--dorito-700); }
.account-menu__popover button svg { width: 20px; height: 20px; flex: none; }
.account-menu__popover > .account-menu__logout { color: var(--danger-600); }
.account-menu-enter-active, .account-menu-leave-active { transition: opacity .16s ease, transform .16s ease; transform-origin: bottom right; }
.account-menu-enter-from, .account-menu-leave-to { opacity: 0; transform: translateY(5px) scale(.98); }
.account-backdrop-enter-active, .account-backdrop-leave-active { transition: opacity .16s ease; }
.account-backdrop-enter-from, .account-backdrop-leave-to { opacity: 0; }
@media (max-width: 900px) {
  .account-menu__backdrop { position: fixed; inset: 0; z-index: 50; display: block; width: 100%; height: 100%; padding: 0; border: 0; background: rgba(36,29,25,.52); backdrop-filter: blur(2px); }
  .account-menu__popover { position: fixed; right: 12px; bottom: 12px; left: 12px; z-index: 51; width: auto; padding: 10px; border-radius: 22px; }
  .account-menu__popover > button { min-height: 50px; }
  .account-menu-enter-active, .account-menu-leave-active { transform-origin: bottom center; }
}
@media (prefers-reduced-motion: reduce) { .account-menu__trigger > svg, .account-menu-enter-active, .account-menu-leave-active, .account-backdrop-enter-active, .account-backdrop-leave-active { transition: none; } }
</style>
