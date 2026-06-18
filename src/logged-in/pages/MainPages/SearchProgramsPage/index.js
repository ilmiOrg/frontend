import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import { useTranslation } from "../../../../hooks/useLanguage";
import { useDebounce } from "../../../../hooks/useDebounce";
import PageTemplate from "../../../shared/PageTemplate";
import { GraduationCapIcon, StarIcon } from "../../../shared/Icons";
import {
  SearchField,
  SelectField,
  NumberField,
  TextLinkButton,
} from "../../../../ui-components";
import styles from "./style.module.css";
import { searchPrograms, getProgramCategories, getFavoritePrograms, addFavoriteProgram, removeFavoriteProgram } from "../../../../api/programs";
import { getCountries } from "../../../../api/countries";

const ALL = "all";

const DEGREE_OPTIONS = [
  { value: ALL, labelKey: "searchUniDegreeAll" },
  { value: "bachelor", labelKey: "searchUniDegreeBachelor" },
  { value: "master", labelKey: "searchUniDegreeMaster" },
  { value: "phd", labelKey: "searchUniDegreePhd" },
];

const LANGUAGE_OPTIONS = [
  { value: ALL, labelKey: "searchUniLangAny" },
  { value: "English", labelKey: "searchUniLangEnglish" },
  { value: "German", labelKey: "searchUniLangGerman" },
  { value: "French", labelKey: "searchUniLangFrench" },
  { value: "Spanish", labelKey: "searchUniLangSpanish" },
  { value: "Dutch", labelKey: "searchUniLangDutch" },
  { value: "Italian", labelKey: "searchUniLangItalian" },
  { value: "Japanese", labelKey: "searchUniLangJapanese" },
  { value: "Korean", labelKey: "searchUniLangKorean" },
];

const SearchProgramsPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const isGuest = user?.isGuest === true;

  const [nameQuery, setNameQuery] = useState("");
  const debouncedNameQuery = useDebounce(nameQuery, 300);
  const [categoryId, setCategoryId] = useState(ALL);
  const [countryId, setCountryId] = useState(ALL);
  const [degreeLevel, setDegreeLevel] = useState(ALL);
  const [language, setLanguage] = useState(ALL);
  const [tuitionMin, setTuitionMin] = useState("");
  const [tuitionMax, setTuitionMax] = useState("");

  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState(() => new Set());
  const favoriteIdsRef = useRef(favoriteIds);

  useEffect(() => {
    favoriteIdsRef.current = favoriteIds;
  }, [favoriteIds]);

  useEffect(() => {
    getProgramCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  useEffect(() => {
    getCountries()
      .then(setCountries)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isGuest) return;
    getFavoritePrograms()
      .then((list) => setFavoriteIds(new Set(list.map((p) => p.programId))))
      .catch(() => {});
  }, [isGuest]);

  useEffect(() => {
    let active = true; // ignore a stale response if filters changed before it resolved
    setLoading(true);
    const params = {};
    if (debouncedNameQuery.trim()) params.name = debouncedNameQuery.trim();
    if (categoryId !== ALL) params.categoryId = categoryId;
    if (countryId !== ALL) params.countryId = countryId;
    if (degreeLevel !== ALL) params.degreeLevel = degreeLevel;
    if (language !== ALL) params.language = language;
    if (tuitionMin !== "") params.minTuition = tuitionMin;
    if (tuitionMax !== "") params.maxTuition = tuitionMax;

    searchPrograms(params)
      .then((d) => {
        if (active) setPrograms(d);
      })
      .catch(() => {
        if (active) setPrograms([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [debouncedNameQuery, categoryId, countryId, degreeLevel, language, tuitionMin, tuitionMax]);

  const categoryOptions = useMemo(
    () => [
      { value: ALL, label: t("programsAllCategories") },
      ...categories.map((c) => ({ value: c.categoryId, label: c.categoryName })),
    ],
    [categories, t]
  );

  const countryOptions = useMemo(
    () => [
      { value: ALL, label: t("programsAllCountries") },
      ...countries.map((c) => ({ value: c.countryId, label: c.countryName })),
    ],
    [countries, t]
  );

  const degreeOptions = useMemo(
    () => DEGREE_OPTIONS.map((o) => ({ value: o.value, label: t(o.labelKey) })),
    [t]
  );

  const languageOptions = useMemo(
    () => LANGUAGE_OPTIONS.map((o) => ({ value: o.value, label: t(o.labelKey) })),
    [t]
  );

  const formatTuition = useCallback(
    (amount, currency) => {
      if (amount === null || amount === undefined || amount === "") return "";
      if (Number(amount) === 0) return t("programsTuitionFree");
      return `${currency} ${Number(amount).toLocaleString()} ${t("tuitionPerYear")}`;
    },
    [t]
  );

  const resetFilters = useCallback(() => {
    setNameQuery("");
    setCategoryId(ALL);
    setCountryId(ALL);
    setDegreeLevel(ALL);
    setLanguage(ALL);
    setTuitionMin("");
    setTuitionMax("");
  }, []);

  const toggleFavorite = useCallback(
    (programId) => {
      if (isGuest) {
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          if (next.has(programId)) next.delete(programId);
          else next.add(programId);
          return next;
        });
        return;
      }

      const wasFavorite = favoriteIdsRef.current.has(programId);

      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (next.has(programId)) next.delete(programId);
        else next.add(programId);
        return next;
      });

      const apiFn = wasFavorite ? removeFavoriteProgram : addFavoriteProgram;
      apiFn(programId).catch(() => {
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          if (wasFavorite) next.add(programId);
          else next.delete(programId);
          return next;
        });
      });
    },
    [isGuest]
  );

  return (
    <PageTemplate icon={<GraduationCapIcon size={22} />} title={t("searchProgramsTitle")}>
      <div className={styles.layout}>
        <section className={styles.filtersPanel}>
          <SearchField
            value={nameQuery}
            onChange={setNameQuery}
            placeholder={t("searchProgramsPlaceholder")}
            label={t("searchProgramsPlaceholder")}
          />

          <div className={styles.filtersHead}>
            <h2 className={styles.panelTitle}>{t("searchProgramsFilters")}</h2>
            <TextLinkButton onClick={resetFilters}>
              {t("searchFieldsClearAll")}
            </TextLinkButton>
          </div>

          <div className={styles.filterGrid}>
            <SelectField
              label={t("searchProgramsCategory")}
              value={categoryId}
              onChange={setCategoryId}
              options={categoryOptions}
            />

            <SelectField
              label={t("searchProgramsCountry")}
              value={countryId}
              onChange={setCountryId}
              options={countryOptions}
            />

            <SelectField
              label={t("searchFieldsDegreeLevel")}
              value={degreeLevel}
              onChange={setDegreeLevel}
              options={degreeOptions}
            />

            <SelectField
              label={t("searchFieldsLanguage")}
              value={language}
              onChange={setLanguage}
              options={languageOptions}
            />

            <div className={styles.rangeField}>
              <span className={styles.rangeLabel}>{t("searchFieldsTuition")}</span>
              <div className={styles.rangeRow}>
                <NumberField
                  value={tuitionMin}
                  onChange={setTuitionMin}
                  placeholder={t("tuitionMin")}
                />
                <span className={styles.rangeSep}>—</span>
                <NumberField
                  value={tuitionMax}
                  onChange={setTuitionMax}
                  placeholder={t("tuitionMax")}
                />
              </div>
            </div>
          </div>
        </section>

        <section className={styles.resultsSection} aria-live="polite">
          <div className={styles.resultsHeader}>
            <h2 className={styles.resultsTitle}>
              {t("searchProgramsResults")}
            </h2>
            <span className={styles.resultsCount}>
              {programs.length}{" "}
              {programs.length === 1 ? t("programResultOne") : t("programResultMany")}
            </span>
          </div>

          {loading ? (
            <p className={styles.emptyState}>{t("searchFieldsLoading")}</p>
          ) : programs.length === 0 ? (
            <p className={styles.emptyState}>{t("searchNoResults")}</p>
          ) : (
            <ul className={styles.resultList}>
              {programs.map((p) => {
                const isFav = favoriteIds.has(p.programId);
                return (
                  <li key={p.programId} className={styles.programCard}>
                    <Link
                      to={`/dashboard/search/programs/${p.programId}`}
                      className={styles.programCardLink}
                    >
                      <div className={styles.programHeader}>
                        <h3 className={styles.programName}>{p.programName}</h3>
                        <span className={styles.programCategory}>
                          {p.categoryName}
                        </span>
                      </div>
                      <p className={styles.programMeta}>
                        {[
                          p.universityName,
                          [p.city, p.countryName].filter(Boolean).join(", "),
                          p.degreeLevel,
                          p.language,
                          p.durationYears ? `${p.durationYears} yr` : null,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                      <p className={styles.programDescription}>
                        {p.description}
                      </p>
                    </Link>
                    <div className={styles.programFooter}>
                      <p className={styles.programTuition}>
                        {formatTuition(p.tuitionPerYear, p.currency)}
                      </p>
                      <div className={styles.programActions}>
                        <button
                          type="button"
                          className={`${styles.btn} ${styles.btnGhost}`}
                          onClick={() => toggleFavorite(p.programId)}
                          aria-pressed={isFav}
                        >
                          {isFav
                            ? <><StarIcon size={14} /> {t("favoriteSaved")}</>
                            : <><StarIcon size={14} /> {t("favoriteSave")}</>}
                        </button>
                        <Link
                          className={`${styles.btn} ${styles.btnOutline}`}
                          to={`/dashboard/search/programs/${p.programId}`}
                        >
                          {t("searchFieldsViewDetails")}
                        </Link>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </PageTemplate>
  );
};

export default SearchProgramsPage;
