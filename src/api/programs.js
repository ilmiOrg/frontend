import { apiUrl, jsonHeaders } from "./config";

const AUTH_TOKEN_KEY = "token";

function getToken() {
  return typeof localStorage !== "undefined"
    ? localStorage.getItem(AUTH_TOKEN_KEY)
    : null;
}

export async function getProgramCategories() {
  const res = await fetch(apiUrl("/api/v1/programs/categories"), {
    method: "GET",
    headers: jsonHeaders(),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to fetch program categories");
  }
  return res.json();
}

export async function searchPrograms(params = {}) {
  const url = new URL(apiUrl("/api/v1/programs"));
  Object.entries(params).forEach(([key, val]) => {
    if (val !== null && val !== undefined && val !== "") {
      url.searchParams.append(key, val);
    }
  });
  const res = await fetch(url.toString(), {
    method: "GET",
    headers: jsonHeaders(),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to fetch programs");
  }
  return res.json();
}

export async function getProgramById(id) {
  const res = await fetch(apiUrl(`/api/v1/programs/${id}`), {
    method: "GET",
    headers: jsonHeaders(),
  });
  if (!res.ok) {
    if (res.status === 404) throw new Error("Program not found");
    const text = await res.text();
    throw new Error(text || "Failed to fetch program");
  }
  return res.json();
}

export async function getFavoritePrograms() {
  const token = getToken();
  if (!token) return [];
  const res = await fetch(apiUrl("/api/v1/students/favorite-programs"), {
    method: "GET",
    headers: jsonHeaders(token),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to fetch favorite programs");
  }
  return res.json();
}

export async function addFavoriteProgram(programId) {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");
  const res = await fetch(
    apiUrl(`/api/v1/students/favorite-programs/${programId}`),
    {
      method: "POST",
      headers: jsonHeaders(token),
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to add favorite program");
  }
  return res.json();
}

export async function removeFavoriteProgram(programId) {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");
  const res = await fetch(
    apiUrl(`/api/v1/students/favorite-programs/${programId}`),
    {
      method: "DELETE",
      headers: jsonHeaders(token),
    }
  );
  if (res.status === 204) return;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to remove favorite program");
  }
}
