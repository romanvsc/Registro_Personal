<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppIcon from '../../../shared/components/AppIcon.vue'
import { entryTypes, loadEntryTypes } from '../application/journalStore'

const route = useRoute()
const pickerOpen = ref(false)
const pickerDialog = ref(null)
const pickerClose = ref(null)
const activeTrigger = ref(null)
const loading = ref(false)
const loadError = ref('')

const isHomeActive = computed(() => route.path === '/')
const isHistoryActive = computed(() => route.path === '/historial')
const isJournalActive = computed(() => route.path.startsWith('/registrar') || route.path.startsWith('/configuracion/tipos'))
const isProfileActive = computed(() => route.path === '/perfil')

function iconFor(type) {
  if (type.icon) return type.icon
  if (type.slug === 'comida') return 'comidas'
  if (type.slug === 'entrenamiento') return 'entrenamientos'
  if (type.slug === 'animo') return 'estado-animo'
  return 'hoy'
}

function focusableElements() {
  return [...(pickerDialog.value?.querySelectorAll('a[href], button:not([disabled])') || [])]
    .filter(element => element.getClientRects().length > 0)
}

async function openPicker(event) {
  activeTrigger.value = event.currentTarget
  loadError.value = ''
  pickerOpen.value = true

  await nextTick()
  pickerClose.value?.focus()

  if (entryTypes.value.length || loading.value) return

  loading.value = true
  try {
    await loadEntryTypes()
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : 'No pudimos cargar tus tipos.'
  } finally {
    loading.value = false
  }
}

function closePicker({ restoreFocus = true } = {}) {
  const trigger = activeTrigger.value
  pickerOpen.value = false
  activeTrigger.value = null
  if (restoreFocus) nextTick(() => trigger?.focus())
}

