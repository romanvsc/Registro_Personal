import { computed, ref } from 'vue'
import { personalJournalReadApi } from '../infrastructure/personalJournalReadApi'

export const insightEntries = ref([])
export const insightEntryTypes = ref([])
export const insightsLoading = ref(false)
export const insightsError = ref('')

export const hasInsightEntries = computed(() => insightEntries.value.length > 0)
export const insightAverage = computed(() => {
  if (!hasInsightEntries.value) return null
  const total = insightEntries.value.reduce((sum, entry) => sum + Number(entry.score), 0)
  return Math.round(total / insightEntries.value.length * 10) / 10
})

const assetsBase = import.meta.env.BASE_URL

export function catForInsight(score) {
  if (score <= 3) return { name: 'Felipa', image: `${assetsBase}cats/felipa-molesta.png` }
  if (score <= 7) return { name: 'Felicia', image: `${assetsBase}cats/felicia-cansada.png` }
  return { name: 'Dorito', image: `${assetsBase}cats/dorito-feliz.png` }
}

export async function loadPersonalInsights() {
  insightsLoading.value = true
  insightsError.value = ''

  try {
    const [types, entries] = await Promise.all([
      personalJournalReadApi.listEntryTypes(),
      personalJournalReadApi.listEntries(),
    ])
    insightEntryTypes.value = types
    insightEntries.value = entries
  } catch (error) {
    insightEntryTypes.value = []
    insightEntries.value = []
    insightsError.value = error instanceof Error ? error.message : 'No se pudieron cargar tus registros.'
  } finally {
    insightsLoading.value = false
  }
}
