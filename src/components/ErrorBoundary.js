import React from "react";
import { captureError } from "../lib/errorMonitor";
import { translate } from "../hooks/useLanguage";
import styles from "./ErrorBoundary.module.css";

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
      <div role="alert" className={styles.fallback}>
        <h1 className={styles.title}>{translate("errorBoundaryTitle")}</h1>
        <p className={styles.message}>{translate("errorBoundaryMessage")}</p>
        <button
          type="button"
          onClick={this.handleReload}
          className={styles.reloadButton}
        >
          {translate("errorBoundaryReload")}
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;
