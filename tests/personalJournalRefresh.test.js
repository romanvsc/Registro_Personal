import assert from 'node:assert/strict'
import { entryTypes, refreshEntryTypes } from '../src/contexts/personal-journal/application/journalStore.js'
import { journalApi } from '../src/contexts/personal-journal/infrastructure/journalApi.js'

const originalListTypes = journalApi.listTypes
let calls = 0
journalApi.listTypes = async () => {
  calls += 1
  return [{ slug: 'entrenamiento', active: true }]
}

try {
  entryTypes.value = [{ slug: 'comida', active: true }]
  const refreshed = await refreshEntryTypes()
  assert.equal(calls, 1)
  assert.deepEqual(refreshed, [{ slug: 'entrenamiento', active: true }])
  assert.deepEqual(entryTypes.value, refreshed)
} finally {
  journalApi.listTypes = originalListTypes
}

console.log('PersonalJournal entry type refresh tests: OK')
