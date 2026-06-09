import { request, getToken } from "./config";

/** Whether AI essay review is configured on this environment. */
export async function getEssayAvailability() {
  if (!getToken()) return { available: false };
  return request("/api/v1/students/essays/availability", {
    auth: true,
    errorMessage: "Failed to check availability",
  });
}

/** Submit an essay for AI feedback. Throws on 503 when AI isn't configured. */
export async function reviewEssay({ essayText, promptType }) {
  if (!getToken()) throw new Error("Not authenticated");
  return request("/api/v1/students/essays/review", {
    method: "POST",
    auth: true,
    body: { essayText, promptType },
    errorMessage: "Essay review failed",
  });
}
