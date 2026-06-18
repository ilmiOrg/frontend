import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useTranslation } from "../../../hooks/useLanguage";
import styles from "./style.module.css";

/**
 * Real 404 — replaces the old silent catch-all redirect to "/". Sends the user
 * somewhere useful (dashboard if signed in, home otherwise) instead of guessing.
 */
const NotFoundPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const dest = isAuthenticated ? "/dashboard" : "/";

  return (
    <div className={styles.container}>
      <div className={styles.code}>404</div>
      <h1 className={styles.title}>{t("notFoundTitle")}</h1>
      <p className={styles.message}>{t("notFoundMessage")}</p>
      <button
        type="button"
        onClick={() => navigate(dest)}
        className={styles.button}
      >
        {isAuthenticated ? t("notFoundBackDashboard") : t("notFoundBackHome")}
      </button>
    </div>
  );
};

export default NotFoundPage;
