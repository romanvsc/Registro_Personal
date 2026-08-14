<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppIcon from '../../../shared/components/AppIcon.vue'
import { entryTypes, loadEntryTypes } from '../application/journalStore'

defineEmits(['navigate'])

const route = useRoute()
const trigger = ref(null)
const menu = ref(null)
const open = ref(route.path.startsWith('/registrar') || route.path.startsWith('/configuracion/tipos'))
const loading = ref(false)
const loadError = ref('')

const isJournalRoute = computed(() => route.path.startsWith('/registrar') || route.path.startsWith('/configuracion/tipos'))

function iconFor(type) {
  if (type.icon) return type.icon
  if (type.slug === 'comida') return 'comidas'
  if (type.slug === 'entrenamiento') return 'entrenamientos'
  if (type.slug === 'animo') return 'estado-animo'
  return 'hoy'
}

function menuItems() {
  return [...(menu.value?.querySelectorAll('a[href]') || [])]
}

async function toggleMenu({ focusFirst = false } = {}) {
  open.value = !open.value
  if (open.value && focusFirst) {
    await nextTick()
    menuItems()[0]?.focus()
  }
}

function handleTriggerKeydown(event) {
  if (event.key !== 'ArrowDown') return
  event.preventDefault()
  if (!open.value) toggleMenu({ focusFirst: true })
  else menuItems()[0]?.focus()
}

function handleMenuKeydown(event) {
  const items = menuItems()
  const current = items.indexOf(document.activeElement)

  if (event.key === 'Escape') {
    event.preventDefault()
    open.value = false
    nextTick(() => trigger.value?.focus())
    return
  }

  if (!items.length) return

  let next = current
  if (event.key === 'ArrowDown') next = (current + 1) % items.length
  else if (event.key === 'ArrowUp') next = (current - 1 + items.length) % items.length
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = items.length - 1
  else return

  event.preventDefault()
  items[next]?.focus()
}

onMounted(async () => {
  if (entryTypes.value.length) return
  loading.value = true
  try {
    await loadEntryTypes()
  } catch {
    loadError.value = 'No pudimos cargar tus tipos.'
  } finally {
    loading.value = false
  }
})

watch(() => route.path, (path) => {
  if (path.startsWith('/registrar') || path.startsWith('/configuracion/tipos')) open.value = true
})
</script>

<template>
  <div class="journal-navigation" :class="{ 'is-active': isJournalRoute }">
    <button
      ref="trigger"
      class="journal-navigation__trigger"
      type="button"
      aria-controls="journal-navigation-menu"
      :aria-expanded="open"
      @click="toggleMenu()"
      @keydown="handleTriggerKeydown"
    >
      <span class="journal-navigation__icon" aria-hidden="true"><AppIcon name="nuevo-registro" /></span>
      <span>Registros</span>
      <span class="journal-navigation__chevron" aria-hidden="true">›</span>
    </button>

    <Transition name="journal-disclosure">
      <div
        v-show="open"
        id="journal-navigation-menu"
        ref="menu"
        class="journal-navigation__menu"
        @keydown="handleMenuKeydown"
      >
        <p v-if="loading" class="journal-navigation__status" role="status">Cargando tipos…</p>
        <p v-else-if="loadError" class="journal-navigation__status journal-navigation__status--error" role="status">{{ loadError }}</p>
        <RouterLink
          v-for="type in entryTypes"
          :key="type.id || type.slug"
          :to="`/registrar/${type.slug}`"
          @click="$emit('navigate')"
        >
          <span aria-hidden="true"><AppIcon :name="iconFor(type)" /></span>
          {{ type.name }}
        </RouterLink>
        <RouterLink class="journal-navigation__manage" to="/configuracion/tipos" @click="$emit('navigate')">
          <span aria-hidden="true"><AppIcon name="nuevo-registro" /></span>
          Gestionar tipos
        </RouterLink>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.journal-navigation {
  display: grid;
  gap: 4px;
}

.journal-navigation__trigger {
  position: relative;
  display: flex;
  align-items: center;
  gap: 13px;
  width: 100%;
  min-height: 52px;
  padding: 8px 12px 8px 14px;
  border: 0;
  border-radius: 12px;
  color: var(--cocoa-600);
  background: transparent;
  font-family: inherit;
  font-size: 16px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
}

.journal-navigation__trigger:hover,
.journal-navigation__trigger:focus-visible,
.is-active .journal-navigation__trigger {
  color: var(--dorito-600);
  background: var(--dorito-50);
}

.journal-navigation__trigger:focus-visible {
  outline: 3px solid rgba(217, 120, 34, .35);
  outline-offset: 2px;
}

.is-active .journal-navigation__trigger::before {
  position: absolute;
  inset: 10px auto 10px 0;
  width: 3px;
  border-radius: 0 3px 3px 0;
  background: var(--dorito-500);
  content: '';
}

.journal-navigation__icon {
  display: grid;
  flex: 0 0 36px;
  place-items: center;
  width: 36px;
  height: 36px;
}

.journal-navigation__icon .app-icon {
  width: 34px;
  height: 34px;
}

.journal-navigation__chevron {
  margin-left: auto;
  font-size: 25px;
  line-height: 1;
  transform: rotate(0deg);
  transition: transform .2s ease;
}

[aria-expanded="true"] .journal-navigation__chevron {
  transform: rotate(90deg);
}

.journal-navigation__menu {
  display: grid;
  gap: 3px;
  max-height: min(42vh, 360px);
  overflow-y: auto;
  margin-left: 25px;
  padding: 3px 0 5px 11px;
  border-left: 1px solid var(--sand-200);
  scrollbar-width: thin;
}

.journal-navigation__menu a {
  min-height: 44px;
  padding: 7px 10px;
  border-radius: 10px;
  font-size: 14px;
}

.journal-navigation__menu a span {
  flex-basis: 30px;
  width: 30px;
}

.journal-navigation__menu a span .app-icon {
  width: 29px;
  height: 29px;
}

.journal-navigation__menu a:focus-visible {
  outline: 3px solid rgba(217, 120, 34, .35);
  outline-offset: 1px;
}

.journal-navigation__manage {
  margin-top: 3px;
  border-top: 1px solid var(--sand-200);
}

.journal-navigation__status {
  margin: 2px 8px;
  color: var(--cocoa-700);
  font-size: 13px;
  line-height: 1.4;
}

.journal-navigation__status--error {
  color: var(--danger-600);
}

.journal-disclosure-enter-active,
.journal-disclosure-leave-active {
  overflow: hidden;
  transition: opacity .18s ease, transform .18s ease;
}

.journal-disclosure-enter-from,
.journal-disclosure-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (prefers-reduced-motion: reduce) {
  .journal-navigation__chevron,
  .journal-disclosure-enter-active,
  .journal-disclosure-leave-active {
    transition: none;
  }
}
</style>
