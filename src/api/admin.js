import { request, apiUrl, getToken } from "./config";

/**
 * Bulk-upload a CSV of records of one type into staging (multipart). Returns the
 * ingest result { received, inserted, updated, skipped }. Records land PENDING.
 */
export async function ingestCsv(type, file) {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");
  const form = new FormData();
  form.append("type", type);
  form.append("file", file);
  // No Content-Type header — the browser sets the multipart boundary.
  const res = await fetch(apiUrl("/api/v1/admin/scraping/ingest-csv"), {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const text = await res.text();
  if (!res.ok) {
    let message = `Upload failed (${res.status})`;
    try {
      const data = JSON.parse(text);
      if (data && data.message) message = data.message;
    } catch (_) {
      if (text) message = text;
    }
    throw new Error(message);
  }
  return text ? JSON.parse(text) : null;
}

/** Admin scraping-review API (ROLE_ADMIN). filters: { type, status } */
export async function getStagedRecords(filters = {}) {
  return request("/api/v1/admin/scraping", {
    auth: true,
    query: filters,
    errorMessage: "Failed to load staged records",
  });
}

export async function approveStaged(id) {
  return request(`/api/v1/admin/scraping/${id}/approve`, {
    method: "POST",
    auth: true,
    errorMessage: "Failed to approve record",
  });
}

export async function rejectStaged(id) {
  return request(`/api/v1/admin/scraping/${id}/reject`, {
    method: "POST",
    auth: true,
    errorMessage: "Failed to reject record",
  });
}
