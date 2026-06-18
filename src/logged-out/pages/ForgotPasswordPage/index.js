import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../../hooks/useLanguage";
import { requestPasswordReset } from "../../../api/auth";
import styles from "../LoginPage/style.module.css";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(err.message || t("forgotError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles["login-page"] || styles.loginPage}>
      <div className={styles["login-container"] || styles.loginContainer}>
        <div className={styles["login-card"] || styles.loginCard}>
          <div className={styles["login-header"] || styles.loginHeader}>
            <h1 className={styles.logo}>ilmi</h1>
            <p className={styles.subtitle}>{t("forgotSubtitle")}</p>
          </div>

          {error && (
            <div className={styles.errorMessage} role="alert">
              {error}
            </div>
          )}

          {sent ? (
            <p className={styles.subtitle}>{t("forgotSent")}</p>
          ) : (
            <form onSubmit={handleSubmit} className={styles["login-form"] || styles.loginForm}>
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.formLabel}>
                  {t("loginEmailLabel")}
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.formInput}
                  placeholder={t("loginEmailPlaceholder")}
                  required
                />
              </div>
              <button type="submit" className={styles.loginButton} disabled={isLoading}>
                {isLoading ? t("loginSubmitting") : t("forgotSubmit")}
              </button>
            </form>
          )}

          <div className={styles["login-footer"] || styles.loginFooter}>
            <p className={styles.guestRow}>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className={styles.linkButton}
              >
                {t("forgotBackToLogin")}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
