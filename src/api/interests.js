import { request, getToken } from "./config";

/** Student interests — degrees & fields. All authenticated (student from JWT). */

export async function getInterestedDegrees() {
  if (!getToken()) return [];
  return request("/api/v1/students/interested-degrees", { auth: true, errorMessage: "Failed to load degrees" });
}

export async function addInterestedDegree(degree) {
  return request("/api/v1/students/interested-degrees", {
    method: "POST", auth: true, body: { degree }, errorMessage: "Failed to add degree",
  });
}

export async function removeInterestedDegree(id) {
  return request(`/api/v1/students/interested-degrees/${id}`, {
    method: "DELETE", auth: true, errorMessage: "Failed to remove degree",
  });
}

export async function getInterestedFields() {
  if (!getToken()) return [];
  return request("/api/v1/students/interested-fields", { auth: true, errorMessage: "Failed to load fields" });
}

export async function addInterestedField(field) {
  return request("/api/v1/students/interested-fields", {
    method: "POST", auth: true, body: { field }, errorMessage: "Failed to add field",
  });
}

export async function removeInterestedField(id) {
  return request(`/api/v1/students/interested-fields/${id}`, {
    method: "DELETE", auth: true, errorMessage: "Failed to remove field",
  });
}
