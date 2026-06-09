import { request, getToken } from "./config";

export async function getFavorites() {
  if (!getToken()) return [];
  return request("/api/v1/students/favorite-universities", {
    auth: true,
    errorMessage: "Failed to fetch favorites",
  });
}

export async function addFavorite(universityId) {
  if (!getToken()) throw new Error("Not authenticated");
  return request(`/api/v1/students/favorite-universities/${universityId}`, {
    method: "POST",
    auth: true,
    errorMessage: "Failed to add favorite",
  });
}

export async function removeFavorite(universityId) {
  if (!getToken()) throw new Error("Not authenticated");
  return request(`/api/v1/students/favorite-universities/${universityId}`, {
    method: "DELETE",
    auth: true,
    errorMessage: "Failed to remove favorite",
  });
}
