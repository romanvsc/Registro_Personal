<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
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

const DELETE_ERROR_FALLBACK = 'Ocurrió un problema. Intentá nuevamente.'
const INVALID_ERROR_MESSAGES = new Set(['undefined', 'null', '[object object]'])

const firstEntryType = computed(() => insightEntryTypes.value[0]?.slug || '')

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
  await loadPersonalInsights(page, filtersFromForm())
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
  deletingBusy.value = true
  try {
    await deleteInsightEntry(deleting.value)
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
  await loadMoreInsights()
  await router.replace({ query: { ...route.query, page: insightsPage.value } })
}

function onPopState() {
  syncFormFromQuery()
  filtersExpanded.value = hasActiveFilters.value
  load(currentPageFromQuery())
}

onMounted(async () => {
  syncFormFromQuery()
  filtersExpanded.value = hasActiveFilters.value
  await load(currentPageFromQuery())
  window.addEventListener('popstate', onPopState)
})

onUnmounted(() => {
  window.removeEventListener('popstate', onPopState)
})
</script>

<template>
  <div class="page history-page" :aria-busy="insightsLoading">
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

      <form id="history-filters" class="filter-bar" :class="{ 'is-open': filtersExpanded }" @submit.prevent="applyFilters">
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
        <article v-for="entry in insightEntries" :key="entry.id" class="history-card">
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
.filter-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 16px;
  margin-bottom: 10px;
  border: 1px solid var(--dorito-200, #e9c9a8);
  border-radius: 14px;
  background: var(--cream-50, #fffdf7);
}

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

.filter-bar input,
.filter-bar select {
  padding: 9px 10px;
  border: 1px solid var(--dorito-200, #e9c9a8);
  border-radius: 10px;
  background: white;
  color: var(--cocoa-900);
  font-size: 14px;
}

.filter-actions {
  grid-column: 1 / -1;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.history-card {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 14px;
  align-items: start;
}

.history-card__meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.history-card__actions {
  display: flex;
  gap: 10px;
}

.results-summary {
  margin: 14px 0;
  color: var(--cocoa-700);
  font-size: 13.5px;
}

.results-summary strong {
  color: var(--cocoa-900);
}

.history-card > div:nth-child(2) > span,
.history-card > div:nth-child(2) > p {
  color: var(--cocoa-700);
}

.history-card > div:nth-child(2) > span {
  font-size: 11.5px;
}

.history-card > div:nth-child(2) > p {
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

.history-skeleton article {
  display: grid;
  grid-template-columns: 76px minmax(0, 1fr) auto;
  align-items: center;
  gap: 20px;
  min-height: 118px;
  padding: 20px 24px;
  border: 1px solid var(--sand-200);
  border-radius: 20px;
  background: var(--cream-50);
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

.history-card {
  animation: insight-card-in .32s ease-out both;
}

.history-card:nth-child(2) { animation-delay: 35ms; }
.history-card:nth-child(3) { animation-delay: 70ms; }
.history-card:nth-child(4) { animation-delay: 105ms; }
.history-card:nth-child(n + 5) { animation-delay: 140ms; }

@keyframes insight-skeleton-pulse {
  0%, 100% { opacity: .5; }
  50% { opacity: .92; }
}

@keyframes insight-card-in {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
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

  .filter-bar {
    display: none;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding: 14px;
  }

  .filter-bar.is-open {
    display: grid;
  }

  .filter-search { grid-column: 1 / -1; }

  .filter-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .history-card {
    grid-template-columns: 58px minmax(0, 1fr);
    gap: 12px;
    padding: 15px;
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
}

@media (max-width: 420px) {
  .filter-bar {
    grid-template-columns: 1fr;
  }

  .filter-search,
  .filter-actions {
    grid-column: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .history-card,
  .skeleton {
    animation: none;
  }

  .history-grid.is-refreshing {
    transition: none;
  }
}
</style>
