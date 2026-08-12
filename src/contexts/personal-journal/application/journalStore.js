import { computed, ref } from 'vue'
import { journalApi } from '../infrastructure/journalApi'

export const entries = ref([])
export const entryTypes = ref([])
export const journalLoading = ref(false)
export const journalError = ref('')

const assetsBase = import.meta.env.BASE_URL

export function catFor(score) {
  if (score <= 3) return { name: 'Felipa', mood: 'malhumorada', image: `${assetsBase}cats/felipa-molesta.png`, color: 'rose' }
  if (score <= 7) return { name: 'Felicia', mood: 'con fiaca', image: `${assetsBase}cats/felicia-cansada.png`, color: 'sage' }
  return { name: 'Dorito', mood: 'feliz', image: `${assetsBase}cats/dorito-feliz.png`, color: 'orange' }
}

export async function loadJournal() {
  journalLoading.value = true
  journalError.value = ''
  try {
    const [types, records] = await Promise.all([journalApi.listTypes(), journalApi.listEntries()])
    entryTypes.value = types
    entries.value = records
  } catch (error) {
    journalError.value = error.message
  } finally {
    journalLoading.value = false
  }
}

export async function addEntry(entry) {
  journalError.value = ''
  try {
    await journalApi.createEntry(entry)
    entries.value = await journalApi.listEntries()
  } catch (error) {
    journalError.value = error.message
    throw error
  }
}

export const average = computed(() => entries.value.length
  ? Math.round(entries.value.reduce((sum, entry) => sum + entry.score, 0) / entries.value.length * 10) / 10
  : 0)
