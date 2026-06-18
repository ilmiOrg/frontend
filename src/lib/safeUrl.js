/**
 * True only for http(s) URLs. Used to gate external links built from API data so a stored
 * javascript:/data:/file: URL can't be turned into a clickable link (open-redirect / XSS).
 */
export function isSafeHttpUrl(url) {
  if (!url) return false;
  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (_) {
    return false;
  }
}
