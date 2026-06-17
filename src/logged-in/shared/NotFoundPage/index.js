import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import styles from "./style.module.css";

/**
 * Real 404 — replaces the old silent catch-all redirect to "/". Sends the user
 * somewhere useful (dashboard if signed in, home otherwise) instead of guessing.
 */
const NotFoundPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const dest = isAuthenticated ? "/dashboard" : "/";

  return (
    <div className={styles.container}>
      <div className={styles.code}>404</div>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.message}>
        The page you’re looking for doesn’t exist or has moved.
      </p>
      <button
        type="button"
        onClick={() => navigate(dest)}
        className={styles.button}
      >
        {isAuthenticated ? "Back to dashboard" : "Back to home"}
      </button>
    </div>
  );
};

export default NotFoundPage;
