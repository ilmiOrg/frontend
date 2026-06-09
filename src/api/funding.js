import { request, getToken } from "./config";

/**
 * Itemized budget (funding sources). The summed amount drives the student's
 * maxBudget used by matching. Response: { sources:[{id,label,amount,currency}],
 * totalBudget, currency }.
 */
export async function getFunding() {
  if (!getToken()) throw new Error("Not authenticated");
  return request("/api/v1/students/funding-sources", {
    auth: true,
    errorMessage: "Failed to load funding",
  });
}

export async function addFundingSource({ label, amount, currency }) {
  if (!getToken()) throw new Error("Not authenticated");
  return request("/api/v1/students/funding-sources", {
    method: "POST",
    auth: true,
    body: { label, amount, currency },
    errorMessage: "Failed to add funding source",
  });
}

export async function deleteFundingSource(id) {
  if (!getToken()) throw new Error("Not authenticated");
  return request(`/api/v1/students/funding-sources/${id}`, {
    method: "DELETE",
    auth: true,
    errorMessage: "Failed to remove funding source",
  });
}
