import { apiUrl, jsonHeaders } from "./config";

const AUTH_TOKEN_KEY = "token";

function getToken() {
  return typeof localStorage !== "undefined"
    ? localStorage.getItem(AUTH_TOKEN_KEY)
    : null;
}

export async function getStudentProfile() {
  const token = getToken();
  if (!token) {
    throw new Error("Not authenticated");
  }
  const res = await fetch(apiUrl("/api/v1/students/me/profile"), {
    method: "GET",
    headers: jsonHeaders(token),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to load profile");
  }
  return res.json();
}

export async function updateStudentProfile(payload) {
  const token = getToken();
  if (!token) {
    throw new Error("Not authenticated");
  }
  const res = await fetch(apiUrl("/api/v1/students/me/profile"), {
    method: "PUT",
    headers: jsonHeaders(token),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to save profile");
  }
  return res.json();
}
