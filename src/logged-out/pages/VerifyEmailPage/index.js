import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "../../../hooks/useLanguage";
import { request } from "../../../api/config";
import styles from "../LoginPage/style.module.css";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [status, setStatus] = useState(token ? "verifying" : "notoken");

  useEffect(() => {
    if (!token) return;
    request("/api/v1/auth/verify-email", { method: "POST", body: { token } })
      .then(() => setStatus("ok"))
      .catch(() => setStatus("error"));
  }, [token]);

  const message =
    status === "verifying"
      ? t("verifyVerifying")
      : status === "ok"
      ? t("verifyOk")
      : status === "notoken"
      ? t("resetNoToken")
      : t("verifyError");

  return (
    <div className={styles["login-page"] || styles.loginPage}>
      <div className={styles["login-container"] || styles.loginContainer}>
        <div className={styles["login-card"] || styles.loginCard}>
          <div className={styles["login-header"] || styles.loginHeader}>
            <h1 className={styles.logo}>ilmi</h1>
            <p className={styles.subtitle}>{message}</p>
          </div>
          <button
            type="button"
            className={styles.loginButton}
            onClick={() => navigate("/login")}
          >
            {t("resetGoToLogin")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
