import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../../../hooks/useLanguage";
import Chart from "chart.js/auto";
import {
  SearchIcon,
  CalendarIcon,
} from "../../../shared/Icons";
import styles from "./style.module.css";
import { getUniversities } from "../../../../api/universities";
import { getUniversityFields } from "../../../../api/fields";
import { getApplications } from "../../../../api/applications";
import { getMatches } from "../../../../api/matches";
import { getScholarshipMatches } from "../../../../api/scholarships";
import { mapUniversityFromApi } from "../SearchUniversitiesPage/searchUniversitiesData";
import { filterUniversitiesTeaser, countUniversitiesForFieldTeaser } from "./teaserUniversityFilter";
import IlmiContactHub from "../../../../components/IlmiContactHub";
import OnboardingBanner from "../../../../components/OnboardingBanner";


/** Official-style UCA wordmark (Wikimedia Commons, public domain / simple shapes). */
const DREAM_UCA_LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/5/50/Logo_UCA.svg";

const prettyStatus = (v) =>
  String(v || "")
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

/** Countdown text + urgency tone for a deadline N days out. */
const deadlineMeta = (days, t) => {
  if (days < 0) {
    return { text: t("dashDaysAgo").replace("{n}", Math.abs(days)), tone: "deadlineUrgent" };
  }
  if (days === 0) return { text: t("dashDeadlineToday"), tone: "deadlineUrgent" };
  const text = t("dashDaysLeft").replace("{n}", days);
  if (days <= 14) return { text, tone: "deadlineUrgent" };
  if (days <= 45) return { text, tone: "deadlineWarning" };
  return { text, tone: "deadlineNormal" };
};

// Display buckets for the application-status donut. Counts come from the student's
// real applications (computed at runtime) — each bucket maps one or more statuses.
const STATUS_ROWS = [
  { key: "dashStatusPlan", color: "rgba(59, 130, 246, 0.9)", dotClass: "statusDotPlan", statuses: ["PLANNING", "IN_PROGRESS"] },
  { key: "dashStatusApplied", color: "rgba(245, 158, 11, 0.9)", dotClass: "statusDotApplied", statuses: ["SUBMITTED"] },
  { key: "dashStatusAccepted", color: "rgba(16, 185, 129, 0.9)", dotClass: "statusDotAccepted", statuses: ["ADMITTED", "ENROLLED"] },
  { key: "dashStatusWaitlist", color: "rgba(139, 92, 246, 0.9)", dotClass: "statusDotWaitlist", statuses: ["WAITLISTED"] },
  { key: "dashStatusRejected", color: "rgba(239, 68, 68, 0.9)", dotClass: "statusDotRejected", statuses: ["REJECTED", "WITHDRAWN"] },
];

function computeStatusCounts(applications) {
  return STATUS_ROWS.map((row) =>
    (applications || []).filter((a) => row.statuses.includes(a.status)).length
  );
}

const UNI_POPULAR_INITIAL = {
  affordable: false,
  budget: false,
  english: false,
  europe: false,
  business: false,
  medicine: false,
  arts: false,
};

const UNI_TEASER_POPULAR_CHIPS = [
  { key: "affordable", labelKey: "dashUniPopUnder10k" },
  { key: "budget", labelKey: "dashUniPopUnder5k" },
  { key: "english", labelKey: "dashFilterEnglishTaught" },
  { key: "europe", labelKey: "dashFilterEurope" },
  { key: "business", labelKey: "dashUniPopBusinessLaw" },
  { key: "medicine", labelKey: "dashUniPopMedicine" },
  { key: "arts", labelKey: "dashUniPopArts" },
];

const FIELD_ALL = "all";

const FIELD_TEASER_DEGREE_CHIPS = [
  { id: FIELD_ALL, labelKey: "dashFilterAll" },
  { id: "bachelor", labelKey: "dashProgramFilterBachelor" },
  { id: "master", labelKey: "dashProgramFilterMaster" },
  { id: "phd", labelKey: "filterPhd" },
];

const FIELD_TEASER_SLUG_CHIPS = [
  { slug: "computer-science-it", labelKey: "dashFieldTeaserCs" },
  { slug: "business-management", labelKey: "dashFieldTeaserBusiness" },
  { slug: "medicine-health", labelKey: "dashFieldTeaserMedicine" },
  { slug: "engineering", labelKey: "dashFieldTeaserEngineering" },
  { slug: "arts-design", labelKey: "dashFieldTeaserArts" },
];

