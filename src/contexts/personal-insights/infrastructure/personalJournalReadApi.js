async function request(path, signal) {
  const response = await fetch(path, {
    headers: { Accept: 'application/json' },
    signal,
  })
  const body = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(body?.error || 'No se pudieron consultar tus registros.')
  }

  if (!Array.isArray(body)) {
    throw new Error('El servidor devolvió un formato de registros inválido.')
  }

  return body
}

const apiBase = `${import.meta.env.BASE_URL}api`

export const personalJournalReadApi = {
  listEntryTypes: signal => request(`${apiBase}/entry-types`, signal),
  listEntries: signal => request(`${apiBase}/entries`, signal),
}
