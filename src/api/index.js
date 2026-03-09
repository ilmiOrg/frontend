/**
 * Frontend API layer for the ilmi backend.
 *
 * Endpoints:
 * - Auth:  POST /api/v1/auth/register, POST /api/v1/auth/login
 * - Universities: GET /api/v1/universities, GET /api/v1/universities/:id, POST /api/v1/universities (auth)
 *
 * Set REACT_APP_API_URL in .env to point to the backend (default: http://localhost:8080).
 */

export { API_BASE_URL, apiUrl, jsonHeaders } from './config'
export { login, register } from './auth'
export { getUniversities, getUniversityById, createUniversity } from './universities'
export { getCountries } from './countries'
