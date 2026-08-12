async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.error || 'No se pudo conectar con el servidor.')
  return body
}

const apiBase = `${import.meta.env.BASE_URL}api`

export const journalApi = {
  listTypes: () => request(`${apiBase}/entry-types`),
  listEntries: () => request(`${apiBase}/entries`),
  createEntry: payload => request(`${apiBase}/entries`, { method: 'POST', body: JSON.stringify(payload) }),
}
