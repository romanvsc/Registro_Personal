<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  deleteInsightEntry,
  hasMoreInsights,
  insightEntries,
  insightEntryTypes,
  insightsError,
  insightsLoading,
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

const DELETE_ERROR_FALLBACK = 'Ocurrió un problema. Intentá nuevamente.'
const INVALID_ERROR_MESSAGES = new Set(['undefined', 'null', '[object object]'])

const firstEntryType = computed(() => insightEntryTypes.value[0]?.slug || '')

const hasResults = computed(() => insightEntries.value.length > 0)
const hasActiveFilters = computed(() => form.type !== 'todos' || form.from || form.to || form.minScore !== '' || form.maxScore !== '' || form.search.trim() !== '')

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
  load(currentPageFromQuery())
}

onMounted(async () => {
  syncFormFromQuery()
  await load(currentPageFromQuery())
  window.addEventListener('popstate', onPopState)
})
</script>

<template>
  <div class="page history-page" :aria-busy="insightsLoading">
    <header class="page-header"><div><p class="eyebrow">TU CAMINO</p><h1>Historial</h1><p>Todos tus momentos, sin perder de vista cómo te hicieron sentir.</p></div><RouterLink v-if="firstEntryType" class="primary-button" :to="`/registrar/${firstEntryType}`"><AppIcon name="nuevo-registro" /> Nuevo registro</RouterLink></header>

    <p v-if="insightsLoading && !insightEntries.length" class="soft-label" role="status">Cargando historial…</p>
    <div v-else-if="insightsError && !insightEntries.length" class="entry-list-empty" role="alert"><img :src="base + 'cats/felipa-molesta.png'" alt="" /><div><h3>No pudimos cargar el historial</h3><p>{{ insightsError }}</p><button class="primary-button" type="button" @click="load(currentPageFromQuery())">Reintentar</button></div></div>

    <template v-else>
      <form class="filter-bar" @submit.prevent="applyFilters">
        <label><span>Tipo</span><select v-model="form.type"><option value="todos">Todos los tipos</option><option v-for="item in insightEntryTypes" :key="item.slug" :value="item.slug">{{ item.name }}</option></select></label>
        <label><span>Desde</span><input v-model="form.from" type="date" /></label>
        <label><span>Hasta</span><input v-model="form.to" type="date" /></label>
        <label><span>Sensación mínima</span><input v-model="form.minScore" type="number" min="1" max="10" placeholder="1" /></label>
        <label><span>Sensación máxima</span><input v-model="form.maxScore" type="number" min="1" max="10" placeholder="10" /></label>
        <label class="filter-search"><span>Buscar</span><input v-model="form.search" type="search" placeholder="Buscar en títulos y notas…" /></label>
        <div class="filter-actions"><button class="primary-button" type="submit">Aplicar filtros</button><button class="ghost-button" type="button" @click="clearFilters">Limpiar</button></div>
      </form>

      <p class="soft-label">{{ insightsTotal }} registro{{ insightsTotal === 1 ? '' : 's' }} · página {{ insightsPage }} de {{ insightsPages }}</p>

      <div v-if="hasResults" class="history-grid">
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

.ghost-button {
  padding: 10px 16px;
  border: 1px solid var(--dorito-200, #e9c9a8);
  border-radius: 10px;
  background: transparent;
  color: var(--cocoa-800);
  font-weight: 600;
  cursor: pointer;
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

.mini-link {
  border: 0;
  background: transparent;
  padding: 2px 0;
  color: var(--dorito-600, #c07a3d);
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
}

.mini-link--danger {
  color: var(--rose-600, #b3403a);
}

.filter-bar-error {
  margin-top: 8px;
}

@media (max-width: 720px) {
  .filter-bar { grid-template-columns: repeat(2, 1fr); }
  .filter-search { grid-column: 1 / -1; }
}
</style>