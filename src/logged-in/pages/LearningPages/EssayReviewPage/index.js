import React, { useCallback, useEffect, useState } from "react";
import PageTemplate from "../../../shared/PageTemplate";
import { PenToolIcon } from "../../../shared/Icons";
import { useAuth } from "../../../../contexts/AuthContext";
import { getEssayAvailability, reviewEssay } from "../../../../api/essays";
import s from "../../../shared/ContentPage/style.module.css";
import m from "./style.module.css";

const ESSAY_TYPES = [
  "Personal statement",
  "Scholarship motivation letter",
  "Statement of purpose",
  "Common App essay",
  "Other",
];

const EssayReviewPage = () => {
  const { user, isAuthenticated } = useAuth();
  const isGuest = user?.isGuest === true;

  const [available, setAvailable] = useState(null); // null = checking
  const [essayText, setEssayText] = useState("");
  const [promptType, setPromptType] = useState(ESSAY_TYPES[0]);
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
      title="Essay Review"
      description="Paste your application essay and get AI feedback tuned for Central-Asian ESL applicants."
    >
      <div className={s.layout}>
        {available === false ? (
          <div className={s.introPanel}>
            <h3 className={s.sectionLabel}>Not available yet</h3>
            <p className={s.introText}>
              AI essay review isn’t enabled on this environment yet. Check back soon — when it’s on,
              you’ll be able to paste an essay here and get structured feedback.
            </p>
          </div>
        ) : (
          <>
            <div className={s.introPanel}>
              <div className={m.typeRow}>
                <label className={m.typeLabel}>Essay type</label>
                <select
                  className={m.typeSelect}
                  value={promptType}
                  onChange={(e) => setPromptType(e.target.value)}
                >
                  {ESSAY_TYPES.map((tName) => (
                    <option key={tName} value={tName}>{tName}</option>
                  ))}
                </select>
              </div>
              <textarea
                className={m.textarea}
                rows={12}
                placeholder="Paste your essay here…"
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
                  {loading ? "Reviewing…" : "Get feedback"}
                </button>
              </div>
              {error ? <p className={m.error}>{error}</p> : null}
            </div>

            {feedback ? (
              <div className={s.contentCard}>
                <h4 className={s.cardTitle}>AI feedback</h4>
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
