import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageTemplate from "../../../shared/PageTemplate";
import { TargetIcon, GraduationCapIcon } from "../../../shared/Icons";
import { SelectField, NumberField, AccentButton } from "../../../../ui-components";
import { useAuth } from "../../../../contexts/AuthContext";
import { useTranslation } from "../../../../hooks/useLanguage";
import { getMatches } from "../../../../api/matches";
import { addTranscript, addExam } from "../../../../api/academics";
import { getApplications, createApplication } from "../../../../api/applications";
import s from "../../../shared/ContentPage/style.module.css";
import m from "./style.module.css";

// labelKey => localized via t(); proper-noun exams keep a literal label.
const GRADING_OPTIONS = [
  { value: "GPA_4", labelKey: "matchGradingGpa4" },
  { value: "GPA_5", labelKey: "matchGradingGpa5" },
  { value: "FIVE", labelKey: "matchGradingFive" },
  { value: "TEN", labelKey: "matchGradingTen" },
];

const DEGREE_OPTIONS = [
  { value: "HIGH_SCHOOL_DIPLOMA", labelKey: "matchDegreeHighSchool" },
  { value: "ASSOCIATE", labelKey: "matchDegreeAssociate" },
  { value: "BACHELOR", labelKey: "matchDegreeBachelor" },
  { value: "MASTER", labelKey: "matchDegreeMaster" },
  { value: "DOCTORATE", labelKey: "matchDegreeDoctorate" },
];

const EXAM_OPTIONS = [
  { value: "none", labelKey: "matchExamNone" },
  { value: "TOEFL", label: "TOEFL" },
  { value: "IELTS", label: "IELTS" },
  { value: "SAT", label: "SAT" },
  { value: "ORT", label: "ORT" },
];

/** Resolve {value,labelKey|label} option arrays to {value,label} using the translator. */
const localizeOptions = (options, t) =>
  options.map((o) => ({ value: o.value, label: o.labelKey ? t(o.labelKey) : o.label }));

const prettyEnum = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const formatTuition = (u, t) => {
  if (u == null || u.avgTuitionPerYear == null) return null;
  const amount = Number(u.avgTuitionPerYear);
  if (amount === 0) return t("matchTuitionFree");
  return `${amount.toLocaleString()} ${u.currency || ""}/yr`.trim();
};

const MatchUniversitiesPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const isGuest = user?.isGuest === true;

  const gradingOptions = useMemo(() => localizeOptions(GRADING_OPTIONS, t), [t]);
  const degreeOptions = useMemo(() => localizeOptions(DEGREE_OPTIONS, t), [t]);
  const examOptions = useMemo(() => localizeOptions(EXAM_OPTIONS, t), [t]);

  const [gradingSystem, setGradingSystem] = useState("GPA_4");
  const [degree, setDegree] = useState("HIGH_SCHOOL_DIPLOMA");
  const [subjects, setSubjects] = useState([
    { name: "Mathematics", grade: "" },
    { name: "Physics", grade: "" },
    { name: "English", grade: "" },
  ]);
  const [examType, setExamType] = useState("TOEFL");
  const [examScore, setExamScore] = useState("");
  const [examMaxScore, setExamMaxScore] = useState("120");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const [trackedProgramIds, setTrackedProgramIds] = useState(() => new Set());
  const [trackingId, setTrackingId] = useState(null);

  const refreshMatches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMatches();
      setResults(Array.isArray(data) ? data : []);
      setHasSearched(true);
    } catch (e) {
      setError(e.message || "Could not load matches");
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshTracked = useCallback(async () => {
    try {
      const apps = await getApplications();
      setTrackedProgramIds(new Set((apps || []).map((a) => a.programId)));
    } catch (_) {
      // non-fatal: the Track buttons just won't show prior state
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && !isGuest) {
      refreshMatches();
      refreshTracked();
    }
  }, [isAuthenticated, isGuest, refreshMatches, refreshTracked]);

  const trackApplication = async (programId) => {
    if (!programId || trackedProgramIds.has(programId)) return;
    setTrackingId(programId);
    try {
      await createApplication({ programId });
      setTrackedProgramIds((prev) => new Set(prev).add(programId));
    } catch (e) {
      // Already tracking (409) is fine — reflect it as tracked.
      if (/already tracking/i.test(e.message || "")) {
        setTrackedProgramIds((prev) => new Set(prev).add(programId));
      } else {
        setError(e.message || "Could not track application");
      }
    } finally {
      setTrackingId(null);
    }
  };

  const updateSubject = (index, key, value) => {
    setSubjects((rows) =>
      rows.map((row, i) => (i === index ? { ...row, [key]: value } : row))
    );
  };
  const addSubject = () =>
    setSubjects((rows) => [...rows, { name: "", grade: "" }]);
  const removeSubject = (index) =>
    setSubjects((rows) => rows.filter((_, i) => i !== index));

  const saveAndMatch = async () => {
    setSaving(true);
    setError(null);
    try {
      const filled = subjects.filter(
        (r) => r.name.trim() !== "" && r.grade !== ""
      );
      if (filled.length > 0) {
        await addTranscript({
          type: "SUBJECT_BASED",
          gradingSystem,
          degree,
          institutionName: "Self-reported",
          // Default to a recent ~4-year window relative to now (avoids hardcoded years going stale).
          fromYear: new Date().getFullYear() - 4,
          toYear: new Date().getFullYear(),
          subjects: filled.map((r) => ({
            subjectName: r.name.trim(),
            rawScore: String(r.grade),
          })),
        });
      }

      if (examType !== "none" && examScore !== "") {
        const score = Number(examScore);
        const maxScore = Number(examMaxScore) || score;
        await addExam({
          examType,
          score,
          maxScore,
          normalizedScore: maxScore
            ? Math.round((score / maxScore) * 10000) / 100
            : null,
          sections: [],
        });
      }

      await refreshMatches();
    } catch (e) {
      setError(e.message || "Could not save academic info");
    } finally {
      setSaving(false);
    }
  };

  const eligibleCount = results.filter((r) => r.eligible).length;

  if (isGuest) {
    return (
      <PageTemplate
        icon={<TargetIcon size={22} />}
        title={t("matchTitle")}
        description={t("matchDescriptionGuest")}
      >
        <div className={s.layout}>
          <div className={s.ctaPanel}>
            <div className={s.ctaBody}>
              <h3 className={s.ctaTitle}>{t("matchGuestCtaTitle")}</h3>
              <p className={s.ctaDesc}>
                {t("matchGuestCtaDesc")}
              </p>
            </div>
            <Link to="/register" className={s.ctaBtn}>
              {t("matchGuestSignUp")}
            </Link>
          </div>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate
      icon={<TargetIcon size={22} />}
      title={t("matchTitle")}
      description={t("matchDescription")}
    >
      <div className={s.layout}>
        {/* Academic info */}
        <div className={s.introPanel}>
          <h3 className={s.sectionLabel}>{t("matchAcademicInfoTitle")}</h3>
          <p className={s.introText}>
            {t("matchAcademicInfoIntro")}
          </p>

          <div className={m.formGrid}>
            <SelectField
              label={t("matchGradingSystem")}
              value={gradingSystem}
              onChange={setGradingSystem}
              options={gradingOptions}
            />
            <SelectField
              label={t("matchHighestDegree")}
              value={degree}
              onChange={setDegree}
              options={degreeOptions}
            />
          </div>

          <p className={m.subjectsLabel}>{t("matchSubjects")}</p>
          {subjects.map((row, index) => (
            <div key={index} className={m.subjectRow}>
              <input
                className={m.subjectName}
                placeholder={t("matchSubjectPlaceholder")}
                value={row.name}
                onChange={(e) => updateSubject(index, "name", e.target.value)}
              />
              <NumberField
                value={row.grade}
                placeholder={t("matchGradePlaceholder")}
                onChange={(v) => updateSubject(index, "grade", v)}
              />
              <button
                type="button"
                className={m.iconBtn}
                aria-label={t("matchRemoveSubject")}
                onClick={() => removeSubject(index)}
              >
                ×
              </button>
            </div>
          ))}
          <button type="button" className={m.linkBtn} onClick={addSubject}>
            {t("matchAddSubject")}
          </button>

          <div className={m.formGrid}>
            <SelectField
              label={t("matchExam")}
              value={examType}
              onChange={setExamType}
              options={examOptions}
            />
            {examType !== "none" && (
              <>
                <NumberField
                  label={t("matchScore")}
                  value={examScore}
                  placeholder={t("matchScorePlaceholder")}
                  onChange={setExamScore}
                />
                <NumberField
                  label={t("matchMaxScore")}
                  value={examMaxScore}
                  placeholder={t("matchMaxScorePlaceholder")}
                  onChange={setExamMaxScore}
                />
              </>
            )}
          </div>

          <div className={m.saveRow}>
            <AccentButton onClick={saving ? undefined : saveAndMatch}>
              {saving ? t("matchSaving") : t("matchSaveAndFind")}
            </AccentButton>
            {error && <p className={m.error}>{error}</p>}
          </div>
        </div>

        <hr className={s.divider} />

        {/* Results */}
        {loading ? (
          <p className={s.emptyState}>{t("matchFinding")}</p>
        ) : !hasSearched ? (
          <p className={s.emptyState}>
            {t("matchPromptSave")}
          </p>
        ) : results.length === 0 ? (
          <p className={s.emptyState}>
            {t("matchNoPrograms")}
          </p>
        ) : (
          <>
            <h3 className={s.sectionLabel}>
              {t("matchEligibleOf")
                .replace("{eligible}", eligibleCount)
                .replace("{total}", results.length)}
            </h3>
            <div className={m.matchList}>
              {results.map((match) => {
                const u = match.university || {};
                const tuition = formatTuition(u, t);
                const unmet = (match.criteria || []).filter(
                  (c) => c.hard && !c.met
                );
                const fitTags = (match.criteria || []).filter((c) => !c.hard);
                const fit = match.fitScore != null ? match.fitScore : match.matchScore;
                const chance = match.admissionChance;
                const tierClass = chance
                  ? {
                      Safety: m.tierSafety,
                      Target: m.tierTarget,
                      Reach: m.tierReach,
                      "Far reach": m.tierFarReach,
                    }[chance.tier]
                  : null;
                return (
                  <div className={s.contentCard} key={match.programId}>
                    <div className={s.cardHeader}>
                      <div className={s.cardIcon}>
                        <GraduationCapIcon size={20} />
                      </div>
                      <div className={m.cardTitleWrap}>
                        <h4 className={s.cardTitle}>
                          {prettyEnum(match.fieldType)} ·{" "}
                          {prettyEnum(match.degree)}
                        </h4>
                        <p className={s.cardDesc}>
                          {u.name}
                          {u.city ? `, ${u.city}` : ""}
                          {u.country ? `, ${u.country}` : ""}
                        </p>
                      </div>
                    </div>

                    <div className={s.cardMeta}>
                      <span className={`${s.metaBadge} ${s.highlight}`}>
                        {t("matchPercentFit").replace("{fit}", fit)}
                      </span>
                      <span className={s.metaBadge}>
                        {t("matchPercentAcademic").replace("{score}", match.matchScore)}
                      </span>
                      <span
                        className={`${s.metaBadge} ${
                          match.eligible ? s.success : ""
                        }`}
                      >
                        {match.eligible ? t("matchEligible") : t("matchNotYetEligible")}
                      </span>
                      {tuition && <span className={s.metaBadge}>{tuition}</span>}
                    </div>

                    <div className={s.progressTrack}>
                      <div
                        className={s.progressFill}
                        style={{ "--fill": `${fit}%` }}
                      />
                    </div>

                    {chance && (
                      <div className={m.chanceRow}>
                        <span className={`${m.chancePill} ${tierClass || ""}`}>
                          🎯 {chance.percent}% · {chance.tier}
                        </span>
                        <span className={m.chanceNote}>{chance.rationale}</span>
                      </div>
                    )}

                    {fitTags.length > 0 && (
                      <div className={m.fitTags}>
                        {fitTags.map((c, i) => (
                          <span
                            key={i}
                            className={`${m.fitTag} ${
                              c.met ? m.fitTagMet : m.fitTagMiss
                            }`}
                            title={`${c.required} → ${c.actual}`}
                          >
                            {c.met ? "✓" : "•"} {c.label}
                          </span>
                        ))}
                      </div>
                    )}

                    {match.eligible ? (
                      <p className={m.allMet}>{t("matchAllMet")}</p>
                    ) : (
                      <div>
                        <p className={m.missingLabel}>{t("matchWhatsMissing")}</p>
                        <ul className={m.missingList}>
                          {unmet.map((c, i) => (
                            <li key={i}>
                              <strong>{c.label}:</strong>{" "}
                              {t("matchNeedHave")
                                .replace("{required}", c.required)
                                .replace("{actual}", c.actual)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className={m.trackRow}>
                      {trackedProgramIds.has(match.programId) ? (
                        <span className={m.trackedBadge}>{t("matchTracking")}</span>
                      ) : (
                        <button
                          type="button"
                          className={m.trackBtn}
                          disabled={trackingId === match.programId}
                          onClick={() => trackApplication(match.programId)}
                        >
                          {trackingId === match.programId ? t("matchAdding") : t("matchTrackApplication")}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </PageTemplate>
  );
};

export default MatchUniversitiesPage;