function handlePickerKeydown(event) {
  if (event.key === 'Escape') {
    event.preventDefault()
    closePicker()
    return
  }

  if (event.key !== 'Tab') return
  const items = focusableElements()
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

watch(pickerOpen, open => {
  document.body.classList.toggle('mobile-picker-open', open)
})

watch(() => route.fullPath, () => {
  if (pickerOpen.value) closePicker({ restoreFocus: false })
})

onBeforeUnmount(() => {
  document.body.classList.remove('mobile-picker-open')
})
</script>

<template>
  <nav class="mobile-bottom-nav" aria-label="Navegación móvil">
    <RouterLink
      to="/"
      class="mobile-bottom-nav__item"
      :class="{ active: isHomeActive }"
      :aria-current="isHomeActive ? 'page' : undefined"
    >
      <AppIcon name="hoy" />
      <span>Hoy</span>
    </RouterLink>

    <RouterLink
      to="/historial"
      class="mobile-bottom-nav__item"
      :class="{ active: isHistoryActive }"
      :aria-current="isHistoryActive ? 'page' : undefined"
    >
      <AppIcon name="historial" />
      <span>Historial</span>
    </RouterLink>

    <button
      class="mobile-bottom-nav__item mobile-bottom-nav__item--primary"
      type="button"
      aria-haspopup="dialog"
      :aria-expanded="pickerOpen"
      aria-controls="mobile-record-picker"
      aria-label="Nuevo registro"
      @click="openPicker"
    >
      <span class="mobile-bottom-nav__primary-mark"><AppIcon name="nuevo-registro" /></span>
      <span>Nuevo</span>
    </button>

    <button
      class="mobile-bottom-nav__item"
      :class="{ active: isJournalActive }"
      type="button"
      aria-haspopup="dialog"
      :aria-expanded="pickerOpen"
      aria-controls="mobile-record-picker"
      @click="openPicker"
    >
      <AppIcon name="nuevo-registro" />
      <span>Registros</span>
    </button>

    <RouterLink
      to="/perfil"
      class="mobile-bottom-nav__item"
      :class="{ active: isProfileActive }"
      :aria-current="isProfileActive ? 'page' : undefined"
    >
      <span class="mobile-bottom-nav__account-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5.5 20c.7-3.5 2.9-5.2 6.5-5.2s5.8 1.7 6.5 5.2" />
        </svg>
      </span>
      <span>Cuenta</span>
    </RouterLink>
  </nav>

  <Transition name="mobile-record-picker">
    <div v-if="pickerOpen" class="mobile-record-picker" @keydown="handlePickerKeydown">
      <button class="mobile-record-picker__backdrop" type="button" tabindex="-1" aria-label="Cerrar selector de registro" @click="closePicker()"></button>
      <section
        id="mobile-record-picker"
        ref="pickerDialog"
        class="mobile-record-picker__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-record-picker-title"
        aria-describedby="mobile-record-picker-description"
      >
        <header class="mobile-record-picker__header">
          <div>
            <p class="eyebrow">SUMÁ UN MOMENTO</p>
            <h2 id="mobile-record-picker-title">¿Qué querés registrar?</h2>
            <p id="mobile-record-picker-description">Elegí un tipo para contar cómo viene tu día.</p>
          </div>
          <button ref="pickerClose" class="mobile-record-picker__close" type="button" aria-label="Cerrar selector" @click="closePicker()">×</button>
        </header>

        <div class="mobile-record-picker__options">
          <p v-if="loading" class="mobile-record-picker__status" role="status">Cargando tipos…</p>
          <p v-else-if="loadError" class="mobile-record-picker__status mobile-record-picker__status--error" role="alert">{{ loadError }}</p>
          <p v-else-if="!entryTypes.length" class="mobile-record-picker__status" role="status">Todavía no hay tipos activos.</p>

          <RouterLink
            v-for="type in entryTypes"
            :key="type.id || type.slug"
            class="mobile-record-picker__option"
            :to="`/registrar/${type.slug}`"
            @click="closePicker({ restoreFocus: false })"
          >
            <span class="mobile-record-picker__option-icon"><AppIcon :name="iconFor(type)" /></span>
            <span>{{ type.name }}</span>
            <span aria-hidden="true">→</span>
          </RouterLink>

          <RouterLink class="mobile-record-picker__manage" to="/configuracion/tipos" @click="closePicker({ restoreFocus: false })">
            Gestionar tipos
            <span aria-hidden="true">↗</span>
          </RouterLink>
        </div>
      </section>
    </div>
  </Transition>
</template>

<style scoped>
.mobile-bottom-nav,
.mobile-record-picker {
  display: none;
}

@media (max-width: 900px) {
  .mobile-bottom-nav {
    position: fixed;
    right: 0;
    bottom: max(10px, env(safe-area-inset-bottom));
    left: 50%;
    z-index: 30;
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    align-items: end;
    gap: 8px;
    width: min(calc(100% - 20px), 560px);
    min-height: 76px;
    padding: 8px max(8px, env(safe-area-inset-right)) calc(8px + env(safe-area-inset-bottom)) max(8px, env(safe-area-inset-left));
    border: 3px solid var(--neo-ink);
    border-radius: 16px;
    background: var(--neo-paper);
    box-shadow: 5px 5px 0 var(--neo-ink);
    transform: translateX(-50%);
  }

  .mobile-bottom-nav__item {
    display: grid;
    place-items: center;
    align-content: center;
    gap: 3px;
    min-width: 0;
    min-height: 52px;
    padding: 5px 3px;
    border: 2px solid transparent;
    border-radius: 8px;
    color: var(--neo-ink);
    background: transparent;
    font-size: 12px;
    font-weight: 800;
    line-height: 1.1;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    touch-action: manipulation;
    transition: transform .16s ease, box-shadow .16s ease, background-color .16s ease, border-color .16s ease;
  }

  .mobile-bottom-nav__item > .app-icon {
    width: 29px;
    height: 29px;
  }

  .mobile-bottom-nav__item:hover,
  .mobile-bottom-nav__item:focus-visible,
  .mobile-bottom-nav__item.active {
    border-color: var(--neo-ink);
    background: var(--neo-orange);
    box-shadow: 2px 2px 0 var(--neo-ink);
    transform: translateY(-2px);
  }

  .mobile-bottom-nav__item:focus-visible {
    outline: 3px solid var(--neo-orange-dark);
    outline-offset: 2px;
  }

  .mobile-bottom-nav__item:active {
    box-shadow: 1px 1px 0 var(--neo-ink);
    transform: translate(2px, 2px);
  }

  .mobile-bottom-nav__item--primary {
    min-height: 76px;
    margin-top: -28px;
    border: 0;
    box-shadow: none;
    background: transparent;
    transform: none;
  }

  .mobile-bottom-nav__item--primary:hover,
  .mobile-bottom-nav__item--primary:focus-visible,
  .mobile-bottom-nav__item--primary.active {
    border-color: transparent;
    box-shadow: none;
    background: transparent;
    transform: none;
  }

  .mobile-bottom-nav__primary-mark {
    display: grid;
    place-items: center;
    width: 58px;
    height: 58px;
    border: 3px solid var(--neo-ink);
    border-radius: 50%;
    background: var(--neo-orange);
    box-shadow: 4px 4px 0 var(--neo-ink);
    transform: translateY(-4px);
    transition: transform .16s ease, box-shadow .16s ease, background-color .16s ease;
  }

  .mobile-bottom-nav__primary-mark .app-icon {
    width: 34px;
    height: 34px;
  }

  .mobile-bottom-nav__item--primary:hover .mobile-bottom-nav__primary-mark,
  .mobile-bottom-nav__item--primary:focus-visible .mobile-bottom-nav__primary-mark {
    background: var(--neo-butter);
    box-shadow: 5px 5px 0 var(--neo-ink);
    transform: translate(-2px, -6px);
  }

  .mobile-bottom-nav__item--primary:active .mobile-bottom-nav__primary-mark {
    box-shadow: 1px 1px 0 var(--neo-ink);
    transform: translate(2px, 0);
  }

  .mobile-bottom-nav__account-icon {
    display: grid;
    place-items: center;
    width: 29px;
    height: 29px;
  }

  .mobile-bottom-nav__account-icon svg {
    width: 25px;
    height: 25px;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.8;
  }

  .mobile-record-picker {
    position: fixed;
    inset: 0;
    z-index: 50;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: 12px 10px calc(96px + env(safe-area-inset-bottom));
  }

  .mobile-record-picker__backdrop {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
    background: rgba(33, 25, 20, .52);
    cursor: pointer;
  }

  .mobile-record-picker__panel {
    position: relative;
    z-index: 1;
    width: min(100%, 560px);
    max-height: min(72vh, 620px);
    overflow-y: auto;
    padding: 18px;
    border: 3px solid var(--neo-ink);
    border-radius: 14px;
    background: var(--neo-paper);
    box-shadow: 6px 6px 0 var(--neo-ink);
  }

  .mobile-record-picker__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    padding-bottom: 14px;
    border-bottom: 3px solid var(--neo-ink);
  }

  .mobile-record-picker__header h2 {
    margin: 8px 0 5px;
    color: var(--neo-ink);
    font: 800 22px/1.1 var(--font-display);
  }

  .mobile-record-picker__header > div > p:last-child {
    margin: 0;
    color: var(--cocoa-700);
    font-size: 13px;
    line-height: 1.4;
  }

  .mobile-record-picker__close {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    flex: none;
    border: 2px solid var(--neo-ink);
    border-radius: var(--neo-radius-sm);
    color: var(--neo-ink);
    background: var(--neo-butter);
    box-shadow: 2px 2px 0 var(--neo-ink);
    font-size: 26px;
    line-height: 1;
    cursor: pointer;
  }

  .mobile-record-picker__close:hover,
  .mobile-record-picker__close:focus-visible {
    background: var(--neo-orange);
  }

  .mobile-record-picker__close:focus-visible {
    outline: 3px solid var(--neo-orange-dark);
    outline-offset: 2px;
  }

  .mobile-record-picker__options {
    display: grid;
    gap: 10px;
    padding-top: 14px;
  }

  .mobile-record-picker__option,
  .mobile-record-picker__manage {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 52px;
    padding: 7px 10px;
    border: 2px solid var(--neo-ink);
    border-radius: 8px;
    color: var(--neo-ink);
    background: var(--neo-paper);
    box-shadow: 3px 3px 0 var(--neo-ink);
    font-size: 14px;
    font-weight: 800;
    text-decoration: none;
  }

  .mobile-record-picker__option:hover,
  .mobile-record-picker__option:focus-visible,
  .mobile-record-picker__manage:hover,
  .mobile-record-picker__manage:focus-visible {
    background: var(--neo-butter);
    transform: translate(-2px, -2px);
  }

  .mobile-record-picker__option:focus-visible,
  .mobile-record-picker__manage:focus-visible {
    outline: 3px solid var(--neo-orange);
    outline-offset: 2px;
  }

  .mobile-record-picker__option > span:nth-child(2) {
    min-width: 0;
    flex: 1;
  }

  .mobile-record-picker__option > span:last-child,
  .mobile-record-picker__manage > span {
    margin-left: auto;
    font-size: 20px;
  }

  .mobile-record-picker__option-icon {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    flex: none;
    border: 2px solid var(--neo-ink);
    border-radius: 50%;
    background: var(--neo-lilac);
  }

  .mobile-record-picker__option-icon .app-icon {
    width: 29px;
    height: 29px;
  }

  .mobile-record-picker__manage {
    margin-top: 4px;
    border-style: dashed;
    background: var(--neo-sage);
  }

  .mobile-record-picker__status {
    margin: 0;
    padding: 14px;
    border: 2px dashed var(--neo-ink);
    color: var(--cocoa-700);
    background: var(--neo-butter);
    font-size: 13px;
    font-weight: 700;
    line-height: 1.4;
  }

  .mobile-record-picker__status--error {
    border-color: var(--danger-700);
    color: var(--danger-700);
    background: var(--danger-50);
  }

  .mobile-record-picker-enter-active,
  .mobile-record-picker-leave-active {
    transition: opacity .18s ease;
  }

  .mobile-record-picker-enter-active .mobile-record-picker__panel,
  .mobile-record-picker-leave-active .mobile-record-picker__panel {
    transition: transform .18s ease;
  }

  .mobile-record-picker-enter-from,
  .mobile-record-picker-leave-to {
    opacity: 0;
  }

  .mobile-record-picker-enter-from .mobile-record-picker__panel,
  .mobile-record-picker-leave-to .mobile-record-picker__panel {
    transform: translateY(18px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .mobile-bottom-nav__item,
  .mobile-bottom-nav__primary-mark,
  .mobile-record-picker-enter-active,
  .mobile-record-picker-leave-active,
  .mobile-record-picker-enter-active .mobile-record-picker__panel,
  .mobile-record-picker-leave-active .mobile-record-picker__panel {
    transition: none;
  }

  .mobile-bottom-nav__item:hover,
  .mobile-bottom-nav__item:focus-visible,
  .mobile-bottom-nav__item:active,
  .mobile-bottom-nav__item--primary:hover .mobile-bottom-nav__primary-mark,
  .mobile-bottom-nav__item--primary:focus-visible .mobile-bottom-nav__primary-mark,
  .mobile-bottom-nav__item--primary:active .mobile-bottom-nav__primary-mark,
  .mobile-record-picker__option:hover,
  .mobile-record-picker__option:focus-visible,
  .mobile-record-picker__manage:hover,
  .mobile-record-picker__manage:focus-visible {
    transform: none;
  }
}
</style>
