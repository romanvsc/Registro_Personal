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
    const [types, records] = await Promise.all([journalApi.listTypes(), journalApi.listEntries({ page: 1, limit: 30 })])
    entryTypes.value = types
    entries.value = records.items
  } catch (error) {
    journalError.value = error.message
  } finally {
    journalLoading.value = false
  }
}

export async function addEntry(entry) {
  journalError.value = ''
  try {
    const created = await journalApi.createEntry(entry)
    if (created.entry) {
      entries.value = [created.entry, ...entries.value]
    } else {
      entries.value = await journalApi.listEntries({ page: 1, limit: 30 }).then(r => r.items)
    }
  } catch (error) {
    journalError.value = error.message
    throw error
  }
}

export async function loadEntry(id) {
  journalError.value = ''
  try {
    const { entry } = await journalApi.getEntry(id)
    return entry
  } catch (error) {
    journalError.value = error.message
    throw error
  }
}

export async function editEntry(id, entry) {
  journalError.value = ''
  try {
    const { entry: updated } = await journalApi.updateEntry(id, entry)
    const index = entries.value.findIndex(item => item.id === id)
    if (index !== -1) entries.value[index] = updated
    else entries.value = [updated, ...entries.value]
    return updated
  } catch (error) {
    journalError.value = error.message
    throw error
  }
}

export async function removeEntry(id) {
  journalError.value = ''
  try {
    await journalApi.deleteEntry(id)
    entries.value = entries.value.filter(item => item.id !== id)
  } catch (error) {
    journalError.value = error.message
    throw error
  }
}

export const average = computed(() => entries.value.length
  ? Math.round(entries.value.reduce((sum, entry) => sum + entry.score, 0) / entries.value.length * 10) / 10
  : 0)