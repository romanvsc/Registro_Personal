async function request(path, signal) {
  const response = await fetch(path, {
    headers: { Accept: 'application/json' },
    credentials: 'include',
    signal,
  })
  const body = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(body?.error || 'No se pudieron cargar tus estadísticas.')
  }

  return body
}

const apiBase = `${import.meta.env.BASE_URL}api`

function toQuery(params = {}) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value) !== '') search.set(key, String(value))
  })
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

export const insightsApi = {
  summary: (params = {}, signal) => request(`${apiBase}/insights/summary${toQuery(params)}`, signal),
  trend: (params = {}, signal) => request(`${apiBase}/insights/trend${toQuery(params)}`, signal),
  comparison: (params = {}, signal) => request(`${apiBase}/insights/comparison${toQuery(params)}`, signal),
}