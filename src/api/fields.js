import { apiUrl, jsonHeaders } from "./config";

export async function getUniversityFields() {
  const res = await fetch(apiUrl("/api/v1/university-fields"), {
    method: "GET",
    headers: jsonHeaders(),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to fetch university fields");
  }
  return res.json();
}
