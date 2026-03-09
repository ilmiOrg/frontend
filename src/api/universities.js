import { apiUrl, jsonHeaders } from './config'

/**
 * Get auth token from storage (for use in api client).
 */
function getToken() {
  return typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null
}

/**
 * Fetch all universities, optionally filtered by country.
 * @param {{ countryId?: string }} options
 * @returns {Promise<Array>}
 */
export async function getUniversities(options = {}) {
  const { countryId } = options
  let url = apiUrl('/api/v1/universities')
  if (countryId) {
    url += `?countryId=${encodeURIComponent(countryId)}`
  }
  const res = await fetch(url, {
    method: 'GET',
    headers: jsonHeaders(),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Failed to fetch universities')
  }
  return res.json()
}

/**
 * Fetch a single university by ID.
 * @param {string} id - UUID of the university
 * @returns {Promise<object>}
 */
export async function getUniversityById(id) {
  const res = await fetch(apiUrl(`/api/v1/universities/${id}`), {
    method: 'GET',
    headers: jsonHeaders(),
  })
  if (!res.ok) {
    if (res.status === 404) throw new Error('University not found')
    const text = await res.text()
    throw new Error(text || 'Failed to fetch university')
  }
  return res.json()
}

/**
 * Create a university (requires auth).
 * @param {object} payload - { name, countryId, city?, website?, description?, logoUrl?, avgTuitionPerYear?, currency?, acceptanceRate? }
 * @returns {Promise<object>}
 */
export async function createUniversity(payload) {
  const token = getToken()
  const res = await fetch(apiUrl('/api/v1/universities'), {
    method: 'POST',
    headers: jsonHeaders(token),
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text()
    let message = 'Failed to create university'
    try {
      const data = JSON.parse(text)
      if (data.message) message = data.message
    } catch (_) {
      if (text) message = text
    }
    throw new Error(message)
  }
  return res.json()
}
