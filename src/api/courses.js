import { request } from "./config";

/** Public partner-course listings. filters: { subject } */
export async function getCourses(filters = {}) {
  return request("/api/v1/courses", {
    query: filters,
    errorMessage: "Failed to load courses",
  });
}
