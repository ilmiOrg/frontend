import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageTemplate from "../../../shared/PageTemplate";
import { TargetIcon, GraduationCapIcon } from "../../../shared/Icons";
import { SelectField, NumberField, AccentButton } from "../../../../ui-components";
import { useAuth } from "../../../../contexts/AuthContext";
import { getMatches } from "../../../../api/matches";
import { addTranscript, addExam } from "../../../../api/academics";
import { getApplications, createApplication } from "../../../../api/applications";
import s from "../../../shared/ContentPage/style.module.css";
import m from "./style.module.css";

const GRADING_OPTIONS = [
  { value: "GPA_4", label: "GPA (4.0 scale)" },
  { value: "GPA_5", label: "GPA (5.0 scale)" },
  { value: "FIVE", label: "5-point (CIS)" },
  { value: "TEN", label: "10-point" },
];

const DEGREE_OPTIONS = [
  { value: "HIGH_SCHOOL_DIPLOMA", label: "High school diploma" },
  { value: "ASSOCIATE", label: "Associate" },
  { value: "BACHELOR", label: "Bachelor" },
  { value: "MASTER", label: "Master" },
  { value: "DOCTORATE", label: "Doctorate" },
];

const EXAM_OPTIONS = [
  { value: "none", label: "No exam" },
  { value: "TOEFL", label: "TOEFL" },
  { value: "IELTS", label: "IELTS" },
  { value: "SAT", label: "SAT" },
  { value: "ORT", label: "ORT" },
];

const prettyEnum = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const formatTuition = (u) => {
  if (u == null || u.avgTuitionPerYear == null) return null;
  const amount = Number(u.avgTuitionPerYear);
  if (amount === 0) return "Tuition-free";
  return `${amount.toLocaleString()} ${u.currency || ""}/yr`.trim();
};

const MatchUniversitiesPage = () => {
  const { user, isAuthenticated } = useAuth();
  const isGuest = user?.isGuest === true;

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
          fromYear: 2021,
          toYear: 2025,
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
        title="University Matches"
        description="See which programs you qualify for, ranked by fit."
      >
        <div className={s.layout}>
          <div className={s.ctaPanel}>
            <div className={s.ctaBody}>
              <h3 className={s.ctaTitle}>Create a free account to get matched</h3>
              <p className={s.ctaDesc}>
                Matching uses your grades and exam scores, so it needs a saved
                profile. Guests can browse, but matches require an account.
              </p>
            </div>
            <Link to="/register" className={s.ctaBtn}>
              Sign up
            </Link>
          </div>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate
      icon={<TargetIcon size={22} />}
      title="University Matches"
      description="Enter your academic info to see which programs you qualify for."
    >
      <div className={s.layout}>
        {/* Academic info */}
        <div className={s.introPanel}>
          <h3 className={s.sectionLabel}>Your academic info</h3>
          <p className={s.introText}>
            Add your subject grades and an exam score. We compare them against
            each program's published requirements — your data is saved to your
            profile.
          </p>

          <div className={m.formGrid}>
            <SelectField
              label="Grading system"
              value={gradingSystem}
              onChange={setGradingSystem}
              options={GRADING_OPTIONS}
            />
            <SelectField
              label="Highest degree"
              value={degree}
              onChange={setDegree}
              options={DEGREE_OPTIONS}
            />
          </div>

          <p className={m.subjectsLabel}>Subjects</p>
          {subjects.map((row, index) => (
            <div key={index} className={m.subjectRow}>
              <input
                className={m.subjectName}
                placeholder="Subject"
                value={row.name}
                onChange={(e) => updateSubject(index, "name", e.target.value)}
              />
              <NumberField
                value={row.grade}
                placeholder="Grade"
                onChange={(v) => updateSubject(index, "grade", v)}
              />
              <button
                type="button"
                className={m.iconBtn}
                aria-label="Remove subject"
                onClick={() => removeSubject(index)}
              >
                ×
              </button>
            </div>
          ))}
          <button type="button" className={m.linkBtn} onClick={addSubject}>
            + Add subject
          </button>

          <div className={m.formGrid}>
            <SelectField
              label="Exam"
              value={examType}
              onChange={setExamType}
              options={EXAM_OPTIONS}
            />
            {examType !== "none" && (
              <>
                <NumberField
                  label="Score"
                  value={examScore}
                  placeholder="e.g. 100"
                  onChange={setExamScore}
                />
                <NumberField
                  label="Max score"
                  value={examMaxScore}
                  placeholder="e.g. 120"
                  onChange={setExamMaxScore}
                />
              </>
            )}
          </div>

          <div className={m.saveRow}>
            <AccentButton onClick={saving ? undefined : saveAndMatch}>
              {saving ? "Saving…" : "Save & Find Matches"}
            </AccentButton>
            {error && <p className={m.error}>{error}</p>}
          </div>
        </div>

        <hr className={s.divider} />

        {/* Results */}
        {loading ? (
          <p className={s.emptyState}>Finding your matches…</p>
        ) : !hasSearched ? (
          <p className={s.emptyState}>
            Add your grades above and select “Save &amp; Find Matches”.
          </p>
        ) : results.length === 0 ? (
          <p className={s.emptyState}>
            No programs available yet. Check back once programs are added.
          </p>
        ) : (
          <>
            <h3 className={s.sectionLabel}>
              {eligibleCount} eligible of {results.length} programs
            </h3>
            <div className={m.matchList}>
              {results.map((match) => {
                const u = match.university || {};
                const tuition = formatTuition(u);
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
                        {fit}% fit
                      </span>
                      <span className={s.metaBadge}>
                        {match.matchScore}% academic
                      </span>
                      <span
                        className={`${s.metaBadge} ${
                          match.eligible ? s.success : ""
                        }`}
                      >
                        {match.eligible ? "Eligible" : "Not yet eligible"}
                      </span>
                      {tuition && <span className={s.metaBadge}>{tuition}</span>}
                    </div>

                    <div className={s.progressTrack}>
                      <div
                        className={s.progressFill}
                        style={{ width: `${fit}%` }}
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
                      <p className={m.allMet}>✓ You meet all requirements.</p>
                    ) : (
                      <div>
                        <p className={m.missingLabel}>What's missing</p>
                        <ul className={m.missingList}>
                          {unmet.map((c, i) => (
                            <li key={i}>
                              <strong>{c.label}:</strong> need {c.required},
                              have {c.actual}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className={m.trackRow}>
                      {trackedProgramIds.has(match.programId) ? (
                        <span className={m.trackedBadge}>✓ Tracking</span>
                      ) : (
                        <button
                          type="button"
                          className={m.trackBtn}
                          disabled={trackingId === match.programId}
                          onClick={() => trackApplication(match.programId)}
                        >
                          {trackingId === match.programId ? "Adding…" : "+ Track application"}
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
