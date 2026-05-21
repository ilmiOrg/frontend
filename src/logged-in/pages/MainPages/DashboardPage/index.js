import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../../../hooks/useLanguage";
import Chart from "chart.js/auto";
import {
  SearchIcon,
  GraduationCapIcon,
  DollarIcon,
  PenToolIcon,
  CalendarIcon,
  ChevronRightIcon,
} from "../../../shared/Icons";
import styles from "./style.module.css";
import { getUniversities } from "../../../../api/universities";
import { getUniversityFields } from "../../../../api/fields";
import { mapUniversityFromApi } from "../SearchUniversitiesPage/searchUniversitiesData";
import { filterUniversitiesTeaser, countUniversitiesForFieldTeaser } from "./teaserUniversityFilter";
import IlmiContactHub from "../../../../components/IlmiContactHub";

/**
 * Wikimedia Commons campus / architecture photo (Special:FilePath redirects to CDN).
 * File names must match Commons exactly (see file pages on commons.wikimedia.org).
 */
function commonsCampusPhoto(fileName, width = 1024) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=${width}`;
}

/** Official-style UCA wordmark (Wikimedia Commons, public domain / simple shapes). */
const DREAM_UCA_LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/5/50/Logo_UCA.svg";

const STATUS_ROWS = [
  { key: "dashStatusPlan", count: 5, color: "rgba(59, 130, 246, 0.9)" },
  { key: "dashStatusApplied", count: 4, color: "rgba(245, 158, 11, 0.9)" },
  { key: "dashStatusAccepted", count: 3, color: "rgba(16, 185, 129, 0.9)" },
  { key: "dashStatusWaitlist", count: 2, color: "rgba(139, 92, 246, 0.9)" },
  { key: "dashStatusRejected", count: 1, color: "rgba(239, 68, 68, 0.9)" },
];

const STATUS_TOTAL_COUNT = STATUS_ROWS.reduce((sum, row) => sum + row.count, 0);

/** Dashboard search teasers: illustrative counts when API/filter result is 0 */
const TEASER_FALLBACK_COUNT_UNIVERSITIES = 187;
const TEASER_FALLBACK_COUNT_FIELDS = 256;
const TEASER_FALLBACK_COUNT_SCHOLARSHIPS = 123;

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
const AI_UNI_MATCH_ROWS = [
  {
    id: "mit",
    nameKey: "dashUni1Name",
    locKey: "dashUni1Loc",
    rankKey: "dashUni1Rank",
    match: 95,
    initials: "MI",
    commonsFile: "Great_Dome,_MIT_-_IMG_8390.JPG",
  },
  {
    id: "stanford",
    nameKey: "dashUni2Name",
    locKey: "dashUni2Loc",
    rankKey: "dashUni2Rank",
    match: 92,
    initials: "ST",
    commonsFile: "Stanford_University_Main_Quad_(cropped).jpg",
  },
  {
    id: "uca",
    nameKey: "dashUcaName",
    locKey: "dashUcaLocation",
    rankKey: null,
    match: 89,
    initials: "UC",
    commonsFile: "University_of_Central_Asia_Naryn_Campus_aerial_shot.jpg",
  },
];

const AI_SCHOL_MATCH_ROWS = [
  {
    id: "merit",
    titleKey: "dashScholPreviewMeritTitle",
    metaKey: "dashScholPreviewMeritMeta",
    match: 91,
    commonsFile: "Radcliffe_Camera,_Oxford,_UK.jpg",
  },
  {
    id: "need",
    titleKey: "dashScholPreviewNeedTitle",
    metaKey: "dashScholPreviewNeedMeta",
    match: 87,
    commonsFile: "Long_Room_Interior,_Trinity_College_Dublin,_Ireland_-_Diliff.jpg",
  },
  {
    id: "intl",
    titleKey: "dashAiScholCardIntlTitle",
    metaKey: "dashAiScholCardIntlMeta",
    match: 84,
    commonsFile: "Low_Memorial_Library_Columbia_University_NYC.jpg",
  },
];

const AI_SIMILAR_STUDENT_ROWS = [
  {
    id: "s1",
    initials: "AK",
    nameKey: "dashFriendSampleName",
    descKey: "dashFriendSampleDesc",
    match: 94,
    similarityKeys: ["dashSimilarTagField", "dashSimilarOverlapGpa", "dashSimilarOverlapShortlist", "dashSimilarOverlapIntake"],
  },
  {
    id: "s2",
    initials: "EK",
    nameKey: "dashSimilarStudent2Name",
    descKey: "dashSimilarStudent2Desc",
    match: 88,
    similarityKeys: ["dashSimilarTagRegion", "dashSimilarOverlapScholarFirst", "dashSimilarOverlapEuTargets", "dashSimilarOverlapAidFocus"],
  },
  {
    id: "s3",
    initials: "TB",
    nameKey: "dashSimilarStudent3Name",
    descKey: "dashSimilarStudent3Desc",
    match: 85,
    similarityKeys: ["dashSimilarTagScores", "dashSimilarOverlapEuropeList", "dashSimilarOverlapIelts", "dashSimilarOverlapStemExtra"],
  },
];

const CONNECTION_FRIEND_ROWS = [
  { id: "cf1", initials: "AK", nameKey: "dashFriendSampleName", descKey: "dashFriendSampleDesc", online: true },
  { id: "cf2", initials: "ED", nameKey: "dashFriend2SampleName", descKey: "dashFriend2SampleDesc", online: true },
  { id: "cf3", initials: "SK", nameKey: "dashFriend3SampleName", descKey: "dashFriend3SampleDesc", online: false },
];

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
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [
              {
                label: "Universities",
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
                label: "Scholarships",
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
                data: STATUS_ROWS.map((s) => s.count),
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
  }, [t]);

  return (
    <div className={styles.dashboardInner}>
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
                    <div className={styles.dreamReadinessFill} style={{ width: "92%" }} />
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
                  <button type="button" className={styles.cardAction}>{t("dashShowAll")}</button>
                </div>
                <div className={styles.deadlineList}>
                  <div className={styles.deadlineRow}>
                    <div className={`${styles.deadlineIcon} ${styles.deadlineUrgent}`}>
                      <GraduationCapIcon size={14} />
                    </div>
                    <div className={styles.deadlineInfo}>
                      <div className={styles.deadlineTitle}>{t("dashUcaApplication")}</div>
                      <div className={styles.deadlineDate}>{t("dashOct6")}</div>
                    </div>
                    <div className={styles.deadlineBar}>
                      <div className={styles.deadlineFill} style={{ width: "90%", background: "rgba(239,68,68,0.9)" }} />
                    </div>
                    <div className={styles.deadlineTime}>{t("dashTime45m")}</div>
                  </div>
                  <div className={styles.deadlineRow}>
                    <div className={`${styles.deadlineIcon} ${styles.deadlineWarning}`}>
                      <DollarIcon size={14} />
                    </div>
                    <div className={styles.deadlineInfo}>
                      <div className={styles.deadlineTitle}>{t("dashAucaScholarship")}</div>
                      <div className={styles.deadlineDate}>{t("dashOct6")}</div>
                    </div>
                    <div className={styles.deadlineBar}>
                      <div className={styles.deadlineFill} style={{ width: "75%", background: "rgba(245,158,11,0.9)" }} />
                    </div>
                    <div className={styles.deadlineTime}>{t("dashTime2h15m")}</div>
                  </div>
                  <div className={styles.deadlineRow}>
                    <div className={`${styles.deadlineIcon} ${styles.deadlineNormal}`}>
                      <PenToolIcon size={14} />
                    </div>
                    <div className={styles.deadlineInfo}>
                      <div className={styles.deadlineTitle}>{t("dashMitApplication")}</div>
                      <div className={styles.deadlineDate}>{t("dashOct8")}</div>
                    </div>
                    <div className={styles.deadlineBar}>
                      <div className={styles.deadlineFill} style={{ width: "50%", background: "rgba(16,185,129,0.9)" }} />
                    </div>
                    <div className={styles.deadlineTime}>{t("dashTime2d3h")}</div>
                  </div>
                  <div className={styles.deadlineRow}>
                    <div className={`${styles.deadlineIcon} ${styles.deadlineNormal}`}>
                      <CalendarIcon size={14} />
                    </div>
                    <div className={styles.deadlineInfo}>
                      <div className={styles.deadlineTitle}>{t("dashDeadlineFarTitle")}</div>
                      <div className={styles.deadlineDate}>{t("dashDeadlineFarDate")}</div>
                    </div>
                    <div className={styles.deadlineBar}>
                      <div className={styles.deadlineFill} style={{ width: "14%", background: "rgba(99, 102, 241, 0.85)" }} />
                    </div>
                    <div className={styles.deadlineTime}>{t("dashTimeAbout9mo")}</div>
                  </div>
                </div>
              </div>

              <div className={styles.chartCard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{t("dashViewsTitle")}</h3>
                  <span className={styles.chartStats}>{t("dashViewsTotal")}</span>
                </div>
                <div className={styles.chartWrap}>
                  <canvas ref={viewsChartRef} />
                </div>
              </div>

              <div className={styles.statusCard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{t("dashApplicationStatus")}</h3>
                  <span className={styles.statusTotal}>{t("dashStatusTotal")}</span>
                </div>
                <div className={styles.statusContainer}>
                  <div className={styles.statusChart}>
                    <canvas ref={statusChartRef} />
                    <div className={styles.statusChartCenter} aria-hidden="true">
                      <span className={styles.statusChartCenterValue}>{STATUS_TOTAL_COUNT}</span>
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
                          <div className={styles.statusDot} style={{ background: row.color }} />
                          <span className={styles.statusCount}>{row.count}</span>
                          <span className={styles.statusLabel}>{t(row.key)}</span>
                        </div>
                        <span className={styles.statusRowShare}>
                          {Math.round((row.count / STATUS_TOTAL_COUNT) * 100)}%
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
                      {teaserDataLoading ? "…" : universityTeaserMatchCount || TEASER_FALLBACK_COUNT_UNIVERSITIES}
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
                      {teaserDataLoading ? "…" : fieldTeaserMatchCount || TEASER_FALLBACK_COUNT_FIELDS}
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
                    <p className={styles.searchTeaserAsideCount}>{TEASER_FALLBACK_COUNT_SCHOLARSHIPS}</p>
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
              </div>
              <div className={`${styles.aiShowcaseRow} ${styles.aiShowcaseRowUni}`}>
                <div className={styles.aiShowcaseCardsTrack}>
                  {AI_UNI_MATCH_ROWS.map((row) => (
                    <button
                      key={row.id}
                      type="button"
                      className={styles.aiShowcaseUniCard}
                      onClick={() => navigate("/dashboard/ai/match-universities")}
                      aria-label={`${t(row.nameKey)} · ${row.match}% ${t("dashMatch")}`}
                    >
                      <div className={styles.aiShowcaseUniMedia}>
                        <img
                          src={commonsCampusPhoto(row.commonsFile, 960)}
                          alt=""
                          className={styles.aiShowcaseUniImg}
                          loading="lazy"
                          width={960}
                          height={600}
                        />
                        <div className={styles.aiShowcaseUniMediaScrim} aria-hidden />
                        <span className={styles.aiShowcaseUniBadge}>{row.match}%</span>
                        <span className={styles.aiShowcaseUniInitials} aria-hidden>
                          {row.initials}
                        </span>
                      </div>
                      <div className={styles.aiShowcaseUniBody}>
                        <p className={styles.aiShowcaseUniName}>{t(row.nameKey)}</p>
                        <p className={styles.aiShowcaseUniLoc}>{t(row.locKey)}</p>
                        {row.rankKey ? (
                          <p className={styles.aiShowcaseUniRank}>
                            {t("dashRank")} · {t(row.rankKey)}
                          </p>
                        ) : null}
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className={`${styles.aiShowcaseWholeListBtn} ${styles.aiShowcaseWholeListBtnUni} ${styles.aiShowcaseWholeListBtnSlim}`}
                  onClick={() => navigate("/dashboard/ai/match-universities")}
                  aria-label={`${t("dashCtaSeeAllUniversityMatches")} · ${t("dashMatchUniversities")}`}
                >
                  <span className={styles.aiShowcaseWholeListBtnText}>{t("dashCtaSeeAllUniversityMatches")}</span>
                  <span className={styles.aiShowcaseWholeListBtnIcon} aria-hidden>
                    <ChevronRightIcon size={18} />
                  </span>
                </button>
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{t("dashAiDashboardScholTitle")}</h2>
              </div>
              <div className={`${styles.aiShowcaseRow} ${styles.aiShowcaseRowSchol}`}>
                <div className={styles.aiShowcaseCardsTrack}>
                  {AI_SCHOL_MATCH_ROWS.map((row) => (
                    <button
                      key={row.id}
                      type="button"
                      className={styles.aiShowcaseScholCard}
                      onClick={() => navigate("/dashboard/ai/match-scholarships")}
                      aria-label={`${t(row.titleKey)} · ${row.match}% ${t("dashMatch")}`}
                    >
                      <div className={styles.aiShowcaseScholMedia}>
                        <img
                          src={commonsCampusPhoto(row.commonsFile, 960)}
                          alt=""
                          className={styles.aiShowcaseScholImg}
                          loading="lazy"
                          width={960}
                          height={600}
                        />
                        <div className={styles.aiShowcaseScholMediaScrim} aria-hidden />
                        <span className={styles.aiShowcaseScholBadge}>{row.match}%</span>
                      </div>
                      <div className={styles.aiShowcaseScholBody}>
                        <p className={styles.aiShowcaseScholLabel}>{t("dashMatch")}</p>
                        <p className={styles.aiShowcaseScholTitle}>{t(row.titleKey)}</p>
                        <p className={styles.aiShowcaseScholMeta}>{t(row.metaKey)}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className={`${styles.aiShowcaseWholeListBtn} ${styles.aiShowcaseWholeListBtnSchol} ${styles.aiShowcaseWholeListBtnSlim}`}
                  onClick={() => navigate("/dashboard/ai/match-scholarships")}
                  aria-label={`${t("dashCtaSeeAllScholarshipMatches")} · ${t("dashMatchScholarships")}`}
                >
                  <span className={styles.aiShowcaseWholeListBtnText}>{t("dashCtaSeeAllScholarshipMatches")}</span>
                  <span className={styles.aiShowcaseWholeListBtnIcon} aria-hidden>
                    <ChevronRightIcon size={18} />
                  </span>
                </button>
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 id="dashboard-heading-friends-hub" className={styles.sectionTitle}>
                  {t("dashFriendsCombinedSectionTitle")}
                </h2>
              </div>
              <div className={styles.friendsHubPanel}>
                <div className={styles.friendsHubSplit}>
                  <div className={styles.friendsHubLeft}>
                  <h3 className={styles.friendsHubColumnTitle}>{t("dashFriendsSimilarColumnTitle")}</h3>
                  <ul className={styles.friendsHubSimilarList} aria-label={t("dashFriendsSimilarColumnTitle")}>
                    {AI_SIMILAR_STUDENT_ROWS.slice(0, 2).map((row) => (
                      <li key={row.id} className={styles.friendsHubSimilarItem}>
                        <div className={styles.friendsHubPeerCard}>
                          <button
                            type="button"
                            className={`${styles.aiPeerCard} ${styles.friendsHubPeerMain}`}
                            onClick={() => navigate("/dashboard/ai/similar-students")}
                            aria-label={`${t(row.nameKey)} · ${row.match}%`}
                          >
                            <span className={styles.aiPeerAvatar} aria-hidden>
                              {row.initials}
                            </span>
                            <span className={styles.aiPeerBody}>
                              <span className={styles.aiPeerHeadRow}>
                                <span className={styles.aiPeerName}>{t(row.nameKey)}</span>
                                <span className={styles.aiPeerMatch}>{row.match}%</span>
                              </span>
                              <span className={styles.aiPeerDesc}>{t(row.descKey)}</span>
                              <span className={styles.aiPeerChipRow} role="list" aria-label={t("dashSimilaritiesLabel")}>
                                {row.similarityKeys.slice(0, 3).map((key) => (
                                  <span key={key} className={styles.aiPeerSimilarityChip} role="listitem">
                                    {t(key)}
                                  </span>
                                ))}
                              </span>
                            </span>
                          </button>
                          <button
                            type="button"
                            className={`${styles.aiPeerAddFriendBtn} ${styles.friendsHubPeerAdd}`}
                            onClick={() => navigate("/dashboard/community/friends")}
                            aria-label={`${t("dashSimilarStudentsAddFriend")}: ${t(row.nameKey)}`}
                          >
                            {t("dashSimilarStudentsAddFriend")}
                          </button>
                        </div>
                      </li>
                    ))}
                    <li className={`${styles.friendsHubSimilarItem} ${styles.friendsHubSimilarSeeMoreItem}`}>
                      <button
                        type="button"
                        className={`${styles.friendsHubSeeMoreBtn} ${styles.friendsHubSeeMoreInRow}`}
                        onClick={() => navigate("/dashboard/ai/similar-students")}
                      >
                        <span className={styles.friendsHubSeeMoreInRowLabel}>{t("dashFriendsSimilarSeeMore")}</span>
                        <ChevronRightIcon size={18} aria-hidden />
                      </button>
                    </li>
                  </ul>
                  </div>
                  <aside className={styles.friendsHubRight} aria-label={t("dashFriendsOnlineColumnTitle")}>
                    <h3 className={styles.friendsHubRightTitle}>{t("dashFriendsOnlineColumnTitle")}</h3>
                    <div className={styles.friendsHubOnlinePanel}>
                      <p className={styles.friendsHubSubTitle}>{t("dashFriendsOnlineNow")}</p>
                      <ul className={styles.friendsHubOnlineList}>
                        {CONNECTION_FRIEND_ROWS.filter((r) => r.online).length === 0 ? (
                          <li className={styles.friendsHubOnlineEmpty}>{t("dashFriendsOnlineEmpty")}</li>
                        ) : (
                          CONNECTION_FRIEND_ROWS.filter((r) => r.online).map((row) => (
                            <li key={row.id} className={styles.friendsHubOnlineItem}>
                              <span className={styles.friendsHubOnlineDot} aria-hidden />
                              <span className={styles.friendsHubOnlineName}>{t(row.nameKey)}</span>
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                    <div className={styles.friendsHubActionsCard}>
                      <button
                        type="button"
                        className={styles.friendsHubActionsRow}
                        onClick={() => navigate("/dashboard/community/friends")}
                      >
                        <span className={styles.friendsHubActionsRowLabel}>
                          {t("dashFriendsSeeCountCta").replace(
                            "{{count}}",
                            String(CONNECTION_FRIEND_ROWS.length),
                          )}
                        </span>
                        <ChevronRightIcon size={16} aria-hidden className={styles.friendsHubActionsChevron} />
                      </button>
                    </div>
                  </aside>
                </div>
              </div>
            </section>

            <IlmiContactHub variant="embedded" t={t} />
    </div>
  );
};

export default DashboardPage;
