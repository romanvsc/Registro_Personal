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

function toQuery(params = {}) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) search.set(key, String(value))
  })
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

export const journalApi = {
  listTypes: () => request(`${apiBase}/entry-types`),
  listEntries: (params = {}) => request(`${apiBase}/entries${toQuery(params)}`),
  createEntry: payload => request(`${apiBase}/entries`, { method: 'POST', body: JSON.stringify(payload) }),
}