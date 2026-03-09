import { apiUrl, jsonHeaders, API_BASE_URL } from './config'

/**
 * Login with email and password.
 * @returns {{ token: string, email: string }}
 */
export async function login(email, password) {
  let res
  try {
    res = await fetch(apiUrl('/api/v1/auth/login'), {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify({ email, password }),
    })
  } catch (err) {
    throw new Error('Cannot reach server. Is the backend running at ' + API_BASE_URL + '? Use "Continue as guest" to try the app without login.')
  }
  const text = await res.text()
  if (!res.ok) {
    let message = 'Login failed'
    if (res.status === 403) message = 'Access denied. Use "Continue as guest" or check backend is running.'
    else if (res.status === 401) message = 'Invalid email or password.'
    else {
      try {
        const data = JSON.parse(text)
        if (data.message) message = data.message
      } catch (_) {
        if (text) message = text.slice(0, 200)
      }
    }
    throw new Error(message)
  }
  try {
    return JSON.parse(text)
  } catch (_) {
    throw new Error('Invalid response from server')
  }
}

/**
 * Register a new user.
 * @param {{ email: string, password: string, firstName: string, lastName: string, countryId: string }} userData
 * @returns {{ token: string, email: string }}
 */
export async function register(userData) {
  let res
  try {
    res = await fetch(apiUrl('/api/v1/auth/register'), {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify(userData),
    })
  } catch (err) {
    throw new Error('Cannot reach backend. Start the backend or use "Continue as guest".')
  }
  const text = await res.text()
  if (!res.ok) {
    let message = 'Registration failed'
    try {
      const data = JSON.parse(text)
      if (data.message) message = data.message
    } catch (_) {
      if (text) message = text.slice(0, 200)
    }
    throw new Error(message)
  }
  try {
    return JSON.parse(text)
  } catch (_) {
    throw new Error('Invalid response from server')
  }
}
