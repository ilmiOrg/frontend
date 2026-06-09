import { request, getToken } from "./config";

/**
 * Student profile, persisted server-side at /api/v1/students/me/profile.
 * Shape: { studentId, email, firstName, lastName, phone, location, photoUrl,
 *          maxBudget, countryId, countryName }.
 */

export async function getStudentProfile() {
  if (!getToken()) throw new Error("Not authenticated");
  return request("/api/v1/students/me/profile", {
    auth: true,
    errorMessage: "Failed to load profile",
  });
}

export async function updateStudentProfile(payload) {
  return request("/api/v1/students/me/profile", {
    method: "PUT",
    auth: true,
    body: payload,
    errorMessage: "Failed to save profile",
  });
}
