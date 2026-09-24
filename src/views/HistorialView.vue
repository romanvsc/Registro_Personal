<script setup>
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  deleteInsightEntry,
  hasMoreInsights,
  insightEntries,
  insightEntryTypes,
  insightsError,
  insightsLoading,
  insightsPage,
  insightsTotal,
  insightsPages,
  loadMoreInsights,
  loadPersonalInsights,
} from '../contexts/personal-insights/application/insightsStore'
import CatScore from '../components/CatScore.vue'
import AppIcon from '../shared/components/AppIcon.vue'
import ConfirmDialog from '../shared/components/ConfirmDialog.vue'
import { pushToast } from '../shared/application/toastStore'
import { Flip, MOTION, createMotionContext, gsap, prefersReducedMotion } from '../shared/motion/gsap'

const base = import.meta.env.BASE_URL
const route = useRoute()
const router = useRouter()

const form = reactive({
  type: 'todos',
  from: '',
  to: '',
  minScore: '',
  maxScore: '',
  search: '',
})

const deleting = ref(null)
const deletingBusy = ref(false)
const filtersExpanded = ref(false)
const filterPanelVisible = ref(false)
const historyRoot = ref(null)
const filterBar = ref(null)
let historyMotionContext = null

const DELETE_ERROR_FALLBACK = 'Ocurrió un problema. Intentá nuevamente.'
const INVALID_ERROR_MESSAGES = new Set(['undefined', 'null', '[object object]'])

const firstEntryType = computed(() => insightEntryTypes.value[0]?.slug || '')

function entryRail(entry) {
  const type = String(entry?.type || entry?.typeName || '').toLowerCase()
  if (type.includes('entren') || type.includes('ejercicio')) return 'var(--neo-lavender-strong, #8f7ac4)'
  if (type.includes('ánimo') || type.includes('animo') || type.includes('mood')) return 'var(--neo-sage-strong, #5b8c72)'
  if (type.includes('comida') || type.includes('aliment')) return 'var(--neo-orange-strong, #c45f16)'
  return 'var(--neo-butter-strong, #b47c18)'
}

const hasResults = computed(() => insightEntries.value.length > 0)
const hasActiveFilters = computed(() => form.type !== 'todos' || form.from || form.to || form.minScore !== '' || form.maxScore !== '' || form.search.trim() !== '')
const activeFilterCount = computed(() => [
  form.type !== 'todos',
  form.from,
  form.to,
  form.minScore !== '',
  form.maxScore !== '',
  form.search.trim(),
].filter(Boolean).length)

function ensureHistoryMotionContext() {
  if (!historyMotionContext && historyRoot.value) {
    historyMotionContext = createMotionContext(historyRoot.value, () => {})
  }
  return historyMotionContext
}

function syncHistoryFlipIds() {
  const cards = [...(historyRoot.value?.querySelectorAll('.history-card') || [])]
  cards.forEach((card, index) => {
    const entry = insightEntries.value[index]
    card.dataset.flipId = entry ? `history-entry-${entry.id}` : `history-entry-${index}`
  })
}

function captureHistoryState() {
  if (prefersReducedMotion()) return null
  syncHistoryFlipIds()
  const cards = [...(historyRoot.value?.querySelectorAll('[data-flip-id]') || [])]
  return cards.length ? Flip.getState(cards) : null
}

async function animateHistoryChange(previousState) {
  await nextTick()
  syncHistoryFlipIds()
  if (prefersReducedMotion()) return

  const context = ensureHistoryMotionContext()
  if (!context) return

  const cards = [...(historyRoot.value?.querySelectorAll('[data-flip-id]') || [])]
  gsap.killTweensOf(cards)
  if (previousState && cards.length) {
    context.add(() => Flip.from(previousState, {
      duration: MOTION.duration.flip,
      ease: MOTION.ease.standard,
      stagger: MOTION.stagger,
      nested: true,
      absolute: false,
      overwrite: 'auto',
    }))
  } else if (cards.length) {
    const shadowTargets = cards.filter((card) => {
      const shadow = window.getComputedStyle(card).boxShadow
      return shadow && shadow !== 'none'
    })
    const finalShadows = new Map(shadowTargets.map((card) => [card, window.getComputedStyle(card).boxShadow]))
    if (shadowTargets.length) gsap.set(shadowTargets, { boxShadow: '2px 2px 0 rgba(33, 25, 20, .72)' })
    context.add(() => gsap.from(cards, {
      opacity: 0,
      y: MOTION.offset.reveal,
      rotation: (index) => (index % 2 ? -MOTION.rotation.reveal : MOTION.rotation.reveal),
      scale: MOTION.scale.reveal,
      transformOrigin: '50% 0%',
      duration: MOTION.duration.reveal,
      ease: MOTION.ease.standard,
      stagger: MOTION.stagger,
      overwrite: 'auto',
      onComplete: () => gsap.set(cards, { clearProps: 'transform,opacity' }),
    }))
    if (shadowTargets.length) {
      context.add(() => gsap.to(shadowTargets, {
        boxShadow: (_, target) => finalShadows.get(target),
        duration: MOTION.duration.reveal,
        ease: MOTION.ease.standard,
        stagger: MOTION.stagger,
        overwrite: 'auto',
        onComplete: () => gsap.set(shadowTargets, { clearProps: 'boxShadow' }),
      }))
    }
  }
}

