/**
 * Resolve a router redirect without allowing an external or protocol-relative
 * destination to be injected through the login URL.
 */
export function getSafeRedirect(value, fallback = '/') {
  if (typeof value !== 'string' || value.length === 0) return fallback
  if (!value.startsWith('/') || value.startsWith('//')) return fallback
  return value
}

