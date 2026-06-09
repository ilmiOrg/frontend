import { request, getToken } from "./config";

/**
 * Apply-through tracking for the logged-in student. Backend resolves the student
 * from the JWT — no studentId in the path. An application is:
 *   { applicationId, programId, fieldType, degree, university:{...},
 *     status, deadline, submittedDate, notes, createdAt }
 */

export const APPLICATION_STATUSES = [
  "PLANNING",
  "IN_PROGRESS",
  "SUBMITTED",
  "WAITLISTED",
  "ADMITTED",
  "REJECTED",
  "ENROLLED",
  "WITHDRAWN",
];

export async function getApplications() {
  if (!getToken()) throw new Error("Not authenticated");
  return request("/api/v1/students/applications", {
    auth: true,
    errorMessage: "Failed to load applications",
  });
}

/** body: { programId, status?, deadline?, notes? } */
export async function createApplication(body) {
  if (!getToken()) throw new Error("Not authenticated");
  return request("/api/v1/students/applications", {
    method: "POST",
    auth: true,
    body,
    errorMessage: "Failed to track application",
  });
}

/** body: { status?, deadline?, notes? } — null fields left unchanged */
export async function updateApplication(id, body) {
  if (!getToken()) throw new Error("Not authenticated");
  return request(`/api/v1/students/applications/${id}`, {
    method: "PUT",
    auth: true,
    body,
    errorMessage: "Failed to update application",
  });
}

export async function deleteApplication(id) {
  if (!getToken()) throw new Error("Not authenticated");
  return request(`/api/v1/students/applications/${id}`, {
    method: "DELETE",
    auth: true,
    errorMessage: "Failed to remove application",
  });
}

// ---- per-application checklist ----

export async function getApplicationTasks(applicationId) {
  if (!getToken()) throw new Error("Not authenticated");
  return request(`/api/v1/students/applications/${applicationId}/tasks`, {
    auth: true,
    errorMessage: "Failed to load checklist",
  });
}

export async function addApplicationTask(applicationId, title) {
  if (!getToken()) throw new Error("Not authenticated");
  return request(`/api/v1/students/applications/${applicationId}/tasks`, {
    method: "POST",
    auth: true,
    body: { title },
    errorMessage: "Failed to add task",
  });
}

export async function updateApplicationTask(applicationId, taskId, body) {
  if (!getToken()) throw new Error("Not authenticated");
  return request(`/api/v1/students/applications/${applicationId}/tasks/${taskId}`, {
    method: "PUT",
    auth: true,
    body,
    errorMessage: "Failed to update task",
  });
}

export async function deleteApplicationTask(applicationId, taskId) {
  if (!getToken()) throw new Error("Not authenticated");
  return request(`/api/v1/students/applications/${applicationId}/tasks/${taskId}`, {
    method: "DELETE",
    auth: true,
    errorMessage: "Failed to delete task",
  });
}
