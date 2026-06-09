import { request, getToken } from "./config";

/** Public scholarship browse. filters: { field, degree, countryId } */
export async function getScholarships(filters = {}) {
  return request("/api/v1/scholarships", {
    query: filters,
    errorMessage: "Failed to load scholarships",
  });
}

/**
 * Scholarships ranked against the logged-in student (citizenship, GPA, validity,
 * interest alignment). Each: { scholarshipId, name, universityName, countryName,
 * degreeLevel, fieldType, awardType, awardValue, currency, deadline, eligible,
 * matchesInterests, reasons:[...] }.
 */
export async function getScholarshipMatches({ eligibleOnly = false } = {}) {
  if (!getToken()) throw new Error("Not authenticated");
  return request("/api/v1/students/scholarship-matches", {
    auth: true,
    query: { eligibleOnly },
    errorMessage: "Failed to load scholarship matches",
  });
}
