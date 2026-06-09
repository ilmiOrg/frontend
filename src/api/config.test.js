import { request, jsonHeaders } from "./config";

describe("api/config request()", () => {
  beforeEach(() => {
    localStorage.clear();
    global.fetch = jest.fn();
  });

  const mockResponse = ({ status = 200, ok = true, body = "" }) => ({
    status,
    ok,
    text: async () => (typeof body === "string" ? body : JSON.stringify(body)),
  });

  test("injects the bearer token when auth:true and a token is stored", async () => {
    localStorage.setItem("token", "tok123");
    global.fetch.mockResolvedValue(mockResponse({ body: { ok: true } }));

    await request("/api/v1/students/matches", { auth: true });

    const [, opts] = global.fetch.mock.calls[0];
    expect(opts.headers.Authorization).toBe("Bearer tok123");
  });

  test("omits Authorization when auth is not requested", async () => {
    localStorage.setItem("token", "tok123");
    global.fetch.mockResolvedValue(mockResponse({ body: { ok: true } }));

    await request("/api/v1/countries");

    const [, opts] = global.fetch.mock.calls[0];
    expect(opts.headers.Authorization).toBeUndefined();
  });

  test("throws the server's message on a non-ok response", async () => {
    global.fetch.mockResolvedValue(
      mockResponse({ status: 404, ok: false, body: { message: "Program not found" } })
    );
    await expect(request("/api/v1/x")).rejects.toThrow("Program not found");
  });

  test("returns null on 204 No Content", async () => {
    global.fetch.mockResolvedValue(mockResponse({ status: 204, ok: true }));
    await expect(request("/api/v1/x", { method: "DELETE" })).resolves.toBeNull();
  });

  test("appends query params, skipping null/empty", async () => {
    global.fetch.mockResolvedValue(mockResponse({ body: [] }));
    await request("/api/v1/jobs", { query: { field: "ENGINEERING", degree: null, q: "" } });
    const [url] = global.fetch.mock.calls[0];
    expect(url).toContain("field=ENGINEERING");
    expect(url).not.toContain("degree=");
    expect(url).not.toContain("q=");
  });
});

describe("api/config jsonHeaders()", () => {
  test("adds Authorization only when a token is passed", () => {
    expect(jsonHeaders().Authorization).toBeUndefined();
    expect(jsonHeaders("abc").Authorization).toBe("Bearer abc");
  });
});
