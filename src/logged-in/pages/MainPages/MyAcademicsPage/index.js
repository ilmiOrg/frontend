import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageTemplate from "../../../shared/PageTemplate";
import { BookOpenIcon } from "../../../shared/Icons";
import { useAuth } from "../../../../contexts/AuthContext";
import { useTranslation } from "../../../../hooks/useLanguage";
import {
  getTranscripts,
  getExams,
  deleteTranscript,
  deleteExam,
} from "../../../../api/academics";
import s from "../../../shared/ContentPage/style.module.css";
import m from "./style.module.css";

const pretty = (v) =>
  String(v || "")
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const MyAcademicsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const isGuest = user?.isGuest === true;

  const [transcripts, setTranscripts] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [t, e] = await Promise.all([getTranscripts(), getExams()]);
      setTranscripts(Array.isArray(t) ? t : []);
      setExams(Array.isArray(e) ? e : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && !isGuest) load();
    else setLoading(false);
  }, [isAuthenticated, isGuest, load]);

  const removeTranscript = async (id) => {
    setBusy(id);
    try {
      await deleteTranscript(id);
      setTranscripts((rows) => rows.filter((r) => r.transcriptId !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(null);
    }
  };

  const removeExam = async (id) => {
    setBusy(id);
    try {
      await deleteExam(id);
      setExams((rows) => rows.filter((r) => r.examId !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(null);
    }
  };

  if (isGuest) {
    return (
      <PageTemplate icon={<BookOpenIcon size={22} />} title={t("dashMyAcademics")}
        description={t("myAcademicsGuestDesc")}>
        <div className={s.layout}>
          <p className={s.emptyState}>{t("myAcademicsGuestEmptyBefore")}<Link to="/register">{t("matchGuestSignUp")}</Link>{t("myAcademicsGuestEmptyAfter")}</p>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate
      icon={<BookOpenIcon size={22} />}
      title={t("dashMyAcademics")}
      description={t("myAcademicsDesc")}
    >
      <div className={s.layout}>
        {error ? <p className={m.error}>{error}</p> : null}

        <div className={m.headRow}>
          <h3 className={s.sectionLabel}>{t("myAcademicsTranscripts")}</h3>
          <Link to="/dashboard/ai/match-universities" className={m.addLink}>{t("myAcademicsAddViaMatching")}</Link>
        </div>
        {loading ? (
          <p className={s.emptyState}>{t("myAcademicsLoading")}</p>
        ) : transcripts.length === 0 ? (
          <p className={s.emptyState}>
            {t("myAcademicsNoTranscriptsBefore")}
            <Link to="/dashboard/ai/match-universities">{t("myAcademicsMatchingPage")}</Link>{t("myAcademicsNoTranscriptsAfter")}
          </p>
        ) : (
          <div className={m.list}>
            {transcripts.map((t) => (
              <div className={s.contentCard} key={t.transcriptId}>
                <div className={s.cardHeader}>
                  <div>
                    <h4 className={s.cardTitle}>
                      {pretty(t.degree)} · {pretty(t.gradingSystem)}
                    </h4>
                    <p className={s.cardDesc}>
                      {t.institutionName}
                      {t.fromYear ? ` · ${t.fromYear}–${t.toYear}` : ""} · GPA{" "}
                      {Math.round((t.averageNormalizedScore || 0) * 100)}/100
                    </p>
                  </div>
                  <button
                    type="button"
                    className={m.removeBtn}
                    disabled={busy === t.transcriptId}
                    onClick={() => removeTranscript(t.transcriptId)}
                  >
                    {t("appsRemove")}
                  </button>
                </div>
                {Array.isArray(t.subjects) && t.subjects.length > 0 && (
                  <div className={m.chips}>
                    {t.subjects.map((sub) => (
                      <span key={sub.subjectTranscriptId} className={s.metaBadge}>
                        {sub.subjectName}: {sub.rawScore}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <hr className={s.divider} />

        <h3 className={s.sectionLabel}>{t("myAcademicsExams")}</h3>
        {loading ? null : exams.length === 0 ? (
          <p className={s.emptyState}>{t("myAcademicsNoExams")}</p>
        ) : (
          <div className={m.list}>
            {exams.map((e) => (
              <div className={s.contentCard} key={e.examId}>
                <div className={s.cardHeader}>
                  <div>
                    <h4 className={s.cardTitle}>{pretty(e.examType)}</h4>
                    <p className={s.cardDesc}>
                      {t("matchScore")} {String(e.score)}
                      {e.maxScore ? ` / ${String(e.maxScore)}` : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    className={m.removeBtn}
                    disabled={busy === e.examId}
                    onClick={() => removeExam(e.examId)}
                  >
                    {t("appsRemove")}
                  </button>
                </div>
                {Array.isArray(e.sections) && e.sections.length > 0 && (
                  <div className={m.chips}>
                    {e.sections.map((sec) => (
                      <span key={sec.examSectionId} className={s.metaBadge}>
                        {sec.sectionName}: {String(sec.grade)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </PageTemplate>
  );
};

export default MyAcademicsPage;
