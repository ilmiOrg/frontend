import { request } from "./config";

/** Public job/internship listings. filters: { field, countryCode, degree } */
export async function getJobs(filters = {}) {
  return request("/api/v1/jobs", {
    query: filters,
    errorMessage: "Failed to load jobs",
  });
}
