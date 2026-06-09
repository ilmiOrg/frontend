/**
 * Frontend error monitoring (Sentry), bundle-lean: @sentry/react is dynamically
 * imported only when REACT_APP_SENTRY_DSN is set at build time, so a no-DSN build
 * (dev/local) pays no initial-bundle cost. Both functions are safe no-ops otherwise.
 */
const DSN = process.env.REACT_APP_SENTRY_DSN;

let sentryPromise = null;
function loadSentry() {
  if (!DSN) return null;
  if (!sentryPromise) {
    sentryPromise = import("@sentry/react").catch(() => null);
  }
  return sentryPromise;
}

export function initErrorMonitoring() {
  const p = loadSentry();
  if (!p) return;
  p.then((Sentry) => {
    if (!Sentry) return;
    Sentry.init({
      dsn: DSN,
      environment: process.env.REACT_APP_ENV || "production",
      tracesSampleRate: 0,
    });
  });
}

export function captureError(error, extra) {
  const p = loadSentry();
  if (!p) return;
  p.then((Sentry) => {
    if (Sentry) Sentry.captureException(error, extra ? { extra } : undefined);
  });
}
