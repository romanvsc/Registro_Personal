async function request(path, signal) {
  const response = await fetch(path, {
    headers: { Accept: 'application/json' },
    signal,
  })
  const body = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(body?.error || 'No se pudieron consultar tus registros.')
  }

  return body
}

function assertList(body) {
  if (!Array.isArray(body?.items) || !body?.pagination) {
    throw new Error('El servidor devolvió un formato de registros inválido.')
  }
  return body
}

const apiBase = `${import.meta.env.BASE_URL}api`

function toQuery(params = {}) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) search.set(key, String(value))
  })
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

export const personalJournalReadApi = {
  listEntryTypes: signal => request(`${apiBase}/entry-types`, signal),
  listEntries: async (params = {}, signal) => assertList(await request(`${apiBase}/entries${toQuery(params)}`, signal)),
}