function animateFilterPanel(open) {
  const element = filterBar.value || historyRoot.value?.querySelector('.filter-bar')
  if (!element || typeof window === 'undefined') return
  filterBar.value = element

  const isMobile = window.matchMedia?.('(max-width: 720px)').matches
  if (!isMobile) {
    filterPanelVisible.value = open
    return
  }

  const context = ensureHistoryMotionContext()
  if (!context) {
    filterPanelVisible.value = open
    return
  }

  gsap.killTweensOf(element)
  if (open) {
    filterPanelVisible.value = true
    nextTick(() => {
      if (prefersReducedMotion()) {
        gsap.set(element, { height: 'auto', opacity: 1, paddingTop: 14, paddingBottom: 14 })
        return
      }
      const targetHeight = element.scrollHeight
      context.add(() => gsap.fromTo(element,
        { height: 0, opacity: 0, paddingTop: 0, paddingBottom: 0 },
        {
          height: targetHeight,
          opacity: 1,
          paddingTop: 14,
          paddingBottom: 14,
          duration: MOTION.duration.filterOpen,
          ease: MOTION.ease.standard,
          onComplete: () => gsap.set(element, { height: 'auto' }),
        },
      ))
    })
    return
  }

  if (prefersReducedMotion()) {
    filterPanelVisible.value = false
    gsap.set(element, { clearProps: 'height,opacity,paddingTop,paddingBottom' })
    return
  }

  const currentHeight = element.offsetHeight
  context.add(() => gsap.fromTo(element,
    { height: currentHeight, opacity: 1 },
    {
      height: 0,
      opacity: 0,
      paddingTop: 0,
      paddingBottom: 0,
      duration: MOTION.duration.filterClose,
      ease: MOTION.ease.leave,
      onComplete: () => {
        filterPanelVisible.value = false
        gsap.set(element, { clearProps: 'height,opacity,paddingTop,paddingBottom' })
      },
    },
  ))
}

watch(filtersExpanded, animateFilterPanel)

function filtersFromForm() {
  const filters = {}
  if (form.type !== 'todos') filters.type = form.type
  if (form.from) filters.from = form.from
  if (form.to) filters.to = form.to
  if (form.minScore !== '') filters.minScore = form.minScore
  if (form.maxScore !== '') filters.maxScore = form.maxScore
  if (form.search.trim()) filters.search = form.search.trim()
  return filters
}

function syncFormFromQuery() {
  const q = route.query
  form.type = typeof q.type === 'string' ? q.type : 'todos'
  form.from = typeof q.from === 'string' ? q.from : ''
  form.to = typeof q.to === 'string' ? q.to : ''
  form.minScore = typeof q.minScore === 'string' ? q.minScore : ''
  form.maxScore = typeof q.maxScore === 'string' ? q.maxScore : ''
  form.search = typeof q.search === 'string' ? q.search : ''
}

function currentPageFromQuery() {
  const raw = Number(route.query.page)
  return Number.isInteger(raw) && raw >= 1 ? raw : 1
}

async function load(page = 1) {
  const previousState = captureHistoryState()
  await loadPersonalInsights(page, filtersFromForm())
  await animateHistoryChange(previousState)
}

async function applyFilters() {
  const q = { ...filtersFromForm() }
  if (q.page) delete q.page
  await router.push({ path: '/historial', query: q })
  await load(1)
  filtersExpanded.value = false
}

