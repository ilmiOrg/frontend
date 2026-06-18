import { searchPrograms, getProgramById } from "./programs";

// Regression guard: program reads must send the Bearer token. Without it the backend
// returns 403 (programs require auth) and the page silently breaks.
describe("api/programs auth", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("token", "tok123");
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      ok: true,
      text: async () => JSON.stringify([]),
    });
  });

  test("searchPrograms sends the Authorization header", async () => {
    await searchPrograms({});
    const [, opts] = global.fetch.mock.calls[0];
    expect(opts.headers.Authorization).toBe("Bearer tok123");
  });

  test("getProgramById sends the Authorization header", async () => {
    await getProgramById("p1");
    const [, opts] = global.fetch.mock.calls[0];
    expect(opts.headers.Authorization).toBe("Bearer tok123");
  });
});
