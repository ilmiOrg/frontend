import toast from "react-hot-toast";
import { translate } from "../hooks/useLanguage";

/**
 * Backend API base URL.
 * In development: run backend on port 8081 and set REACT_APP_API_URL=http://localhost:8081
 * (or leave unset to use this default).
 */
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8081";

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
const AUTH_REFRESH_KEY = "refreshToken";

/** Auth token from storage (null when unset / no localStorage). */
export function getToken() {
  return typeof localStorage !== "undefined"
    ? localStorage.getItem(AUTH_TOKEN_KEY)
    : null;
}

function getRefreshToken() {
  return typeof localStorage !== "undefined"
    ? localStorage.getItem(AUTH_REFRESH_KEY)
    : null;
}

// Single-flight: concurrent 401s share one refresh call instead of stampeding /auth/refresh.
let refreshInFlight = null;

/**
 * Exchange the stored refresh token for a fresh access token (rotated). Returns the new access
 * token, or null if there's no refresh token or the server rejects it. Never throws.
 */
function refreshAccessToken() {
  if (refreshInFlight) return refreshInFlight;
  const rt = getRefreshToken();
  if (!rt) return Promise.resolve(null);
  refreshInFlight = fetch(apiUrl("/api/v1/auth/refresh"), {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify({ refreshToken: rt }),
  })
    .then(async (r) => {
      if (!r.ok) return null;
      const data = await r.json().catch(() => null);
      if (data && data.token) {
        try {
          localStorage.setItem(AUTH_TOKEN_KEY, data.token);
          if (data.refreshToken) localStorage.setItem(AUTH_REFRESH_KEY, data.refreshToken);
        } catch (_) {
          /* ignore */
        }
        return data.token;
      }
      return null;
    })
    .catch(() => null)
    .finally(() => {
      refreshInFlight = null;
    });
  return refreshInFlight;
}

/**
 * Session expired / token rejected by the server. Clear local auth and bounce to login.
 * Guarded against redirect loops (no-op when already on the login/register pages).
 */
function handleSessionExpired() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_REFRESH_KEY);
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("authGuest");
  } catch (_) {
    // localStorage unavailable — fall through to redirect
  }
  const path = window.location.pathname;
  if (path !== "/login" && path !== "/register") {
    notifyError(translate("sessionExpiredMessage"));
    window.location.assign("/login");
  }
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

  const doFetch = (tok) =>
    fetch(url, {
      method,
      headers: jsonHeaders(tok),
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });

  let res;
  try {
    res = await doFetch(auth ? getToken() : null);
    // Access token expired on an authenticated call → try a silent refresh once, then retry.
    if (res.status === 401 && auth) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        res = await doFetch(newToken);
      }
    }
  } catch (networkErr) {
    // Server unreachable / offline — surface a global toast and rethrow.
    notifyError(translate("serverUnreachableMessage"));
    throw new Error("Network error — could not reach the server.");
  }

  if (res.status === 204) return null;

  // Still unauthorized after the refresh attempt → end the session cleanly instead of
  // leaving the user on a silently-broken page.
  if (res.status === 401 && auth) {
    handleSessionExpired();
    throw new Error("Session expired. Please sign in again.");
  }

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
      notifyError(translate("serverErrorMessage"));
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
