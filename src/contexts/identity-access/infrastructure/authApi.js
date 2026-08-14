async function request(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    const apiError = payload && typeof payload.error === 'object' ? payload.error : null
    const message = typeof apiError?.message === 'string'
      ? apiError.message
      : typeof payload.error === 'string'
        ? payload.error
        : 'No se pudo completar la autenticación.'
    const error = new Error(message)
    error.status = response.status
    error.code = typeof apiError?.code === 'string' ? apiError.code : null
    throw error
  }
  return payload
}

const apiBase = `${import.meta.env.BASE_URL}api`

export const authApi = {
  login: (email, password) => request(`${apiBase}/auth/login`, { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: ({ name, email, password, passwordConfirmation }) => request(`${apiBase}/auth/register`, {
    method: 'POST',
    body: JSON.stringify({ name, email, password, passwordConfirmation }),
  }),
  forgotPassword: email => request(`${apiBase}/auth/forgot-password`, {
    method: 'POST', body: JSON.stringify({ email }),
  }),
  resetPassword: ({ token, password, passwordConfirmation }) => request(`${apiBase}/auth/reset-password`, {
    method: 'POST', body: JSON.stringify({ token, password, passwordConfirmation }),
  }),
  current: () => request(`${apiBase}/auth/me`),
  logout: () => request(`${apiBase}/auth/logout`, { method: 'POST' }),
}
