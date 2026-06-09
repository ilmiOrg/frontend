import toast from "react-hot-toast";

/**
 * Backend API base URL.
 * In development: run backend on port 8082 and set REACT_APP_API_URL=http://localhost:8082
 * (or leave unset to use this default).
 */
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8082";

/** Global error toast for transport/server faults (domain 4xx are shown inline by pages). */
function notifyError(message) {
  try {
    toast.error(message);
  } catch (_) {
    // toast not mounted (e.g. tests) — ignore
  }
}

/**
 * Build full URL for an API path (e.g. '/api/v1/auth/login' -> 'http://localhost:8082/api/v1/auth/login').
 */
export function apiUrl(path) {
  const base = API_BASE_URL.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

/**
 * Default headers for JSON requests. Pass getToken() for authenticated requests.
 */
export function jsonHeaders(token = null) {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

const AUTH_TOKEN_KEY = "token";

/** Auth token from storage (null when unset / no localStorage). */
export function getToken() {
  return typeof localStorage !== "undefined"
    ? localStorage.getItem(AUTH_TOKEN_KEY)
    : null;
}

/**
 * Shared fetch wrapper for the standard JSON API pattern. Centralizes URL/query
 * building, auth header injection, and error extraction so individual modules
 * don't repeat the boilerplate.
 *
 * @param {string} path API path (e.g. "/api/v1/students/matches")
 * @param {Object} [opts]
 * @param {string} [opts.method="GET"]
 * @param {boolean} [opts.auth=false] attach the Bearer token
 * @param {*} [opts.body] JSON-serialized into the request body
 * @param {Object} [opts.query] query params (arrays append multiple values; null/""/undefined skipped)
 * @param {string} [opts.errorMessage] fallback message when the server sends no body
 * @returns {Promise<*>} parsed JSON, or null for empty / 204 responses
 */
export async function request(
  path,
  { method = "GET", auth = false, body, query, errorMessage } = {}
) {
  let url = apiUrl(path);
  if (query) {
    const u = new URL(url);
    Object.entries(query).forEach(([key, val]) => {
      if (val === null || val === undefined || val === "") return;
      if (Array.isArray(val)) val.forEach((v) => u.searchParams.append(key, v));
      else u.searchParams.append(key, val);
    });
    url = u.toString();
  }

  const token = auth ? getToken() : null;
  let res;
  try {
    res = await fetch(url, {
      method,
      headers: jsonHeaders(token),
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  } catch (networkErr) {
    // Server unreachable / offline — surface a global toast and rethrow.
    notifyError("Can’t reach the server. Check your connection and try again.");
    throw new Error("Network error — could not reach the server.");
  }

  if (res.status === 204) return null;

  const text = await res.text();
  if (!res.ok) {
    let message = errorMessage || `Request failed (${res.status})`;
    try {
      const data = JSON.parse(text);
      if (data && data.message) message = data.message;
      else if (text) message = text;
    } catch (_) {
      if (text) message = text;
    }
    // 5xx is an unexpected server fault — toast it globally. Domain 4xx are left for
    // the calling page to show inline (avoids double-reporting).
    if (res.status >= 500) {
      notifyError("Something went wrong on our side. Please try again.");
    }
    throw new Error(message);
  }

  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (_) {
    return text;
  }
}
