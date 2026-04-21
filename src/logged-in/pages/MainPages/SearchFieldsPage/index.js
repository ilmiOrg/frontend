import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "../../../../hooks/useLanguage";
import PageTemplate from "../../../shared/PageTemplate";
import { BookOpenIcon, LaptopIcon, BarChartIcon, HeartPulseIcon, ScaleIcon, GearIcon, PaletteIcon, GlobeIcon, DollarIcon, LeafIcon, NewspaperIcon, BuildingIcon, BrainIcon, CheckIcon, MenuIcon, ChevronRightIcon } from "../../../shared/Icons";
import {
  SelectField,
  NumberField,
  TextLinkButton,
} from "../../../../ui-components";
import styles from "./style.module.css";
import { getUniversityFields } from "../../../../api/fields";
import { getUniversities } from "../../../../api/universities";
import { mapUniversityFromApi } from "../SearchUniversitiesPage/searchUniversitiesData";

const ALL = "all";
const STORAGE_KEY = "ilmi_field_search_prefs";

const FIELD_ICONS = {
  "computer-science-it": <LaptopIcon size={18} />,
  "business-management": <BarChartIcon size={18} />,
  "medicine-health": <HeartPulseIcon size={18} />,
  law: <ScaleIcon size={18} />,
  engineering: <GearIcon size={18} />,
  "arts-design": <PaletteIcon size={18} />,
  "social-sciences": <GlobeIcon size={18} />,
  "economics-finance": <DollarIcon size={18} />,
  "environmental-sciences": <LeafIcon size={18} />,
  "journalism-media": <NewspaperIcon size={18} />,
  architecture: <BuildingIcon size={18} />,
  "data-science-ai": <BrainIcon size={18} />,
};

function getDegreeOptions(t) {
  return [
    { value: ALL, label: t("filterAllLevels") },
    { value: "bachelor", label: t("filterBachelor") },
    { value: "master", label: t("filterMaster") },
    { value: "phd", label: t("filterPhd") },
  ];
}

function getLanguageOptions(t) {
  return [
    { value: ALL, label: t("filterAnyLanguage") },
    { value: "English", label: "English" },
    { value: "German", label: "Deutsch" },
    { value: "French", label: "Français" },
    { value: "Spanish", label: "Español" },
    { value: "Dutch", label: "Nederlands" },
    { value: "Italian", label: "Italiano" },
    { value: "Japanese", label: "日本語" },
    { value: "Korean", label: "한국어" },
  ];
}

function formatTuition(n, t) {
  if (n === 0) return t("tuitionFree");
  return `≈ €${n.toLocaleString()} ${t("tuitionPerYear")}`;
}

function loadPrefs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function savePrefs(prefs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    /* noop */
  }
}

const SearchFieldsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const saved = useMemo(() => loadPrefs(), []);

  const [fields, setFields] = useState([]);
  const [selectedFieldIds, setSelectedFieldIds] = useState(() => {
    if (saved?.remember && saved.fieldIds?.length) {
      return new Set(saved.fieldIds);
    }
    return new Set();
  });
  const [degreeLevel, setDegreeLevel] = useState(
    saved?.remember ? saved.degreeLevel || ALL : ALL
  );
  const [language, setLanguage] = useState(
    saved?.remember ? saved.language || ALL : ALL
  );
  const [tuitionMin, setTuitionMin] = useState(
    saved?.remember ? saved.tuitionMin || "" : ""
  );
  const [tuitionMax, setTuitionMax] = useState(
    saved?.remember ? saved.tuitionMax || "" : ""
  );
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(
    saved?.remember ? saved.filtersOpen || false : false
  );
  const [viewMode, setViewMode] = useState(
    saved?.remember ? saved.viewMode || "compact" : "compact"
  );
  const [remember, setRemember] = useState(saved?.remember || false);

  useEffect(() => {
    if (remember) {
      savePrefs({
        remember: true,
        fieldIds: Array.from(selectedFieldIds),
        degreeLevel,
        language,
        tuitionMin,
        tuitionMax,
        filtersOpen,
        viewMode,
      });
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [
    remember,
    selectedFieldIds,
    degreeLevel,
    language,
    tuitionMin,
    tuitionMax,
    filtersOpen,
    viewMode,
  ]);

  useEffect(() => {
    getUniversityFields()
      .then(setFields)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!fields.length) return;
    const degree = searchParams.get("degree");
    if (degree && ["bachelor", "master", "phd"].includes(degree)) {
      setDegreeLevel(degree);
    }
    const lang = searchParams.get("language");
    if (lang && lang !== ALL) {
      setLanguage(lang);
    }
    const fieldsCsv = searchParams.get("fields");
    if (fieldsCsv) {
      const slugs = fieldsCsv.split(",").map((s) => s.trim()).filter(Boolean);
      const idBySlug = new Map(fields.map((f) => [f.fieldSlug, f.fieldId]));
      const next = new Set();
      slugs.forEach((slug) => {
        const id = idBySlug.get(slug);
        if (id) next.add(id);
      });
      if (next.size) setSelectedFieldIds(next);
    }
  }, [fields, searchParams]);

  useEffect(() => {
    setLoading(true);
    getUniversities()
      .then((items) => setUniversities(items.map(mapUniversityFromApi)))
      .catch(() => setUniversities([]))
      .finally(() => setLoading(false));
  }, []);

  const toggleField = useCallback((fieldId) => {
    setSelectedFieldIds((prev) => {
      const next = new Set(prev);
      if (next.has(fieldId)) next.delete(fieldId);
      else next.add(fieldId);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setSelectedFieldIds(new Set());
    setDegreeLevel(ALL);
    setLanguage(ALL);
    setTuitionMin("");
    setTuitionMax("");
    setFiltersOpen(false);
  }, []);

  const hasSelection = selectedFieldIds.size > 0;

  const filtered = useMemo(() => {
    if (!hasSelection) return [];

    const minT =
      tuitionMin === "" ? null : Math.max(0, Number(tuitionMin) || 0);
    const maxT =
      tuitionMax === "" ? null : Math.max(0, Number(tuitionMax) || 0);

    return universities.filter((u) => {
      const uniFields = u.fields || [];

      const hasFieldMatch = uniFields.some((f) =>
        selectedFieldIds.has(f.fieldId)
      );
      if (!hasFieldMatch) return false;

      if (degreeLevel !== ALL) {
        const hasLevel = uniFields.some((f) =>
          (f.degreeLevels || []).includes(degreeLevel)
        );
        if (!hasLevel) return false;
      }

      if (language !== ALL) {
        const hasLang = uniFields.some((f) =>
          (f.languages || []).includes(language)
        );
        if (!hasLang) return false;
      }

      if (minT !== null && u.tuitionAnnual < minT) return false;
      if (maxT !== null && u.tuitionAnnual > maxT) return false;

      return true;
    });
  }, [
    universities,
    selectedFieldIds,
    hasSelection,
    degreeLevel,
    language,
    tuitionMin,
    tuitionMax,
  ]);

  const selectedFieldSlugs = useMemo(() => {
    const slugMap = new Map(fields.map((f) => [f.fieldId, f.fieldSlug]));
    return Array.from(selectedFieldIds)
      .map((id) => slugMap.get(id))
      .filter(Boolean);
  }, [fields, selectedFieldIds]);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const hasActiveFilters =
    degreeLevel !== ALL ||
    language !== ALL ||
    tuitionMin !== "" ||
    tuitionMax !== "";

  return (
    <PageTemplate icon={<BookOpenIcon size={22} />} title={t("searchFieldsTitle")} onBack={handleBack}>
      <div className={styles.layout}>
        <section className={styles.filtersPanel}>
          <div className={styles.filtersHead}>
            <h2 className={styles.panelTitle}>{t("searchFieldsPickField")}</h2>
            {hasSelection && (
              <TextLinkButton onClick={clearAll}>
                {t("searchFieldsClearAll")}
              </TextLinkButton>
            )}
          </div>

          {hasSelection && (
            <p className={styles.selectionHint}>
              {selectedFieldIds.size}{" "}
              {selectedFieldIds.size === 1
                ? t("searchFieldsSelectedOne")
                : t("searchFieldsSelectedMany")}
            </p>
          )}

          <div className={styles.fieldGrid}>
            {fields.map((f) => {
              const isChecked = selectedFieldIds.has(f.fieldId);
              return (
                <div
                  key={f.fieldId}
                  className={`${styles.fieldCard} ${
                    isChecked ? styles.fieldCardSelected : ""
                  }`}
                >
                  <button
                    type="button"
                    className={styles.fieldCheckArea}
                    onClick={() => toggleField(f.fieldId)}
                    aria-pressed={isChecked}
                  >
                    <span className={styles.checkbox}>
                      {isChecked ? <CheckIcon size={14} /> : ""}
                    </span>
                    <span className={styles.fieldIcon}>
                      {FIELD_ICONS[f.fieldSlug] || <BookOpenIcon size={18} />}
                    </span>
                    <span className={styles.fieldLabel}>{f.fieldName}</span>
                  </button>
                  <Link
                    className={styles.fieldDetailLink}
                    to={`/dashboard/search/fields/${f.fieldSlug}`}
                    title={t("searchFieldsViewDetails")}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ChevronRightIcon size={16} />
                  </Link>
                </div>
              );
            })}
          </div>

          {hasSelection && (
            <>
              <button
                type="button"
                className={`${styles.filtersToggle} ${
                  hasActiveFilters ? styles.filtersToggleActive : ""
                }`}
                onClick={() => setFiltersOpen((o) => !o)}
              >
                <span className={styles.filtersToggleIcon}>
                  {filtersOpen ? "▾" : "▸"}
                </span>
                {t("searchFieldsAdditionalFilters")}
                {hasActiveFilters && (
                  <span className={styles.filtersBadge}>
                    {t("searchFieldsFiltersActive")}
                  </span>
                )}
              </button>

              {filtersOpen && (
                <div className={styles.filterGrid}>
                  <SelectField
                    label={t("searchFieldsDegreeLevel")}
                    value={degreeLevel}
                    onChange={setDegreeLevel}
                    options={getDegreeOptions(t)}
                  />

                  <SelectField
                    label={t("searchFieldsLanguage")}
                    value={language}
                    onChange={setLanguage}
                    options={getLanguageOptions(t)}
                  />

                  <div className={styles.rangeField}>
                    <span className={styles.rangeLabel}>
                      {t("searchFieldsTuition")}
                    </span>
                    <div className={styles.rangeRow}>
                      <NumberField
                        value={tuitionMin}
                        onChange={setTuitionMin}
                        placeholder="Min"
                      />
                      <NumberField
                        value={tuitionMax}
                        onChange={setTuitionMax}
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          <label className={styles.rememberToggle}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className={styles.rememberCheckbox}
            />
            <span className={styles.rememberLabel}>
              {t("searchFieldsRemember")}
            </span>
          </label>
        </section>

        {hasSelection && (
          <section className={styles.resultsSection} aria-live="polite">
            <div className={styles.resultsHeader}>
              <div className={styles.resultsHeaderLeft}>
                <h2 className={styles.resultsTitle}>
                  {t("searchFieldsResults")}
                </h2>
                <span className={styles.resultsCount}>
                  {filtered.length}{" "}
                  {filtered.length === 1
                    ? t("searchFieldsResultOne")
                    : t("searchFieldsResultMany")}
                </span>
              </div>
              <div className={styles.viewToggle}>
                <button
                  type="button"
                  className={`${styles.viewBtn} ${
                    viewMode === "compact" ? styles.viewBtnActive : ""
                  }`}
                  onClick={() => setViewMode("compact")}
                  title={t("searchFieldsCompact")}
                >
                  ≡
                </button>
                <button
                  type="button"
                  className={`${styles.viewBtn} ${
                    viewMode === "full" ? styles.viewBtnActive : ""
                  }`}
                  onClick={() => setViewMode("full")}
                  title={t("searchFieldsFull")}
                >
                  <MenuIcon size={16} />
                </button>
              </div>
            </div>

            {loading ? (
              <p className={styles.emptyState}>{t("searchFieldsLoading")}</p>
            ) : filtered.length === 0 ? (
              <p className={styles.emptyState}>{t("searchNoResults")}</p>
            ) : (
              <ul
                className={
                  viewMode === "compact"
                    ? styles.resultListCompact
                    : styles.resultList
                }
              >
                {filtered.map((u) => {
                  const linkSlug = [u.slug, ...selectedFieldSlugs].join("+");
                  const matchingFields = (u.fields || []).filter((fl) =>
                    selectedFieldIds.has(fl.fieldId)
                  );

                  if (viewMode === "compact") {
                    return (
                      <li key={u.universityId} className={styles.uniCardCompact}>
                        <Link
                          to={`/dashboard/search/fields/${linkSlug}`}
                          className={styles.uniCardCompactLink}
                        >
                          <div className={styles.compactLeft}>
                            <h3 className={styles.compactName}>{u.name}</h3>
                            <span className={styles.compactMeta}>
                              {u.city}, {u.country}
                            </span>
                          </div>
                          <div className={styles.compactRight}>
                            <div className={styles.compactTags}>
                              {matchingFields.map((fl) => (
                                <span
                                  key={fl.fieldId}
                                  className={styles.compactTag}
                                >
                                  {fl.fieldName}
                                </span>
                              ))}
                            </div>
                            <span className={styles.compactTuition}>
                              {formatTuition(u.tuitionAnnual, t)}
                            </span>
                          </div>
                        </Link>
                      </li>
                    );
                  }

                  return (
                    <li key={u.universityId} className={styles.uniCard}>
                      <Link
                        to={`/dashboard/search/fields/${linkSlug}`}
                        className={styles.uniCardLink}
                      >
                        <div className={styles.uniHeader}>
                          <div>
                            <h3 className={styles.uniName}>{u.name}</h3>
                            <p className={styles.uniMeta}>
                              {u.city}, {u.country}
                            </p>
                          </div>
                          <p className={styles.uniTuition}>
                            {formatTuition(u.tuitionAnnual, t)}
                          </p>
                        </div>
                        <div className={styles.uniFieldsFull}>
                          {matchingFields.map((fl) => (
                            <div
                              key={fl.fieldId}
                              className={styles.uniFieldItem}
                            >
                              <span className={styles.uniFieldName}>
                                {fl.fieldName}
                              </span>
                              <div className={styles.uniFieldChips}>
                                {(fl.degreeLevels || []).map((d) => (
                                  <span key={d} className={styles.chipDegree}>
                                    {d}
                                  </span>
                                ))}
                                {(fl.languages || []).map((l) => (
                                  <span key={l} className={styles.chipLang}>
                                    {l}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        )}

        {!hasSelection && !loading && (
          <p className={styles.emptyState}>
            {t("searchFieldsSelectPrompt")}
          </p>
        )}
      </div>
    </PageTemplate>
  );
};

export default SearchFieldsPage;