async function clearFilters() {
  form.type = 'todos'
  form.from = ''
  form.to = ''
  form.minScore = ''
  form.maxScore = ''
  form.search = ''
  await router.push({ path: '/historial', query: {} })
  await load(1)
  filtersExpanded.value = false
}

async function confirmDelete() {
  if (deleting.value === null) return
  const previousState = captureHistoryState()
  deletingBusy.value = true
  try {
    await deleteInsightEntry(deleting.value)
    await animateHistoryChange(previousState)
    deleting.value = null
    pushToast({
      type: 'success',
      message: 'Registro eliminado correctamente.',
      duration: 3000,
    })
  } catch (error) {
    const rawMessage = error instanceof Error ? error.message : ''
    const candidate = typeof rawMessage === 'string' ? rawMessage.trim() : ''
    const message = candidate && !INVALID_ERROR_MESSAGES.has(candidate.toLowerCase())
      ? candidate
      : DELETE_ERROR_FALLBACK

    pushToast({ type: 'error', message, duration: 5000 })
  } finally {
    deletingBusy.value = false
  }
}

function cancelDelete() {
  deleting.value = null
  deletingBusy.value = false
}

async function loadMore() {
  const previousState = captureHistoryState()
  await loadMoreInsights()
  await animateHistoryChange(previousState)
  await router.replace({ query: { ...route.query, page: insightsPage.value } })
}

function onPopState() {
  syncFormFromQuery()
  filtersExpanded.value = hasActiveFilters.value
  load(currentPageFromQuery())
}

onMounted(async () => {
  ensureHistoryMotionContext()
  filterBar.value = historyRoot.value?.querySelector('.filter-bar') || null
  syncFormFromQuery()
  filtersExpanded.value = hasActiveFilters.value
  await load(currentPageFromQuery())
  filterBar.value = historyRoot.value?.querySelector('.filter-bar') || null
  if (filtersExpanded.value) animateFilterPanel(true)
  window.addEventListener('popstate', onPopState)
})

onUnmounted(() => {
  window.removeEventListener('popstate', onPopState)
  historyMotionContext?.revert()
  historyMotionContext = null
})
</script>

