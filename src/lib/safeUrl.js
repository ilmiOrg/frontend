/**
 * True only for absolute http(s) URLs. Used to gate external links built from API data so a
 * stored javascript:/data:/file: URL — or a relative/protocol-relative one like "//evil.com"
 * that the browser would resolve to an attacker domain — can't be turned into a clickable link.
 */
export function isSafeHttpUrl(url) {
  if (typeof url !== "string" || url.trim() === "") return false;
  try {
    // No base: relative ("/x") and protocol-relative ("//x") inputs throw and are rejected;
    // only a fully-qualified URL parses, and we additionally require an http(s) scheme.
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (_) {
    return false;
  }
}
