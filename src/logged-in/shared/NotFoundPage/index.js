import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

/**
 * Real 404 — replaces the old silent catch-all redirect to "/". Sends the user
 * somewhere useful (dashboard if signed in, home otherwise) instead of guessing.
 */
const NotFoundPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const dest = isAuthenticated ? "/dashboard" : "/";

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        padding: 24,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "3rem", fontWeight: 800, color: "var(--primary)" }}>404</div>
      <h1 style={{ margin: 0, fontSize: "1.25rem" }}>Page not found</h1>
      <p style={{ margin: 0, color: "var(--on-surface-muted)", maxWidth: 380 }}>
        The page you’re looking for doesn’t exist or has moved.
      </p>
      <button
        type="button"
        onClick={() => navigate(dest)}
        style={{
          padding: "10px 20px",
          borderRadius: 8,
          border: "none",
          background: "var(--primary)",
          color: "var(--on-primary)",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {isAuthenticated ? "Back to dashboard" : "Back to home"}
      </button>
    </div>
  );
};

export default NotFoundPage;
