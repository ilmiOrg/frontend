import { request, getToken } from "./config";

/**
 * Student academic record — transcripts and exam results. These feed the
 * deterministic matching engine. All endpoints resolve the student from the JWT.
 */

export async function addTranscript(payload) {
  if (!getToken()) throw new Error("Not authenticated");
  return request("/api/v1/students/transcripts", {
    method: "POST",
    auth: true,
    body: payload,
    errorMessage: "Failed to save transcript",
  });
}

export async function getTranscripts() {
  if (!getToken()) return [];
  return request("/api/v1/students/transcripts", {
    auth: true,
    errorMessage: "Failed to fetch transcripts",
  });
}

export async function addExam(payload) {
  if (!getToken()) throw new Error("Not authenticated");
  return request("/api/v1/students/exams", {
    method: "POST",
    auth: true,
    body: payload,
    errorMessage: "Failed to save exam",
  });
}

export async function getExams() {
  if (!getToken()) return [];
  return request("/api/v1/students/exams", {
    auth: true,
    errorMessage: "Failed to fetch exams",
  });
}

export async function deleteTranscript(id) {
  if (!getToken()) throw new Error("Not authenticated");
  return request(`/api/v1/students/transcripts/${id}`, {
    method: "DELETE",
    auth: true,
    errorMessage: "Failed to delete transcript",
  });
}

export async function deleteExam(id) {
  if (!getToken()) throw new Error("Not authenticated");
  return request(`/api/v1/students/exams/${id}`, {
    method: "DELETE",
    auth: true,
    errorMessage: "Failed to delete exam",
  });
}
