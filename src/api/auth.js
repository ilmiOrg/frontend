import { apiUrl, jsonHeaders, API_BASE_URL, getToken, request } from "./config";

/** Ask the backend to email a reset link. Always resolves (never reveals if the email exists). */
export async function requestPasswordReset(email) {
  return request("/api/v1/auth/password-reset/request", {
    method: "POST",
    body: { email },
    errorMessage: "Could not start password reset.",
  });
}

/** Set a new password using the token from the reset email link. */
export async function confirmPasswordReset(token, newPassword) {
  return request("/api/v1/auth/password-reset/confirm", {
    method: "POST",
    body: { token, newPassword },
    errorMessage: "This reset link is invalid or has expired.",
  });
}

/**
 * Revoke the current token server-side (real logout). Fire-and-forget: failures are
 * swallowed so client-side sign-out always proceeds.
 */
export async function logout() {
  const token = getToken();
  if (!token) return;
  const refreshToken =
    typeof localStorage !== "undefined" ? localStorage.getItem("refreshToken") : null;
  try {
    await fetch(apiUrl("/api/v1/auth/logout"), {
      method: "POST",
      headers: jsonHeaders(token),
      // Sent so the server can revoke the refresh token too (not just the access JWT).
      body: JSON.stringify({ refreshToken }),
    });
  } catch (_) {
    // ignore — local sign-out happens regardless
  }
}

/**
 * Login with email and password.
 * @returns {{ token: string, email: string }}
 */
export async function login(email, password) {
  let res;
  try {
    res = await fetch(apiUrl("/api/v1/auth/login"), {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify({ email, password }),
    });
  } catch (err) {
    throw new Error(
      "Cannot reach server. Is the backend running at " +
        API_BASE_URL +
        '? Use "Continue as guest" to try the app without login.'
    );
  }
  const text = await res.text();
  if (!res.ok) {
    let message = "Login failed";
    if (res.status === 403)
      message =
        'Access denied. Use "Continue as guest" or check backend is running.';
    else if (res.status === 401) message = "Invalid email or password.";
    else {
      try {
        const data = JSON.parse(text);
        if (data.message) message = data.message;
      } catch (_) {
        if (text) message = text.slice(0, 200);
      }
    }
    throw new Error(message);
  }
  try {
    return JSON.parse(text);
  } catch (_) {
    throw new Error("Invalid response from server");
  }
}

/**
 * Register a new user.
 * @param {{ email: string, password: string, firstName: string, lastName: string, countryId: string }} userData
 * @returns {{ token: string, email: string }}
 */
export async function register(userData) {
  let res;
  try {
    res = await fetch(apiUrl("/api/v1/auth/register"), {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify(userData),
    });
  } catch (err) {
    throw new Error(
      'Cannot reach backend. Start the backend or use "Continue as guest".'
    );
  }
  const text = await res.text();
  if (!res.ok) {
    let message = "Registration failed";
    try {
      const data = JSON.parse(text);
      if (data.message) message = data.message;
    } catch (_) {
      if (text) message = text.slice(0, 200);
    }
    throw new Error(message);
  }
  try {
    return JSON.parse(text);
  } catch (_) {
    throw new Error("Invalid response from server");
  }
}
