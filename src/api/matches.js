import { request, getToken } from "./config";

/**
 * Deterministic program matches for the logged-in student.
 * Backend ranks every program against the student's transcripts + exams and
 * returns: { programId, fieldType, degree, requiredDegree, university, matchScore,
 *            eligible, criteria: [...], missing: [...] }.
 *
 * @param {Object} filters optional { countryId, fieldType, degree, eligibleOnly, minScore }
 */
export async function getMatches(filters = {}) {
  if (!getToken()) throw new Error("Not authenticated");
  return request("/api/v1/students/matches", {
    auth: true,
    query: filters,
    errorMessage: "Failed to fetch matches",
  });
}