<template>
  <div ref="historyRoot" class="page history-page" :aria-busy="insightsLoading">
    <header class="page-header"><div><p class="eyebrow">TU CAMINO</p><h1>Historial</h1><p>Todos tus momentos, sin perder de vista cómo te hicieron sentir.</p></div><RouterLink v-if="firstEntryType" class="primary-button" :to="`/registrar/${firstEntryType}`"><AppIcon name="nuevo-registro" /> Nuevo registro</RouterLink></header>

    <div v-if="insightsLoading && !insightEntries.length" class="history-skeleton" role="status">
      <span class="visually-hidden">Cargando historial…</span>
      <article v-for="item in 4" :key="item" aria-hidden="true">
        <i class="skeleton skeleton--avatar"></i>
        <div><i class="skeleton skeleton--meta"></i><i class="skeleton skeleton--title"></i><i class="skeleton skeleton--copy"></i></div>
        <div class="history-skeleton__actions"><i class="skeleton skeleton--score"></i><i class="skeleton skeleton--action"></i></div>
      </article>
    </div>
    <div v-else-if="insightsError && !insightEntries.length" class="entry-list-empty" role="alert"><img :src="base + 'cats/felipa-molesta.png'" alt="" /><div><h3>No pudimos cargar el historial</h3><p>{{ insightsError }}</p><button class="primary-button" type="button" @click="load(currentPageFromQuery())">Reintentar</button></div></div>

    <template v-else>
      <div class="filter-toolbar">
        <button class="ghost-button filter-toggle" type="button" aria-controls="history-filters" :aria-expanded="filtersExpanded" @click="filtersExpanded = !filtersExpanded">
          {{ filtersExpanded ? 'Ocultar filtros' : 'Filtrar historial' }}
          <span v-if="activeFilterCount" class="filter-count" aria-label="Filtros activos">{{ activeFilterCount }}</span>
        </button>
        <button v-if="hasActiveFilters" class="mini-link" type="button" @click="clearFilters">Limpiar filtros</button>
      </div>

      <form id="history-filters" class="filter-bar" :class="{ 'is-open': filterPanelVisible }" @submit.prevent="applyFilters">
        <label><span>Tipo</span><select v-model="form.type"><option value="todos">Todos los tipos</option><option v-for="item in insightEntryTypes" :key="item.slug" :value="item.slug">{{ item.name }}</option></select></label>
        <label><span>Desde</span><input v-model="form.from" type="date" /></label>
        <label><span>Hasta</span><input v-model="form.to" type="date" /></label>
        <label><span>Sensación mínima</span><input v-model="form.minScore" type="number" min="1" max="10" placeholder="1" /></label>
        <label><span>Sensación máxima</span><input v-model="form.maxScore" type="number" min="1" max="10" placeholder="10" /></label>
        <label class="filter-search"><span>Buscar</span><input v-model="form.search" type="search" placeholder="Buscar en títulos y notas…" /></label>
        <div class="filter-actions"><button class="primary-button" type="submit">Aplicar filtros</button><button class="ghost-button" type="button" @click="clearFilters">Limpiar</button></div>
      </form>

      <p class="results-summary" role="status">
        <strong>{{ insightsTotal }}</strong> registro{{ insightsTotal === 1 ? '' : 's' }}
        <span v-if="insightsTotal"> · página {{ insightsPage }} de {{ Math.max(insightsPages, 1) }}</span>
      </p>

      <div v-if="hasResults" class="history-grid" :class="{ 'is-refreshing': insightsLoading }">
        <article v-for="entry in insightEntries" :key="entry.id" class="history-card" :style="{ '--entry-rail': entryRail(entry) }" :data-flip-id="`history-entry-${entry.id}`">
          <CatScore :score="entry.score" size="lg" />
          <div><span>{{ entry.typeName }} · {{ entry.time }}</span><h2>{{ entry.title }}</h2><p>{{ entry.detail || 'Sin notas' }}</p></div>
          <div class="history-card__meta">
            <b>{{ entry.score }}/10</b>
            <div class="history-card__actions">
              <RouterLink :to="`/editar/${entry.id}`" class="mini-link" title="Editar">Editar</RouterLink>
              <button class="mini-link mini-link--danger" type="button" @click="deleting = entry.id">Eliminar</button>
            </div>
          </div>
        </article>
      </div>

      <div v-else class="entry-list-empty">
        <img :src="base + 'cats/felipa-molesta.png'" alt="" />
        <div>
          <h3>{{ hasActiveFilters ? 'No encontramos registros con estos filtros' : 'No tenés registros' }}</h3>
          <p>{{ hasActiveFilters ? 'Probá ajustar o limpiar los filtros para ver más momentos.' : 'Felipa te espera para registrar el primer momento.' }}</p>
          <button v-if="hasActiveFilters" class="primary-button" type="button" @click="clearFilters">Limpiar filtros</button>
          <RouterLink v-else-if="firstEntryType" class="primary-button" :to="`/registrar/${firstEntryType}`">Crear primer registro</RouterLink>
        </div>
      </div>

      <button v-if="hasMoreInsights" class="primary-button load-more" type="button" @click="loadMore" :disabled="insightsLoading">{{ insightsLoading ? 'Cargando…' : 'Cargar más' }}</button>
    </template>

    <ConfirmDialog v-if="deleting !== null" title="¿Eliminar este registro?" message="Esta acción no se puede deshacer." confirm-label="Eliminar" :busy="deletingBusy" @confirm="confirmDelete" @cancel="cancelDelete" />
  </div>
</template>

<style scoped>
.filter-toolbar {
  display: none;
}

.filter-bar label {
  display: flex;
  flex-direction: column;
  gap: 5px;
  color: var(--cocoa-700);
  font-size: 12px;
  font-weight: 600;
}

.filter-search {
  grid-column: span 2;
}

