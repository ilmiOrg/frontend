import { apiUrl, jsonHeaders } from "./config";

const AUTH_TOKEN_KEY = "token";

function getToken() {
  return typeof localStorage !== "undefined"
    ? localStorage.getItem(AUTH_TOKEN_KEY)
    : null;
}

export async function getFavorites() {
  const token = getToken();
  if (!token) return [];
  const res = await fetch(apiUrl("/api/v1/students/favorite-universities"), {
    method: "GET",
    headers: jsonHeaders(token),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to fetch favorites");
  }
  return res.json();
}

export async function addFavorite(universityId) {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");
  const res = await fetch(apiUrl(`/api/v1/students/favorite-universities/${universityId}`), {
    method: "POST",
    headers: jsonHeaders(token),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to add favorite");
  }
  return res.json();
}

export async function removeFavorite(universityId) {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");
  const res = await fetch(apiUrl(`/api/v1/students/favorite-universities/${universityId}`), {
    method: "DELETE",
    headers: jsonHeaders(token),
  });
  if (res.status === 204) return;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to remove favorite");
  }
}
