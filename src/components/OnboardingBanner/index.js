import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "../../hooks/useLanguage";
import { getTranscripts } from "../../api/academics";
import styles from "./style.module.css";

/**
 * First-run nudge: when a signed-in student has no academic record yet, their
 * dashboard would otherwise be empty (no matches, no chances). This points them
 * straight at the one action that unlocks the product. Hides once they have data
 * or dismiss it for the session. No-op for guests.
 */
const OnboardingBanner = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const isGuest = user?.isGuest === true;
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || isGuest) return undefined;
    if (sessionStorage.getItem("onboardingDismissed") === "true") return undefined;
    let cancelled = false;
    (async () => {
      try {
        const transcripts = await getTranscripts();
        if (!cancelled && (!Array.isArray(transcripts) || transcripts.length === 0)) {
          setShow(true);
        }
      } catch (_) {
        // ignore — don't block the dashboard on this
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isGuest]);

  if (!show) return null;

  return (
    <div className={styles.banner} role="region" aria-label={t("onboardingRegionLabel")}>
      <div className={styles.text}>
        <strong className={styles.title}>{t("onboardingTitle")}</strong>
        <span className={styles.sub}>
          {t("onboardingSub")}
        </span>
      </div>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.cta}
          onClick={() => navigate("/dashboard/ai/match-universities")}
        >
          {t("onboardingCta")}
        </button>
        <button
          type="button"
          className={styles.dismiss}
          aria-label={t("onboardingDismiss")}
          onClick={() => {
            sessionStorage.setItem("onboardingDismissed", "true");
            setShow(false);
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default OnboardingBanner;
