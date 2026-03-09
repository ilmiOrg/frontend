/**
 * Backend API base URL.
 * In development: run backend in IntelliJ on port 8080 and set REACT_APP_API_URL=http://localhost:8080
 * (or leave unset to use this default).
 */
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:8080'

/**
 * Build full URL for an API path (e.g. '/api/v1/auth/login' -> 'http://localhost:8080/api/v1/auth/login').
 */
export function apiUrl(path) {
  const base = API_BASE_URL.replace(/\/$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}

/**
 * Default headers for JSON requests. Pass getToken() for authenticated requests.
 */
export function jsonHeaders(token = null) {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}
