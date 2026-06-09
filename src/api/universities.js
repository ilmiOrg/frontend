import { request } from "./config";

/**
 * Fetch all universities, optionally filtered by country.
 * @param {{ countryId?: string }} options
 * @returns {Promise<Array>}
 */
export async function getUniversities(options = {}) {
  return request("/api/v1/universities", {
    query: options,
    errorMessage: "Failed to fetch universities",
  });
}

/**
 * Fetch a single university by ID.
 * @param {string} id - UUID of the university
 * @returns {Promise<object>}
 */
export async function getUniversityById(id) {
  return request(`/api/v1/universities/${id}`, {
    errorMessage: "University not found",
  });
}

/**
 * Create a university (requires auth).
 * @param {object} payload - { name, countryId, city?, website?, description?, logoUrl?, avgTuitionPerYear?, currency?, acceptanceRate? }
 * @returns {Promise<object>}
 */
export async function createUniversity(payload) {
  return request("/api/v1/universities", {
    method: "POST",
    auth: true,
    body: payload,
    errorMessage: "Failed to create university",
  });
}
