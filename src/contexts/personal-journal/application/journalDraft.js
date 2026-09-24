/**
 * Keeps the presentation layer from sending answers that do not belong to the
 * selected entry type. This is deliberately a pure helper: it knows nothing
 * about Vue, HTTP or persistence.
 */
export function sanitizeValuesForType(values, typeDefinition) {
  const allowedKeys = new Set((typeDefinition?.fields || []).map((field) => field.key ?? field.fieldKey ?? field.field_key))
  return Object.fromEntries(
    Object.entries(values || {}).filter(([key]) => allowedKeys.has(key)),
  )
}

export function hasDiscardableValues(values, typeDefinition) {
  const allowedKeys = new Set((typeDefinition?.fields || []).map((field) => field.key ?? field.fieldKey ?? field.field_key))
  return Object.entries(values || {}).some(([key, value]) => (
    !allowedKeys.has(key) && value !== undefined && value !== null && value !== ''
  ))
}

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue)
  if (value && typeof value === 'object') {
    return Object.keys(value).sort().reduce((result, key) => {
      result[key] = stableValue(value[key])
      return result
    }, {})
  }
  return value
}

export function hasDraftChanges(current, initial) {
  return JSON.stringify(stableValue(current)) !== JSON.stringify(stableValue(initial))
}

export function cloneDraft(draft) {
  return stableValue(draft)
}
