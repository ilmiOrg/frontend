/**
 * Local-only student profile.
 *
 * Backend `master` has no GET/PUT /api/v1/students/me/profile route — the
 * only persisted identity is the JWT payload (email). Until a profile
 * endpoint exists, store editable profile data in localStorage so the
 * Profile page keeps working end-to-end without 403s.
 */

const PROFILE_KEY = "studentProfile";
const AUTH_EMAIL_KEY = "userEmail";

function readEmailFromAuth() {
  if (typeof localStorage === "undefined") return "";
  return localStorage.getItem(AUTH_EMAIL_KEY) || "";
}

function readStored() {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

function emptyProfile() {
  return {
    firstName: "",
    lastName: "",
    phone: "",
    location: "",
    photoUrl: "",
    certifications: "",
  };
}

export async function getStudentProfile() {
  const stored = readStored() || emptyProfile();
  return { ...stored, email: readEmailFromAuth() };
}

export async function updateStudentProfile(payload) {
  if (typeof localStorage === "undefined") {
    throw new Error("Storage unavailable");
  }
  const merged = { ...(readStored() || emptyProfile()), ...payload };
  delete merged.email;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(merged));
  return { ...merged, email: readEmailFromAuth() };
}
