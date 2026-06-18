/**
 * Turn an ENUM_VALUE into a human label: "COMPUTER_SCIENCE" -> "Computer Science".
 * Shared so the same logic isn't re-implemented per page (was duplicated as
 * prettyEnum/pretty/prettyStatus across several list pages).
 */
export function formatEnum(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
