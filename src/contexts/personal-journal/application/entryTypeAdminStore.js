import { ref } from 'vue'
import { journalApi } from '../infrastructure/journalApi'
import { refreshEntryTypes } from './journalStore'

export const adminEntryTypes = ref([])
export const adminTypesLoading = ref(false)
export const adminTypesError = ref('')

export async function loadAdminEntryTypes() {
  adminTypesLoading.value = true
  adminTypesError.value = ''
  try {
    adminEntryTypes.value = await journalApi.listTypes(true)
  } catch (error) {
    adminTypesError.value = error instanceof Error ? error.message : 'No se pudieron cargar los tipos.'
  } finally {
    adminTypesLoading.value = false
  }
}

export async function getEntryType(id) {
  adminTypesError.value = ''
  const { type } = await journalApi.getType(id)
  return type
}

export async function createEntryType(payload) {
  adminTypesError.value = ''
  const { type } = await journalApi.createType(payload)
  await loadAdminEntryTypes()
  await refreshEntryTypes()
  return type
}

export async function updateEntryType(id, payload) {
  adminTypesError.value = ''
  const { type } = await journalApi.updateType(id, payload)
  await loadAdminEntryTypes()
  await refreshEntryTypes()
  return type
}

export async function deleteEntryType(id) {
  adminTypesError.value = ''
  const result = await journalApi.deleteType(id)
  await loadAdminEntryTypes()
  await refreshEntryTypes()
  return result
}
