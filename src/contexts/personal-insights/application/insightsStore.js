import { computed, ref } from 'vue'
import { personalJournalReadApi } from '../infrastructure/personalJournalReadApi'
import { insightsApi } from '../infrastructure/insightsApi'
import { journalApi } from '../../personal-journal/infrastructure/journalApi'
import { projectCurrentStreak, projectWeeklyProgress } from './wellbeingProjection'

export const insightEntries = ref([])
export const insightEntryTypes = ref([])
export const insightsLoading = ref(false)
export const insightsError = ref('')
export const insightsPage = ref(1)
export const insightsTotal = ref(0)
export const insightsPages = ref(0)
export const insightsFilters = ref({})

export const insightSummary = ref(null)
export const insightTrend = ref([])
export const insightComparison = ref(null)
export const loadingSummary = ref(false)
export const loadingTrend = ref(false)
export const loadingComparison = ref(false)
export const summaryError = ref('')
export const trendError = ref('')
export const comparisonError = ref('')

export const wellbeingStreak = ref(projectCurrentStreak([]))
export const wellbeingProgress = ref(projectWeeklyProgress(null))
export const loadingWellbeingStreak = ref(false)
export const loadingWellbeingProgress = ref(false)
export const wellbeingStreakError = ref('')
export const wellbeingProgressError = ref('')

export const hasInsightEntries = computed(() => insightEntries.value.length > 0)
export const hasMoreInsights = computed(() => insightsPage.value < insightsPages.value)
export const hasActiveInsightsFilters = computed(() => Object.keys(insightsFilters.value).length > 0)
export const bestType = computed(() => {
  const byType = insightSummary.value?.byType || []
  if (!byType.length) return null
  return byType.reduce((best, item) => (item.averageScore > best.averageScore ? item : best), byType[0])
})

const assetsBase = import.meta.env.BASE_URL

export function catForInsight(score) {
  if (score <= 3) return { name: 'Felipa', image: `${assetsBase}cats/felipa-molesta.png` }
  if (score <= 7) return { name: 'Felicia', image: `${assetsBase}cats/felicia-cansada.png` }
  return { name: 'Dorito', image: `${assetsBase}cats/dorito-feliz.png` }
}

function cleanFilters(filters = {}) {
  const cleaned = {}
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== '') cleaned[key] = value
  })
  return cleaned
}

export async function loadPersonalInsights(page = 1, filters = {}) {
  insightsLoading.value = true
  insightsError.value = ''

  try {
    const activeFilters = cleanFilters(filters)
    insightsFilters.value = activeFilters
    const listParams = { page, limit: 30, ...activeFilters }
    const [types, records] = await Promise.all([
      personalJournalReadApi.listEntryTypes(),
      personalJournalReadApi.listEntries(listParams),
    ])
    insightEntryTypes.value = types
    insightEntries.value = page === 1 ? records.items : [...insightEntries.value, ...records.items]
    insightsPage.value = records.pagination.page
    insightsTotal.value = records.pagination.total
    insightsPages.value = records.pagination.pages
  } catch (error) {
    if (page === 1) {
      insightEntryTypes.value = []
      insightEntries.value = []
    }
    insightsError.value = error instanceof Error ? error.message : 'No se pudieron cargar tus registros.'
  } finally {
    insightsLoading.value = false
  }
}

export async function loadMoreInsights() {
  if (!hasMoreInsights.value || insightsLoading.value) return
  await loadPersonalInsights(insightsPage.value + 1, insightsFilters.value)
}

export async function deleteInsightEntry(id) {
  await journalApi.deleteEntry(id)
  insightEntries.value = insightEntries.value.filter(item => item.id !== id)
  insightsTotal.value = Math.max(0, insightsTotal.value - 1)
  insightsPages.value = Math.max(1, Math.ceil(insightsTotal.value / 30))
}

export async function loadInsightSummary(params = {}) {
  loadingSummary.value = true
  summaryError.value = ''
  try {
    insightSummary.value = await insightsApi.summary(params)
  } catch (error) {
    summaryError.value = error instanceof Error ? error.message : 'No pudimos cargar tus estadísticas.'
  } finally {
    loadingSummary.value = false
  }
}

export async function loadInsightTrend(params = {}) {
  loadingTrend.value = true
  trendError.value = ''
  try {
    const { items } = await insightsApi.trend(params)
    insightTrend.value = items || []
  } catch (error) {
    trendError.value = error instanceof Error ? error.message : 'No pudimos cargar tu tendencia.'
  } finally {
    loadingTrend.value = false
  }
}

export async function loadInsightComparison(params = {}) {
  loadingComparison.value = true
  comparisonError.value = ''
  try {
    insightComparison.value = await insightsApi.comparison(params)
  } catch (error) {
    comparisonError.value = error instanceof Error ? error.message : 'No pudimos comparar tus periodos.'
  } finally {
    loadingComparison.value = false
  }
}

export async function loadWellbeingStreak() {
  loadingWellbeingStreak.value = true
  wellbeingStreakError.value = ''
  try {
    const { items } = await insightsApi.trend({ days: 365 })
    wellbeingStreak.value = projectCurrentStreak(items)
  } catch (error) {
    wellbeingStreakError.value = error instanceof Error ? error.message : 'No pudimos calcular tu racha.'
  } finally {
    loadingWellbeingStreak.value = false
  }
}

export async function loadWellbeingProgress() {
  loadingWellbeingProgress.value = true
  wellbeingProgressError.value = ''
  try {
    wellbeingProgress.value = projectWeeklyProgress(await insightsApi.comparison({ period: 'week' }))
  } catch (error) {
    wellbeingProgressError.value = error instanceof Error ? error.message : 'No pudimos calcular tu progreso.'
  } finally {
    loadingWellbeingProgress.value = false
  }
}
