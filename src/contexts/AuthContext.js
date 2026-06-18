import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { login as apiLogin, register as apiRegister, logout as apiLogout } from "../api/auth";
import { getStudentProfile } from "../api/studentProfile";

const AUTH_TOKEN_KEY = "token";
const AUTH_REFRESH_KEY = "refreshToken";
const AUTH_EMAIL_KEY = "userEmail";
const AUTH_NAME_KEY = "userName";
const AUTH_GUEST_KEY = "authGuest";

function storeRefreshToken(data) {
  if (data && data.refreshToken) {
    localStorage.setItem(AUTH_REFRESH_KEY, data.refreshToken);
  }
}

/** Guest user shown in UI when using "Continue as guest" (no backend login). */
export const GUEST_USER = {
  email: "guest@ilmi.demo",
  name: "Guest",
  isGuest: true,
  role: "STUDENT",
};

/** Decode JWT claims without verifying (UI gating only — the backend enforces). */
function decodeClaims(token) {
  try {
    const part = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(part)) || {};
  } catch (_) {
    return {};
  }
}

function decodeRole(token) {
  return decodeClaims(token).role || "STUDENT";
}

/** True when the JWT carries an `exp` claim that is already in the past. */
function isTokenExpired(token) {
  const exp = decodeClaims(token).exp;
  if (typeof exp !== "number") return false; // no exp claim → let the server decide
  return Date.now() >= exp * 1000;
}

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const email = localStorage.getItem(AUTH_EMAIL_KEY);
    const isGuest = localStorage.getItem(AUTH_GUEST_KEY) === "true";
    if (isGuest) {
      setIsAuthenticated(true);
      setUser({ ...GUEST_USER });
    } else if (token && email && !isTokenExpired(token)) {
      const name = localStorage.getItem(AUTH_NAME_KEY) || email.split("@")[0];
      setIsAuthenticated(true);
      setUser({ email, name, isGuest: false, role: decodeRole(token) });
      // Validate the locally-trusted token against the server (optimistically, without
      // blocking render). If it was revoked/invalidated, the request 401s and the shared
      // request() handler clears the session and redirects to /login — so a reload can't
      // keep rendering protected content with a dead token. Network errors are ignored.
      getStudentProfile().catch(() => {});
    } else if (token) {
      // Stale/expired token — clear it so the app starts in a clean logged-out state.
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_REFRESH_KEY);
      localStorage.removeItem(AUTH_EMAIL_KEY);
      localStorage.removeItem(AUTH_NAME_KEY);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    localStorage.removeItem(AUTH_GUEST_KEY);
    const data = await apiLogin(email, password);
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    storeRefreshToken(data);
    localStorage.setItem(AUTH_EMAIL_KEY, data.email);
    const name = data.name?.trim() || data.email?.split("@")[0];
    if (data.name?.trim()) localStorage.setItem(AUTH_NAME_KEY, data.name.trim());
    else localStorage.removeItem(AUTH_NAME_KEY);
    setIsAuthenticated(true);
    setUser({
      email: data.email,
      name,
      isGuest: false,
      role: decodeRole(data.token),
    });
    return { success: true };
  }, []);

  /** Bypass login: enter app as guest (no backend). Use "Get started" or "Continue as guest". */
  const loginAsGuest = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_EMAIL_KEY);
    localStorage.setItem(AUTH_GUEST_KEY, "true");
    setIsAuthenticated(true);
    setUser({ ...GUEST_USER });
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    apiLogout(); // fire-and-forget: revoke the access + refresh tokens server-side
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_REFRESH_KEY);
    localStorage.removeItem(AUTH_EMAIL_KEY);
    localStorage.removeItem(AUTH_NAME_KEY);
    localStorage.removeItem(AUTH_GUEST_KEY);
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const register = useCallback(async (userData) => {
    localStorage.removeItem(AUTH_GUEST_KEY);
    const data = await apiRegister(userData);
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    storeRefreshToken(data);
    localStorage.setItem(AUTH_EMAIL_KEY, data.email);
    const fullName = [userData.firstName, userData.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();
    const name = fullName || data.email?.split("@")[0];
    if (fullName) localStorage.setItem(AUTH_NAME_KEY, fullName);
    else localStorage.removeItem(AUTH_NAME_KEY);
    setIsAuthenticated(true);
    setUser({
      email: data.email,
      name,
      isGuest: false,
      role: decodeRole(data.token),
    });
    return { success: true };
  }, []);

  // Memoized so the context value keeps a stable identity across renders; otherwise every
  // useAuth() consumer (the whole logged-in app) re-renders on each provider render. The
  // callbacks are already useCallback-stable, so the value only changes with auth state.
  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      login,
      loginAsGuest,
      logout,
      register,
      user,
      isAdmin: user?.role === "ADMIN",
    }),
    [isAuthenticated, isLoading, login, loginAsGuest, logout, register, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
