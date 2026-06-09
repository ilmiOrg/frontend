import React from "react";
import { captureError } from "../lib/errorMonitor";

/**
 * App-level error boundary. A render error anywhere below it shows a recoverable
 * fallback instead of a blank white screen. Wraps the router in App.js.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("Uncaught UI error:", error, info?.componentStack);
    // Reported to Sentry when REACT_APP_SENTRY_DSN is configured (no-op otherwise).
    captureError(error, { componentStack: info?.componentStack });
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.assign("/");
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }
    return (
      <div
        role="alert"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: 24,
          textAlign: "center",
          fontFamily: "var(--font-body, system-ui, sans-serif)",
          background: "var(--surface, #0e0e12)",
          color: "var(--on-surface, #e8e8ea)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.5rem" }}>Something went wrong</h1>
        <p style={{ margin: 0, color: "var(--on-surface-muted, #9a9aa2)", maxWidth: 420 }}>
          An unexpected error interrupted the page. Reloading usually fixes it.
        </p>
        <button
          type="button"
          onClick={this.handleReload}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: "none",
            background: "var(--primary, #6c5ce7)",
            color: "var(--on-primary, #fff)",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Reload ilmi
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;
