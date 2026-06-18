import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  test("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("a", 300));
    expect(result.current).toBe("a");
  });

  test("only updates after the delay elapses", () => {
    const { result, rerender } = renderHook(({ v }) => useDebounce(v, 300), {
      initialProps: { v: "a" },
    });

    rerender({ v: "ab" });
    rerender({ v: "abc" });
    // before the delay, still the original value (no intermediate updates)
    expect(result.current).toBe("a");

    act(() => jest.advanceTimersByTime(300));
    expect(result.current).toBe("abc");
  });

  test("resets the timer on rapid changes (debounces)", () => {
    const { result, rerender } = renderHook(({ v }) => useDebounce(v, 300), {
      initialProps: { v: "x" },
    });

    rerender({ v: "xy" });
    act(() => jest.advanceTimersByTime(200));
    rerender({ v: "xyz" });
    act(() => jest.advanceTimersByTime(200)); // 200ms since last change < 300ms
    expect(result.current).toBe("x");

    act(() => jest.advanceTimersByTime(100)); // now 300ms since last change
    expect(result.current).toBe("xyz");
  });
});
