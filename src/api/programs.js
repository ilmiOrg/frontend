import { request, getToken } from "./config";

/**
 * Backend exposes program categories only as the `Field` enum on each Program
 * (no GET /api/v1/programs/categories route exists in master). Mirror the
 * enum as a client-side catalog so the filter UI still works. Shape matches
 * what the page expects: { categoryId, categoryName }.
 */
const PROGRAM_CATEGORIES = [
  { categoryId: "COMPUTER_SCIENCE", categoryName: "Computer Science & IT" },
  { categoryId: "ENGINEERING", categoryName: "Engineering" },
  { categoryId: "MEDICINE", categoryName: "Medicine & Health" },
  { categoryId: "LAW", categoryName: "Law" },
  { categoryId: "BUSINESS", categoryName: "Business & Management" },
  { categoryId: "ECONOMICS", categoryName: "Economics" },
  { categoryId: "MATHEMATICS", categoryName: "Mathematics" },
  { categoryId: "PHYSICS", categoryName: "Physics" },
  { categoryId: "BIOLOGY", categoryName: "Biology" },
  { categoryId: "CHEMISTRY", categoryName: "Chemistry" },
  { categoryId: "HUMANITIES", categoryName: "Humanities" },
  { categoryId: "SOCIAL_SCIENCES", categoryName: "Social Sciences" },
  { categoryId: "ARTS", categoryName: "Arts & Design" },
  { categoryId: "EDUCATION", categoryName: "Education" },
  { categoryId: "ARCHITECTURE", categoryName: "Architecture" },
];

export async function getProgramCategories() {
  return PROGRAM_CATEGORIES;
}

export async function searchPrograms(params = {}) {
  return request("/api/v1/programs", {
    query: params,
    errorMessage: "Failed to fetch programs",
  });
}

export async function getProgramById(id) {
  return request(`/api/v1/programs/${id}`, {
    errorMessage: "Program not found",
  });
}

export async function getFavoritePrograms() {
  if (!getToken()) return [];
  return request("/api/v1/students/favorite-programs", {
    auth: true,
    errorMessage: "Failed to fetch favorite programs",
  });
}

export async function addFavoriteProgram(programId) {
  if (!getToken()) throw new Error("Not authenticated");
  return request(`/api/v1/students/favorite-programs/${programId}`, {
    method: "POST",
    auth: true,
    errorMessage: "Failed to add favorite program",
  });
}

export async function removeFavoriteProgram(programId) {
  if (!getToken()) throw new Error("Not authenticated");
  return request(`/api/v1/students/favorite-programs/${programId}`, {
    method: "DELETE",
    auth: true,
    errorMessage: "Failed to remove favorite program",
  });
}
