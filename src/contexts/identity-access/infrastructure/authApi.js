async function request(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(payload.error || 'No se pudo completar la autenticación.')
    error.status = response.status
    throw error
  }
  return payload
}

const apiBase = `${import.meta.env.BASE_URL}api`

export const authApi = {
  login: (email, password) => request(`${apiBase}/auth/login`, { method: 'POST', body: JSON.stringify({ email, password }) }),
  current: () => request(`${apiBase}/auth/me`),
  logout: () => request(`${apiBase}/auth/logout`, { method: 'POST' }),
}
