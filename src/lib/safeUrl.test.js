import { isSafeHttpUrl } from "./safeUrl";

describe("isSafeHttpUrl", () => {
  test("accepts absolute http(s) URLs", () => {
    expect(isSafeHttpUrl("http://example.com")).toBe(true);
    expect(isSafeHttpUrl("https://example.com/jobs?x=1")).toBe(true);
  });

  test("rejects non-http schemes (xss vectors)", () => {
    expect(isSafeHttpUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeHttpUrl("data:text/html,<script>")).toBe(false);
    expect(isSafeHttpUrl("file:///etc/passwd")).toBe(false);
  });

  test("rejects relative and protocol-relative URLs (open-redirect vectors)", () => {
    expect(isSafeHttpUrl("//evil.com")).toBe(false);
    expect(isSafeHttpUrl("/jobs/123")).toBe(false);
    expect(isSafeHttpUrl("example.com")).toBe(false);
  });

  test("rejects empty / non-string input", () => {
    expect(isSafeHttpUrl("")).toBe(false);
    expect(isSafeHttpUrl("   ")).toBe(false);
    expect(isSafeHttpUrl(null)).toBe(false);
    expect(isSafeHttpUrl(undefined)).toBe(false);
    expect(isSafeHttpUrl(42)).toBe(false);
  });
});
