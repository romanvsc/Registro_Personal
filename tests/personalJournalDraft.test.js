import assert from 'node:assert/strict'
import {
  cloneDraft,
  hasDiscardableValues,
  hasDraftChanges,
  sanitizeValuesForType,
} from '../src/contexts/personal-journal/application/journalDraft.js'

const comida = { fields: [{ key: 'descripcion' }] }
const entrenamiento = { fields: [{ key: 'duracion' }] }

assert.deepEqual(
  sanitizeValuesForType({ descripcion: 'ensalada', duracion: 30 }, entrenamiento),
  { duracion: 30 },
)
assert.equal(hasDiscardableValues({ descripcion: 'ensalada' }, entrenamiento), true)
assert.equal(hasDiscardableValues({ descripcion: '' }, entrenamiento), false)
assert.equal(hasDiscardableValues({ descripcion: 'ensalada' }, comida), false)

const initial = cloneDraft({ type: 'comida', values: { descripcion: 'ensalada' }, notes: '' })
assert.equal(hasDraftChanges(initial, cloneDraft(initial)), false)
assert.equal(hasDraftChanges({ ...initial, values: { descripcion: 'pizza' } }, initial), true)
assert.equal(hasDraftChanges({ ...initial, values: { duracion: 30 } }, initial), true)

console.log('PersonalJournal draft tests: OK')