/** AI dashboard: university tiles (demo data, i18n keys) */



const DashboardPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const viewsChartRef = useRef(null);
  const statusChartRef = useRef(null);

  const [uniTeaserQuery, setUniTeaserQuery] = useState("");
  const [uniTeaserPopular, setUniTeaserPopular] = useState(() => ({ ...UNI_POPULAR_INITIAL }));
  const [fieldTeaserSlugs, setFieldTeaserSlugs] = useState(() => new Set());
  const [fieldTeaserDegree, setFieldTeaserDegree] = useState(FIELD_ALL);
  const [fieldTeaserEnglish, setFieldTeaserEnglish] = useState(false);
  const [scholarshipTeaserFilter, setScholarshipTeaserFilter] = useState("all");
  const [fieldTeaserQuery, setFieldTeaserQuery] = useState("");
  const [scholarshipTeaserQuery, setScholarshipTeaserQuery] = useState("");
  const [universitiesForTeaser, setUniversitiesForTeaser] = useState([]);
  const [fieldsCatalog, setFieldsCatalog] = useState([]);
  const [teaserDataLoading, setTeaserDataLoading] = useState(true);
  const [dreamLogoFailed, setDreamLogoFailed] = useState(false);

  // Real upcoming deadlines + application-status counts from the student's tracked apps.
  const [deadlines, setDeadlines] = useState([]);
  const [statusCounts, setStatusCounts] = useState(() => STATUS_ROWS.map(() => 0));
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const apps = await getApplications();
        if (cancelled) return;
        const upcoming = (apps || [])
          .filter((a) => a.deadline)
          .map((a) => {
            const days = Math.round(
              (new Date(`${a.deadline}T00:00:00`) - new Date().setHours(0, 0, 0, 0)) / 86400000
            );
            const u = a.university || {};
            return {
              id: a.applicationId,
              title: `${u.name || "Program"} · ${prettyStatus(a.status)}`,
              date: a.deadline,
              days,
            };
          })
          .sort((x, y) => x.days - y.days)
          .slice(0, 5);
        setDeadlines(upcoming);
        setStatusCounts(computeStatusCounts(apps));
      } catch (_) {
        if (!cancelled) {
          setDeadlines([]);
          setStatusCounts(STATUS_ROWS.map(() => 0));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  const statusTotal = statusCounts.reduce((sum, n) => sum + n, 0);

  // Real top matches preview (replaces the old hardcoded showcase rows).
  const [topMatches, setTopMatches] = useState([]);
  const [topScholarships, setTopScholarships] = useState([]);
  const [scholarshipMatchCount, setScholarshipMatchCount] = useState(0);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [matches, schols] = await Promise.all([
          getMatches().catch(() => []),
          getScholarshipMatches().catch(() => []),
        ]);
        if (cancelled) return;
        const scholList = Array.isArray(schols) ? schols : [];
        setTopMatches((Array.isArray(matches) ? matches : []).slice(0, 4));
        setTopScholarships(scholList.slice(0, 4));
        setScholarshipMatchCount(scholList.length);
      } catch (_) {
        if (!cancelled) {
          setTopMatches([]);
          setTopScholarships([]);
          setScholarshipMatchCount(0);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  const prettyField = (v) =>
    String(v || "").toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setTeaserDataLoading(true);
      try {
        const [uniRaw, fieldRaw] = await Promise.all([getUniversities(), getUniversityFields()]);
        if (cancelled) return;
        setUniversitiesForTeaser((uniRaw || []).map(mapUniversityFromApi));
        setFieldsCatalog(Array.isArray(fieldRaw) ? fieldRaw : []);
      } catch {
        if (!cancelled) {
          setUniversitiesForTeaser([]);
          setFieldsCatalog([]);
        }
      } finally {
        if (!cancelled) setTeaserDataLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleUniTeaserPopular = useCallback((key) => {
    setUniTeaserPopular((p) => ({ ...p, [key]: !p[key] }));
  }, []);

  const clearUniTeaser = useCallback(() => {
    setUniTeaserQuery("");
    setUniTeaserPopular({ ...UNI_POPULAR_INITIAL });
  }, []);

  const universitiesSearchTo = useMemo(() => {
    const params = new URLSearchParams();
    if (uniTeaserQuery.trim()) params.set("q", uniTeaserQuery.trim());
    const keys = Object.entries(uniTeaserPopular)
      .filter(([, on]) => on)
      .map(([k]) => k);
    if (keys.length) params.set("popular", keys.join(","));
    const qs = params.toString();
    return qs ? `/dashboard/search/universities?${qs}` : "/dashboard/search/universities";
  }, [uniTeaserQuery, uniTeaserPopular]);

  const goUniversitiesSearch = useCallback(() => {
    navigate(universitiesSearchTo);
  }, [navigate, universitiesSearchTo]);

  const toggleFieldTeaserSlug = useCallback((slug) => {
    setFieldTeaserSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }, []);

  const clearFieldTeaser = useCallback(() => {
    setFieldTeaserSlugs(new Set());
    setFieldTeaserDegree(FIELD_ALL);
    setFieldTeaserEnglish(false);
    setFieldTeaserQuery("");
  }, []);

  const fieldsSearchTo = useMemo(() => {
    const params = new URLSearchParams();
    if (fieldTeaserDegree !== FIELD_ALL) params.set("degree", fieldTeaserDegree);
    if (fieldTeaserEnglish) params.set("language", "English");
    if (fieldTeaserSlugs.size) params.set("fields", [...fieldTeaserSlugs].join(","));
    if (fieldTeaserQuery.trim()) params.set("q", fieldTeaserQuery.trim());
    const qs = params.toString();
    return qs ? `/dashboard/search/fields?${qs}` : "/dashboard/search/fields";
  }, [fieldTeaserDegree, fieldTeaserEnglish, fieldTeaserQuery, fieldTeaserSlugs]);

  const goFieldsSearch = useCallback(() => {
    navigate(fieldsSearchTo);
  }, [navigate, fieldsSearchTo]);

  const scholarshipsSearchTo = useMemo(() => {
    const params = new URLSearchParams();
    if (scholarshipTeaserFilter !== "all") params.set("filter", scholarshipTeaserFilter);
    if (scholarshipTeaserQuery.trim()) params.set("q", scholarshipTeaserQuery.trim());
    const qs = params.toString();
    return qs ? `/dashboard/search/scholarships?${qs}` : "/dashboard/search/scholarships";
  }, [scholarshipTeaserFilter, scholarshipTeaserQuery]);

  const universityTeaserMatchCount = useMemo(() => {
    if (!universitiesForTeaser.length) return 0;
    return filterUniversitiesTeaser(universitiesForTeaser, uniTeaserQuery, uniTeaserPopular).length;
  }, [uniTeaserPopular, uniTeaserQuery, universitiesForTeaser]);

  const fieldSelectedIds = useMemo(() => {
    const map = new Map(fieldsCatalog.map((f) => [f.fieldSlug, f.fieldId]));
    const ids = new Set();
    fieldTeaserSlugs.forEach((slug) => {
      const id = map.get(slug);
      if (id) ids.add(id);
    });
    return ids;
  }, [fieldsCatalog, fieldTeaserSlugs]);

  const fieldTeaserMatchCount = useMemo(() => {
    if (!fieldsCatalog.length) return 0;
    const q = fieldTeaserQuery.trim().toLowerCase();
    if (fieldSelectedIds.size === 0) {
      return fieldsCatalog.filter((f) => !q || (f.fieldName || "").toLowerCase().includes(q)).length;
    }
    if (!universitiesForTeaser.length) return 0;
    const lang = fieldTeaserEnglish ? "English" : FIELD_ALL;
    return countUniversitiesForFieldTeaser(universitiesForTeaser, fieldSelectedIds, fieldTeaserDegree, lang);
  }, [
    fieldSelectedIds,
    fieldTeaserDegree,
    fieldTeaserEnglish,
    fieldTeaserQuery,
    fieldsCatalog,
    universitiesForTeaser,
  ]);

  const goScholarshipsSearch = useCallback(() => {
    navigate(scholarshipsSearchTo);
  }, [navigate, scholarshipsSearchTo]);

  useEffect(() => {
    let viewsChart = null;
    let statusChart = null;

    const timer = setTimeout(() => {
      if (viewsChartRef.current) {
        const ctx = viewsChartRef.current.getContext("2d");
        viewsChart = new Chart(ctx, {
          type: "line",
          data: {
            labels: [t("monthJan"), t("monthFeb"), t("monthMar"), t("monthApr"), t("monthMay"), t("monthJun")],
            datasets: [
              {
                label: t("chartUnis"),
                data: [3, 5, 8, 10, 12, 15],
                borderColor: "#C026D3",
                backgroundColor: "rgba(192, 38, 211, 0.12)",
                tension: 0.4,
                fill: false,
                pointBackgroundColor: "#C026D3",
                pointBorderColor: "#fff",
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
              },
              {
                label: t("chartScholarshipsLabel"),
                data: [2, 3, 5, 6, 7, 8],
                borderColor: "#22C55E",
                backgroundColor: "rgba(34, 197, 94, 0.12)",
                tension: 0.4,
                fill: false,
                pointBackgroundColor: "#22C55E",
                pointBorderColor: "#fff",
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
                labels: { color: "rgba(255,255,255,0.68)", usePointStyle: true, padding: 16 },
              },
            },
            scales: {
              x: { grid: { color: "rgba(255,255,255,0.08)" }, ticks: { color: "rgba(255,255,255,0.52)" } },
              y: { grid: { color: "rgba(255,255,255,0.08)" }, ticks: { color: "rgba(255,255,255,0.52)" } },
            },
          },
        });
      }

      if (statusChartRef.current) {
        const ctx = statusChartRef.current.getContext("2d");
        statusChart = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: STATUS_ROWS.map((s) => t(s.key)),
            datasets: [
              {
                data: statusCounts,
                backgroundColor: STATUS_ROWS.map((s) => s.color),
                borderWidth: 2,
                borderColor: "rgba(10, 14, 22, 0.95)",
                hoverBorderColor: "rgba(255, 255, 255, 0.12)",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { enabled: true } },
            cutout: "54%",
          },
        });
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      viewsChart?.destroy();
      statusChart?.destroy();
    };
  }, [t, statusCounts]);

  return (
    <div className={styles.dashboardInner}>
            <OnboardingBanner />
            <div className={styles.dashGrid}>
              <div className={styles.dreamCard}>
                <div className={styles.dreamHero}>
                  <div className={styles.dreamLogoWrap}>
                    {!dreamLogoFailed ? (
                      <img
                        src={DREAM_UCA_LOGO_URL}
                        alt={t("dashUcaName")}
                        className={styles.dreamLogoImg}
                        onError={() => setDreamLogoFailed(true)}
                      />
                    ) : (
                      <span className={styles.dreamLogoFallback} aria-hidden>
                        UCA
                      </span>
                    )}
                  </div>
                  <div className={styles.dreamHeroMain}>
                    <div className={styles.dreamTopRow}>
                      <h3 className={styles.dreamTitle}>{t("dashDreamUniversity")}</h3>
                      <div className={styles.dreamProgress}>
                        <div className={styles.progressRing}>
                          <svg className={styles.progressRingSvg} width="48" height="48" viewBox="0 0 48 48">
                            <defs>
                              <linearGradient id="dreamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#2563EB" />
                                <stop offset="100%" stopColor="#10B981" />
                              </linearGradient>
                            </defs>
                            <circle className={styles.ringBg} cx="24" cy="24" r="20" />
                            <circle className={styles.ringFill} cx="24" cy="24" r="20" />
                          </svg>
                          <span className={styles.progressPercent}>92%</span>
                        </div>
                        <div className={styles.progressLabel}>
                          <span className={styles.progressMatch}>{t("dashPerfectMatch")}</span>
                          <span className={styles.progressUni}>{t("dashDreamPeakLabel")}</span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.dreamSchoolName}>{t("dashUcaName")}</div>
                    <div className={styles.dreamLocation}>{t("dashUcaLocation")}</div>
                  </div>
                </div>
                <div className={styles.dreamPills}>
                  <span className={styles.dreamPill}>{t("dashDreamPillFit")}</span>
                  <span className={styles.dreamPill}>{t("dashDreamPillDeadline")}</span>
                  <span className={styles.dreamPill}>{t("dashDreamPillDocs")}</span>
                </div>
                <div className={styles.dreamReadiness}>
                  <div className={styles.dreamReadinessHead}>
                    <span>{t("dashDreamReadinessLabel")}</span>
                    <span className={styles.dreamReadinessValue}>92%</span>
                  </div>
                  <div className={styles.dreamReadinessTrack} role="presentation">
                    <div className={`${styles.dreamReadinessFill} ${styles.deadlineFillW92}`} />
                  </div>
                </div>
                <div className={styles.dreamActions}>
                  <button type="button" className={`${styles.dreamBtn} ${styles.dreamBtnPrimary}`}>
                    {t("dashStartClimb")}
                  </button>
                  <button type="button" className={`${styles.dreamBtn} ${styles.dreamBtnSecondary}`}>
                    {t("dashPackList")}
                  </button>
                </div>
              </div>

              <div className={styles.deadlinesCard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{t("dashUpcomingDeadlines")}</h3>
                  <button
                    type="button"
                    className={styles.cardAction}
                    onClick={() => navigate("/dashboard/applications")}
                  >
                    {t("dashShowAll")}
                  </button>
                </div>
                {deadlines.length === 0 ? (
                  <p className={`${styles.mutedNote} ${styles.mutedNoteTop}`}>
                    {t("dashNoDeadlines")}
                  </p>
                ) : (
                  <div className={styles.deadlineList}>
                    {deadlines.map((d) => {
                      const meta = deadlineMeta(d.days, t);
                      return (
                        <div className={styles.deadlineRow} key={d.id}>
                          <div className={`${styles.deadlineIcon} ${styles[meta.tone]}`}>
                            <CalendarIcon size={14} />
                          </div>
                          <div className={styles.deadlineInfo}>
                            <div className={styles.deadlineTitle}>{d.title}</div>
                            <div className={styles.deadlineDate}>{d.date}</div>
                          </div>
                          <div className={styles.deadlineTime}>{meta.text}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className={styles.chartCard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{t("dashViewsTitle")}</h3>
                  <span className={styles.chartStats}>{t("dashViewsTotal")}</span>
                </div>
                <div className={styles.chartWrap}>
                  <canvas ref={viewsChartRef} aria-label={t("dashViewsTitle")} />
                </div>
              </div>

              <div className={styles.statusCard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{t("dashApplicationStatus")}</h3>
                  <span className={styles.statusTotal}>{t("dashStatusTotal")}</span>
                </div>
                <div className={styles.statusContainer}>
                  <div className={styles.statusChart}>
                    <canvas ref={statusChartRef} aria-label={t("dashApplicationStatus")} />
                    <div className={styles.statusChartCenter} aria-hidden="true">
                      <span className={styles.statusChartCenterValue}>{statusTotal}</span>
                      <span className={styles.statusChartCenterLabel}>{t("dashStatusDonutLabel")}</span>
                    </div>
                  </div>
                  <div className={styles.statusLegend}>
                    {STATUS_ROWS.map((row, idx) => (
                      <div
                        key={row.key}
                        className={`${styles.statusRow} ${
                          idx === STATUS_ROWS.length - 1 && STATUS_ROWS.length % 2 === 1 ? styles.statusRowFull : ""
                        }`}
                      >
                        <div className={styles.statusRowMain}>
                          <div className={`${styles.statusDot} ${styles[row.dotClass]}`} />
                          <span className={styles.statusCount}>{statusCounts[idx]}</span>
                          <span className={styles.statusLabel}>{t(row.key)}</span>
                        </div>
                        <span className={styles.statusRowShare}>
                          {statusTotal > 0 ? Math.round((statusCounts[idx] / statusTotal) * 100) : 0}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{t("dashSearchUniversities")}</h2>
              </div>
              <div className={styles.searchTeaser}>
                <div className={styles.searchTeaserSplit}>
                  <div className={styles.searchTeaserFilters}>
                    <div className={styles.previewSearchBar}>
                      <SearchIcon size={16} />
                      <input
                        type="search"
                        className={styles.previewSearchInput}
                        value={uniTeaserQuery}
                        onChange={(e) => setUniTeaserQuery(e.target.value)}
                        placeholder={t("dashSearchUniPlaceholder")}
                        aria-label={t("dashSearchUniPlaceholder")}
                      />
                    </div>
                    <div className={styles.searchTeaserPopularRow}>
                      <p className={styles.searchTeaserPopularLabel}>{t("dashSearchPopularFilters")}</p>
                      <button type="button" className={styles.searchTeaserClear} onClick={clearUniTeaser}>
                        {t("dashSearchClearFilters")}
                      </button>
                    </div>
                    <div className={styles.previewChipRow}>
                      {UNI_TEASER_POPULAR_CHIPS.map(({ key, labelKey }) => (
                        <button
                          key={key}
                          type="button"
                          className={`${styles.previewChip} ${uniTeaserPopular[key] ? styles.previewChipActive : ""}`}
                          onClick={() => toggleUniTeaserPopular(key)}
                        >
                          {t(labelKey)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <aside className={styles.searchTeaserAside}>
                    <p className={styles.searchTeaserAsideCount}>
                      {teaserDataLoading ? "…" : universityTeaserMatchCount}
                    </p>
                    <p className={styles.searchTeaserRightSub}>{t("dashSearchTeaserSearchUniversities")}</p>
                    <button type="button" className={styles.searchTeaserCtaCompact} onClick={goUniversitiesSearch}>
                      {t("dashStartSearching")}
                    </button>
                  </aside>
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{t("dashSearchFields")}</h2>
              </div>
              <div className={styles.searchTeaser}>
                <div className={styles.searchTeaserSplit}>
                  <div className={styles.searchTeaserFilters}>
                    <div className={styles.previewSearchBar}>
                      <SearchIcon size={16} />
                      <input
                        type="search"
                        className={styles.previewSearchInput}
                        value={fieldTeaserQuery}
                        onChange={(e) => setFieldTeaserQuery(e.target.value)}
                        placeholder={t("dashSearchFieldPlaceholder")}
                        aria-label={t("dashSearchFieldPlaceholder")}
                      />
                    </div>
                    <div className={styles.searchTeaserPopularRow}>
                      <p className={styles.searchTeaserPopularLabel}>{t("dashSearchPopularFilters")}</p>
                      <button type="button" className={styles.searchTeaserClear} onClick={clearFieldTeaser}>
                        {t("dashSearchClearFilters")}
                      </button>
                    </div>
                    <div className={styles.previewChipRow}>
                      {FIELD_TEASER_DEGREE_CHIPS.map((chip) => (
                        <button
                          key={chip.id}
                          type="button"
                          className={`${styles.previewChip} ${fieldTeaserDegree === chip.id ? styles.previewChipActive : ""}`}
                          onClick={() => setFieldTeaserDegree(chip.id)}
                        >
                          {chip.labelKey === "filterPhd" ? t("filterPhd") : t(chip.labelKey)}
                        </button>
                      ))}
                      <button
                        type="button"
                        className={`${styles.previewChip} ${fieldTeaserEnglish ? styles.previewChipActive : ""}`}
                        onClick={() => setFieldTeaserEnglish((v) => !v)}
                      >
                        {t("dashFilterEnglishTaught")}
                      </button>
                    </div>
                    <div className={styles.previewChipRow}>
                      {FIELD_TEASER_SLUG_CHIPS.map(({ slug, labelKey }) => (
                        <button
                          key={slug}
                          type="button"
                          className={`${styles.previewChip} ${fieldTeaserSlugs.has(slug) ? styles.previewChipActive : ""}`}
                          onClick={() => toggleFieldTeaserSlug(slug)}
                        >
                          {t(labelKey)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <aside className={styles.searchTeaserAside}>
                    <p className={styles.searchTeaserAsideCount}>
                      {teaserDataLoading ? "…" : fieldTeaserMatchCount}
                    </p>
                    <p className={styles.searchTeaserRightSub}>{t("dashSearchTeaserSearchFields")}</p>
                    <button type="button" className={styles.searchTeaserCtaCompact} onClick={goFieldsSearch}>
                      {t("dashStartSearching")}
                    </button>
                  </aside>
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{t("dashSearchScholarships")}</h2>
              </div>
              <div className={styles.searchTeaser}>
                <div className={styles.searchTeaserSplit}>
                  <div className={styles.searchTeaserFilters}>
                    <div className={styles.previewSearchBar}>
                      <SearchIcon size={16} />
                      <input
                        type="search"
                        className={styles.previewSearchInput}
                        value={scholarshipTeaserQuery}
                        onChange={(e) => setScholarshipTeaserQuery(e.target.value)}
                        placeholder={t("dashSearchScholarshipPlaceholder")}
                        aria-label={t("dashSearchScholarshipPlaceholder")}
                      />
                    </div>
                    <div className={styles.searchTeaserPopularRow}>
                      <p className={styles.searchTeaserPopularLabel}>{t("dashSearchPopularFilters")}</p>
                      <button
                        type="button"
                        className={styles.searchTeaserClear}
                        onClick={() => {
                          setScholarshipTeaserFilter("all");
                          setScholarshipTeaserQuery("");
                        }}
                      >
                        {t("dashSearchClearFilters")}
                      </button>
                    </div>
                    <div className={styles.previewChipRow}>
                      {[
                        { id: "all", labelKey: "dashFilterAll" },
                        { id: "merit", labelKey: "dashScholarshipFilterMerit" },
                        { id: "need", labelKey: "dashScholarshipFilterNeed" },
                      ].map((chip) => (
                        <button
                          key={chip.id}
                          type="button"
                          className={`${styles.previewChip} ${scholarshipTeaserFilter === chip.id ? styles.previewChipActive : ""}`}
                          onClick={() => setScholarshipTeaserFilter(chip.id)}
                        >
                          {t(chip.labelKey)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <aside className={styles.searchTeaserAside}>
                    <p className={styles.searchTeaserAsideCount}>{scholarshipMatchCount}</p>
                    <p className={styles.searchTeaserRightSub}>{t("dashSearchTeaserSearchScholarships")}</p>
                    <button type="button" className={styles.searchTeaserCtaCompact} onClick={goScholarshipsSearch}>
                      {t("dashStartSearching")}
                    </button>
                  </aside>
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{t("dashAiDashboardUniTitle")}</h2>
                <button
                  type="button"
                  className={styles.cardAction}
                  onClick={() => navigate("/dashboard/ai/match-universities")}
                >
                  {t("dashCtaSeeAllUniversityMatches")}
                </button>
              </div>
              {topMatches.length === 0 ? (
                <p className={styles.mutedNote}>
                  {t("dashNoTopMatches")}
                </p>
              ) : (
                <div className={styles.realMatchGrid}>
                  {topMatches.map((match) => {
                    const u = match.university || {};
                    const score = match.fitScore != null ? match.fitScore : match.matchScore;
                    return (
                      <button
                        key={match.programId}
                        type="button"
                        className={styles.realMatchCard}
                        onClick={() => navigate("/dashboard/ai/match-universities")}
                      >
                        <div className={styles.realMatchTop}>
                          <span className={styles.realMatchScore}>{score}%</span>
                          <span className={match.eligible ? styles.realMatchElig : styles.realMatchInelig}>
                            {match.eligible ? t("dashEligible") : t("dashNotYet")}
                          </span>
                        </div>
                        <p className={styles.realMatchName}>{u.name}</p>
                        <p className={styles.realMatchMeta}>
                          {prettyField(match.fieldType)} · {prettyField(match.degree)}
                          {u.country ? ` · ${u.country}` : ""}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{t("dashAiDashboardScholTitle")}</h2>
                <button
                  type="button"
                  className={styles.cardAction}
                  onClick={() => navigate("/dashboard/ai/match-scholarships")}
                >
                  {t("dashCtaSeeAllScholarshipMatches")}
                </button>
              </div>
              {topScholarships.length === 0 ? (
                <p className={styles.mutedNote}>
                  {t("dashNoTopScholarships")}
                </p>
              ) : (
                <div className={styles.realMatchGrid}>
                  {topScholarships.map((sc) => (
                    <button
                      key={sc.scholarshipId}
                      type="button"
                      className={styles.realMatchCard}
                      onClick={() => navigate("/dashboard/ai/match-scholarships")}
                    >
                      <div className={styles.realMatchTop}>
                        <span className={sc.eligible ? styles.realMatchElig : styles.realMatchInelig}>
                          {sc.eligible ? t("dashEligible") : t("dashNotEligible")}
                        </span>
                      </div>
                      <p className={styles.realMatchName}>{sc.name}</p>
                      <p className={styles.realMatchMeta}>
                        {sc.universityName}
                        {sc.countryName ? ` · ${sc.countryName}` : ""}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </section>


            <IlmiContactHub variant="embedded" t={t} />
    </div>
  );
};

export default DashboardPage;