.filter-actions {
  grid-column: 1 / -1;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.history-card__actions {
  display: flex;
  gap: 10px;
}

.results-summary strong {
  color: var(--cocoa-900);
}

.history-card > div:nth-child(2) > span {
  color: var(--cocoa-700);
  font-size: 11.5px;
}

.history-card > div:nth-child(2) > p {
  color: var(--cocoa-700);
  font-size: 13.5px;
  line-height: 1.45;
}

.entry-list-empty p {
  color: var(--cocoa-700);
  font-size: 13.5px;
  line-height: 1.45;
}

.entry-list-empty .primary-button {
  margin-top: 12px;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.history-skeleton {
  display: grid;
  gap: 12px;
}

.history-skeleton article > div:nth-child(2) { min-width: 0; }

.skeleton {
  display: block;
  border-radius: 999px;
  background: var(--sand-200);
  animation: insight-skeleton-pulse 1.35s ease-in-out infinite;
}

.skeleton--avatar { width: 76px; height: 76px; border-radius: 18px; }
.skeleton--meta { width: 110px; height: 9px; margin-bottom: 9px; }
.skeleton--title { width: min(280px, 72%); height: 17px; margin-bottom: 10px; }
.skeleton--copy { width: min(430px, 92%); height: 11px; }
.skeleton--score { width: 44px; height: 15px; }
.skeleton--action { width: 90px; height: 30px; margin-top: 12px; }

.history-grid.is-refreshing {
  pointer-events: none;
  opacity: .62;
  transition: opacity .18s ease;
}

@keyframes insight-skeleton-pulse {
  0% { opacity: .5; }
  100% { opacity: .5; }
  50% { opacity: .92; }
}

@media (max-width: 420px) {
  .filter-bar {
    grid-template-columns: 1fr;
  }

  .filter-search {
    grid-column: 1;
  }

  .filter-actions {
    grid-column: 1;
  }
}

/* Option 3: history as an editorial list, not a wall of identical cards. */
.filter-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 16px;
  margin-bottom: 10px;
  border: 2px solid var(--neo-ink, var(--cocoa-900, #2b211d));
  border-radius: 10px;
  background: var(--neo-butter-soft, var(--cream-50, #fffdf7));
  box-shadow: 4px 4px 0 var(--neo-ink, var(--cocoa-900, #2b211d));
}

.filter-bar input {
  padding: 9px 10px;
  border: 2px solid var(--neo-ink, var(--cocoa-900, #2b211d));
  border-radius: 8px;
  background: var(--neo-paper, #fffdf7);
  color: var(--cocoa-900);
  font-size: 14px;
}

.filter-bar select {
  padding: 9px 10px;
  border: 2px solid var(--neo-ink, var(--cocoa-900, #2b211d));
  border-radius: 8px;
  background: var(--neo-paper, #fffdf7);
  color: var(--cocoa-900);
  font-size: 14px;
}

.filter-bar input:focus-visible {
  outline: 3px solid var(--neo-orange, var(--dorito-300, #f1b36d));
  outline-offset: 2px;
}

.filter-bar select:focus-visible {
  outline: 3px solid var(--neo-orange, var(--dorito-300, #f1b36d));
  outline-offset: 2px;
}

.results-summary {
  margin: 18px 0 12px;
  color: var(--neo-ink, var(--cocoa-900));
  font-size: 13.5px;
  padding: 8px 12px;
  border-left: 7px solid var(--neo-orange-strong, var(--dorito-600, #bf5e16));
  background: var(--neo-butter-soft, #fff4d8);
}

.history-grid {
  gap: 16px;
}

.history-card {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 14px;
  align-items: start;
  position: relative;
  overflow: hidden;
  border: 2px solid var(--neo-ink, var(--cocoa-900, #2b211d));
  border-radius: 10px;
  background: var(--neo-paper, var(--cream-50, #fffdf7));
  box-shadow: 3px 3px 0 var(--neo-ink, var(--cocoa-900, #2b211d));
  transition: transform .2s ease, box-shadow .2s ease;
}

.history-card::before {
  position: absolute;
  inset: 0 auto 0 0;
  width: 8px;
  background: var(--entry-rail, var(--neo-orange-strong, #c45f16));
  content: '';
}

.history-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0 var(--neo-ink, var(--cocoa-900, #2b211d));
}

.history-card:focus-within {
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0 var(--neo-ink, var(--cocoa-900, #2b211d));
}

.history-card > div:nth-child(2) {
  position: relative;
  z-index: 1;
}

.history-card > .cat-score {
  position: relative;
  z-index: 1; margin-left: 4px; }

.history-card__meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  position: relative;
  z-index: 1;
}

.history-card__meta > b {
  padding: 4px 8px;
  border: 2px solid var(--neo-ink, var(--cocoa-900, #2b211d));
  border-radius: 7px;
  color: var(--neo-ink, var(--cocoa-900));
  background: var(--neo-butter-soft, #fff4d8);
}

.history-card__actions .mini-link {
  min-height: 34px;
  padding: 0 10px;
  border: 2px solid var(--neo-ink, var(--cocoa-900, #2b211d));
  border-radius: 7px;
  color: var(--neo-ink, var(--cocoa-900));
  background: var(--neo-paper, #fffdf7);
  text-decoration: none;
}

.history-card__actions .mini-link:hover {
  background: var(--neo-lavender-soft, #f0edf8);
}

.history-card__actions .mini-link:focus-visible {
  background: var(--neo-lavender-soft, #f0edf8);
}

.history-card__actions .mini-link--danger {
  border-color: var(--danger-500, #c85555);
  color: var(--danger-700, #9f3737);
}

.history-skeleton article {
  display: grid;
  grid-template-columns: 76px minmax(0, 1fr) auto;
  align-items: center;
  gap: 20px;
  min-height: 118px;
  padding: 20px 24px;
  border: 2px solid var(--neo-ink, var(--cocoa-900, #2b211d));
  border-radius: 10px;
  background: var(--neo-paper, var(--cream-50, #fffdf7));
  box-shadow: 3px 3px 0 var(--neo-ink, var(--cocoa-900, #2b211d));
}

.entry-list-empty {
  position: relative;
  min-height: 154px;
  padding-right: 176px;
  overflow: hidden;
  border: 2px dashed var(--neo-ink, var(--cocoa-900, #2b211d));
  border-radius: 10px;
  background: var(--neo-paper, var(--cream-50, #fffdf7));
}

.entry-list-empty > img {
  position: absolute;
  right: -12px;
  bottom: -14px;
  z-index: 0;
  width: 154px;
  height: 154px;
  object-fit: contain;
  pointer-events: none;
}

.entry-list-empty > div {
  position: relative;
  z-index: 1;
  max-width: 52ch;
}

@media (max-width: 720px) {
  .filter-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;
  }

  .filter-toggle {
    flex: 1;
    justify-content: space-between;
  }

  .filter-toolbar > .mini-link {
    min-height: 44px;
    padding-inline: 4px;
  }

  .filter-count {
    display: inline-grid;
    place-items: center;
    min-width: 24px;
    height: 24px;
    padding: 0 7px;
    border-radius: 999px;
    color: white;
    background: var(--dorito-500);
    font-size: 12px;
  }

  .filter-bar.is-open {
    display: grid;
  }

  .filter-search { grid-column: 1 / -1; }

  .filter-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .history-card .cat-score.lg {
    width: 58px;
    height: 58px;
  }

  .history-card h2 {
    font-size: 17px;
    line-height: 1.25;
  }

  .history-card__meta {
    grid-column: 1 / -1;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-top: 10px;
    border-top: 1px solid var(--sand-100);
  }

  .history-card__meta > b {
    color: var(--dorito-600);
    font-size: 14px;
  }

  .history-card__actions {
    gap: 6px;
  }

  .history-card__actions .mini-link {
    display: inline-flex;
    align-items: center;
    min-height: 36px;
    padding: 0 10px;
    border: 1px solid var(--sand-200);
    border-radius: 9px;
    background: var(--cream-50);
  }

  .history-card__actions .mini-link--danger {
    border-color: var(--danger-500);
  }

  .history-skeleton article {
    grid-template-columns: 58px minmax(0, 1fr);
    gap: 12px;
    min-height: 126px;
    padding: 15px;
  }

  .history-skeleton__actions {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 10px;
    border-top: 1px solid var(--sand-100);
  }

  .history-skeleton__actions .skeleton--action { margin-top: 0; }
  .history-skeleton .skeleton--avatar { width: 58px; height: 58px; border-radius: 16px; }
  .filter-bar {
    display: none;
    overflow: hidden;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding: 14px;
    box-shadow: 3px 3px 0 var(--neo-ink, var(--cocoa-900, #2b211d));
  }

  .history-card {
    grid-template-columns: 58px minmax(0, 1fr);
    gap: 12px;
    padding: 15px;
    padding-left: 19px;
    box-shadow: 2px 2px 0 var(--neo-ink, var(--cocoa-900, #2b211d));
  }

  .history-card::before { width: 6px; }

  .history-card:hover {
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0 var(--neo-ink, var(--cocoa-900, #2b211d));
  }

  .history-card:focus-within {
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0 var(--neo-ink, var(--cocoa-900, #2b211d));
  }
}

@media (max-width: 600px) {
  .entry-list-empty {
    min-height: 136px;
    padding-right: 118px;
  }

  .entry-list-empty > img {
    right: -8px;
    bottom: -10px;
    width: 112px;
    height: 112px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton {
    animation: none;
  }

  .history-grid.is-refreshing {
    transition: none;
  }
  .history-card {
    transform: none;
    transition: none;
  }
  .history-card:hover {
    transform: none;
    transition: none;
  }
  .history-card:focus-within {
    transform: none;
    transition: none;
  }
}
</style>
