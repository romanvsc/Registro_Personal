import { computed, ref } from 'vue'
import { personalJournalReadApi } from '../infrastructure/personalJournalReadApi'

export const insightEntries = ref([])
export const insightEntryTypes = ref([])
export const insightsLoading = ref(false)
export const insightsError = ref('')
export const insightsPage = ref(1)
export const insightsTotal = ref(0)
export const insightsPages = ref(0)

export const hasInsightEntries = computed(() => insightEntries.value.length > 0)
export const insightAverage = computed(() => {
  if (!hasInsightEntries.value) return null
  const total = insightEntries.value.reduce((sum, entry) => sum + Number(entry.score), 0)
  return Math.round(total / insightEntries.value.length * 10) / 10
})
export const hasMoreInsights = computed(() => insightsPage.value < insightsPages.value)

const assetsBase = import.meta.env.BASE_URL

export function catForInsight(score) {
  if (score <= 3) return { name: 'Felipa', image: `${assetsBase}cats/felipa-molesta.png` }
  if (score <= 7) return { name: 'Felicia', image: `${assetsBase}cats/felicia-cansada.png` }
  return { name: 'Dorito', image: `${assetsBase}cats/dorito-feliz.png` }
}

export async function loadPersonalInsights(page = 1) {
  insightsLoading.value = true
  insightsError.value = ''

  try {
    const [types, records] = await Promise.all([
      personalJournalReadApi.listEntryTypes(),
      personalJournalReadApi.listEntries({ page, limit: 30 }),
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
  await loadPersonalInsights(insightsPage.value + 1)
}