import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "../../../hooks/useLanguage";
import { confirmPasswordReset } from "../../../api/auth";
import styles from "../LoginPage/style.module.css";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError(t("resetTooShort"));
      return;
    }
    setIsLoading(true);
    try {
      await confirmPasswordReset(token, password);
      setDone(true);
    } catch (err) {
      setError(err.message || t("resetError"));
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
            <p className={styles.subtitle}>{t("resetSubtitle")}</p>
          </div>

          {error && (
            <div className={styles.errorMessage} role="alert">
              {error}
            </div>
          )}

          {!token ? (
            <p className={styles.subtitle}>{t("resetNoToken")}</p>
          ) : done ? (
            <>
              <p className={styles.subtitle}>{t("resetDone")}</p>
              <button
                type="button"
                className={styles.loginButton}
                onClick={() => navigate("/login")}
              >
                {t("resetGoToLogin")}
              </button>
            </>
          ) : (
            <form onSubmit={handleSubmit} className={styles["login-form"] || styles.loginForm}>
              <div className={styles.formGroup}>
                <label htmlFor="newPassword" className={styles.formLabel}>
                  {t("resetNewPasswordLabel")}
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.formInput}
                  placeholder={t("resetNewPasswordPlaceholder")}
                  required
                />
              </div>
              <button type="submit" className={styles.loginButton} disabled={isLoading}>
                {isLoading ? t("loginSubmitting") : t("resetSubmit")}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
