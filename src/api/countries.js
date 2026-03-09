import { apiUrl, jsonHeaders } from './config'

/**
 * Fetch all countries (for sign-up form).
 * @returns {Promise<Array<{ countryId: string, countryName: string, countryCode: string }>>}
 */
export async function getCountries() {
  let res
  try {
    res = await fetch(apiUrl('/api/v1/countries'), {
      method: 'GET',
      headers: jsonHeaders(),
    })
  } catch (err) {
    throw new Error('Cannot reach backend. Start the backend or use "Continue as guest".')
  }
  const text = await res.text()
  if (!res.ok) {
    let message = 'Failed to load countries'
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
