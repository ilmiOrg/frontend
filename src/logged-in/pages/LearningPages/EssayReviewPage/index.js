import React, { useCallback, useEffect, useState } from "react";
import PageTemplate from "../../../shared/PageTemplate";
import { PenToolIcon } from "../../../shared/Icons";
import { useAuth } from "../../../../contexts/AuthContext";
import { getEssayAvailability, reviewEssay } from "../../../../api/essays";
import { useTranslation } from "../../../../hooks/useLanguage";
import s from "../../../shared/ContentPage/style.module.css";
import m from "./style.module.css";

const ESSAY_TYPES = [
  { code: "Personal statement", labelKey: "essayTypePersonalStatement" },
  { code: "Scholarship motivation letter", labelKey: "essayTypeMotivationLetter" },
  { code: "Statement of purpose", labelKey: "essayTypeStatementOfPurpose" },
  { code: "Common App essay", labelKey: "essayTypeCommonApp" },
  { code: "Other", labelKey: "essayTypeOther" },
];

const EssayReviewPage = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const isGuest = user?.isGuest === true;

  const [available, setAvailable] = useState(null); // null = checking
  const [essayText, setEssayText] = useState("");
  const [promptType, setPromptType] = useState(ESSAY_TYPES[0].code);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkAvailability = useCallback(async () => {
    if (!isAuthenticated || isGuest) {
      setAvailable(false);
      return;
    }
    try {
      const r = await getEssayAvailability();
      setAvailable(!!r.available);
    } catch (_) {
      setAvailable(false);
    }
  }, [isAuthenticated, isGuest]);

  useEffect(() => {
    checkAvailability();
  }, [checkAvailability]);

  const submit = async () => {
    if (!essayText.trim()) return;
    setLoading(true);
    setError(null);
    setFeedback("");
    try {
      const r = await reviewEssay({ essayText: essayText.trim(), promptType });
      setFeedback(r.feedback);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTemplate
      icon={<PenToolIcon size={22} />}
      title={t("essayTitle")}
      description={t("essayDesc")}
    >
      <div className={s.layout}>
        {available === false ? (
          <div className={s.introPanel}>
            <h3 className={s.sectionLabel}>{t("essayNotAvailableTitle")}</h3>
            <p className={s.introText}>
              {t("essayNotAvailableText")}
            </p>
          </div>
        ) : (
          <>
            <div className={s.introPanel}>
              <div className={m.typeRow}>
                <label className={m.typeLabel} htmlFor="essay-type">{t("essayTypeLabel")}</label>
                <select
                  id="essay-type"
                  className={m.typeSelect}
                  value={promptType}
                  onChange={(e) => setPromptType(e.target.value)}
                >
                  {ESSAY_TYPES.map((et) => (
                    <option key={et.code} value={et.code}>{t(et.labelKey)}</option>
                  ))}
                </select>
              </div>
              <textarea
                className={m.textarea}
                rows={12}
                placeholder={t("essayPlaceholder")}
                value={essayText}
                onChange={(e) => setEssayText(e.target.value)}
                maxLength={12000}
              />
              <div className={m.actionRow}>
                <span className={m.count}>{essayText.length}/12000</span>
                <button
                  type="button"
                  className={s.primaryBtn}
                  disabled={loading || !essayText.trim()}
                  onClick={submit}
                >
                  {loading ? t("essayReviewing") : t("essayGetFeedback")}
                </button>
              </div>
              {error ? <p className={m.error}>{error}</p> : null}
            </div>

            {feedback ? (
              <div className={s.contentCard}>
                <h4 className={s.cardTitle}>{t("essayFeedbackTitle")}</h4>
                <p className={m.feedback}>{feedback}</p>
              </div>
            ) : null}
          </>
        )}
      </div>
    </PageTemplate>
  );
};

export default EssayReviewPage;
