import React, { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PageTemplate from "../../../shared/PageTemplate";
import {
  SearchField,
  SelectField,
  NumberField,
  FilterChip,
  TextLinkButton,
  AccentButton,
} from "../../../../ui-components";
import styles from "./style.module.css";
import UniversityResultCard from "./UniversityResultCard";
import {
  MOCK_UNIVERSITIES,
  ALL,
  ALL_CITIES,
  COUNTRY_OPTIONS,
  SPECIALIZATION_OPTIONS,
  citiesForCountry,
} from "./searchUniversitiesData";

const EUROPE_COUNTRIES = new Set([
  "Germany",
  "France",
  "United Kingdom",
  "Netherlands",
  "Spain",
  "Italy",
  "Switzerland",
]);

const POPULAR_INITIAL = {
  affordable: false,
  budget: false,
  english: false,
  europe: false,
  business: false,
  medicine: false,
  arts: false,
};

const POPULAR_CHIPS = [
  { key: "affordable", label: "Under €10k / year" },
  { key: "budget", label: "≤ €5k / year" },
  { key: "english", label: "English taught" },
  { key: "europe", label: "Europe" },
  { key: "business", label: "Business & law" },
  { key: "medicine", label: "Medicine & sciences" },
  { key: "arts", label: "Arts & design" },
];

const INSTITUTION_OPTIONS = [
  { value: ALL, label: "All" },
  { value: "university", label: "Universities only" },
  { value: "college", label: "Colleges only" },
];

const DEGREE_OPTIONS = [
  { value: ALL, label: "All levels" },
  { value: "associate", label: "Associate" },
  { value: "diploma", label: "Diploma" },
  { value: "bachelor", label: "Bachelor" },
  { value: "master", label: "Master" },
  { value: "phd", label: "PhD / Doctorate" },
];

const LANGUAGE_OPTIONS = [
  { value: ALL, label: "Any language" },
  { value: "English", label: "English" },
  { value: "German", label: "German" },
  { value: "French", label: "French" },
  { value: "Spanish", label: "Spanish" },
  { value: "Dutch", label: "Dutch" },
  { value: "Catalan", label: "Catalan" },
];

function matchesBusiness(specs) {
  return specs.some((s) =>
    ["Business", "Economics", "Law", "Political Science"].includes(s)
  );
}

function matchesMedicine(specs) {
  return specs.some((s) => ["Medicine", "Sciences"].includes(s));
}

function matchesArts(specs) {
  return specs.some((s) =>
    ["Arts", "Design", "Architecture", "Media"].includes(s)
  );
}

const SearchUniversitiesPage = () => {
  const navigate = useNavigate();

  const [nameQuery, setNameQuery] = useState("");
  const [institutionType, setInstitutionType] = useState(ALL);
  const [tuitionMin, setTuitionMin] = useState("");
  const [tuitionMax, setTuitionMax] = useState("");
  const [country, setCountry] = useState(ALL);
  const [city, setCity] = useState(ALL_CITIES);
  const [specialization, setSpecialization] = useState(ALL);
  const [degreeLevel, setDegreeLevel] = useState(ALL);
  const [language, setLanguage] = useState(ALL);
  const [popular, setPopular] = useState(() => ({ ...POPULAR_INITIAL }));
  const [favoriteIds, setFavoriteIds] = useState(() => new Set());

  const toggleFavorite = useCallback((id) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const countrySelectOptions = useMemo(
    () =>
      COUNTRY_OPTIONS.map((c) => ({
        value: c,
        label: c === ALL ? "All countries" : c,
      })),
    []
  );

  const specializationSelectOptions = useMemo(
    () =>
      SPECIALIZATION_OPTIONS.map((s) => ({
        value: s,
        label: s === ALL ? "All fields" : s,
      })),
    []
  );

  const cityOptions = useMemo(() => citiesForCountry(country), [country]);

  const citySelectOptions = useMemo(
    () =>
      cityOptions.map((ct) => ({
        value: ct,
        label:
          ct === ALL_CITIES ? "All cities in this country" : ct,
      })),
    [cityOptions]
  );

  const togglePopular = useCallback((key) => {
    setPopular((p) => ({ ...p, [key]: !p[key] }));
  }, []);

  const filtered = useMemo(() => {
    const minT =
      tuitionMin === "" ? null : Math.max(0, Number(tuitionMin) || 0);
    const maxT =
      tuitionMax === "" ? null : Math.max(0, Number(tuitionMax) || 0);
    const q = nameQuery.trim().toLowerCase();

    return MOCK_UNIVERSITIES.filter((u) => {
      if (q && !u.name.toLowerCase().includes(q)) return false;
      if (institutionType !== ALL && u.type !== institutionType) return false;
      if (country !== ALL && u.country !== country) return false;
      if (country !== ALL && city !== ALL_CITIES && u.city !== city)
        return false;
      if (
        specialization !== ALL &&
        !u.specializations.includes(specialization)
      )
        return false;
      if (degreeLevel !== ALL && !u.degreeLevels.includes(degreeLevel))
        return false;
      if (language !== ALL && !u.languages.includes(language)) return false;
      if (minT !== null && u.tuitionAnnual < minT) return false;
      if (maxT !== null && u.tuitionAnnual > maxT) return false;

      if (popular.affordable && u.tuitionAnnual > 10000) return false;
      if (popular.budget && u.tuitionAnnual > 5000) return false;
      if (popular.english && !u.languages.includes("English")) return false;
      if (popular.europe && !EUROPE_COUNTRIES.has(u.country)) return false;
      if (popular.business && !matchesBusiness(u.specializations))
        return false;
      if (popular.medicine && !matchesMedicine(u.specializations))
        return false;
      if (popular.arts && !matchesArts(u.specializations)) return false;

      return true;
    });
  }, [
    nameQuery,
    institutionType,
    tuitionMin,
    tuitionMax,
    country,
    city,
    specialization,
    degreeLevel,
    language,
    popular,
  ]);

  const resetFilters = useCallback(() => {
    setNameQuery("");
    setInstitutionType(ALL);
    setTuitionMin("");
    setTuitionMax("");
    setCountry(ALL);
    setCity(ALL_CITIES);
    setSpecialization(ALL);
    setDegreeLevel(ALL);
    setLanguage(ALL);
    setPopular({ ...POPULAR_INITIAL });
  }, []);

  const smartMatch = useCallback(() => {
    navigate("/dashboard/ai/match-universities");
  }, [navigate]);

  return (
    <PageTemplate
      headerShellClassName={styles.searchHeaderShell}
      icon="🔍"
      title="Search universities & colleges"
      actions={<AccentButton onClick={smartMatch}>Smart Match</AccentButton>}
    >
      <div className={styles.layout}>
        <section
          className={styles.filtersPanel}
          aria-labelledby="filters-heading"
        >
          <SearchField
            value={nameQuery}
            onChange={setNameQuery}
            placeholder="Search by university or college name…"
            label="Search by institution name"
          />

          <div className={styles.filtersHead}>
            <h2 id="filters-heading" className={styles.panelTitle}>
              Popular filters
            </h2>
            <TextLinkButton onClick={resetFilters}>Clear all</TextLinkButton>
          </div>

          <div className={styles.chipRow}>
            {POPULAR_CHIPS.map(({ key, label }) => (
              <FilterChip
                key={key}
                pressed={popular[key]}
                onToggle={() => togglePopular(key)}
              >
                {label}
              </FilterChip>
            ))}
          </div>

          <div className={styles.filtersDivider} aria-hidden />

          <div className={styles.filterGrid}>
            <div className={styles.rowInstitutionTuition}>
              <SelectField
                className={styles.institutionField}
                compact
                label="Institution type"
                value={institutionType}
                onChange={setInstitutionType}
                options={INSTITUTION_OPTIONS}
              />
              <div className={styles.rangeField}>
                <span className={styles.rangeLabel}>Tuition per year (€)</span>
                <div className={styles.rangeRow}>
                  <NumberField
                    value={tuitionMin}
                    onChange={setTuitionMin}
                    placeholder="Min"
                  />
                  <span className={styles.rangeSep}>—</span>
                  <NumberField
                    value={tuitionMax}
                    onChange={setTuitionMax}
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>

            <SelectField
              label="Country"
              value={country}
              onChange={(v) => {
                setCountry(v);
                setCity(ALL_CITIES);
              }}
              options={countrySelectOptions}
            />

            {country !== ALL && (
              <SelectField
                label="City / region"
                value={city}
                onChange={setCity}
                options={citySelectOptions}
              />
            )}

            <SelectField
              label="Field of study"
              value={specialization}
              onChange={setSpecialization}
              options={specializationSelectOptions}
            />

            <SelectField
              label="Degree level"
              value={degreeLevel}
              onChange={setDegreeLevel}
              options={DEGREE_OPTIONS}
            />

            <SelectField
              label="Language of instruction"
              value={language}
              onChange={setLanguage}
              options={LANGUAGE_OPTIONS}
            />
          </div>
        </section>

        <section className={styles.resultsSection} aria-live="polite">
          <div className={styles.resultsHeader}>
            <h2 className={styles.resultsTitle}>Matching institutions</h2>
            <span className={styles.resultsCount}>
              {filtered.length}{" "}
              {filtered.length === 1 ? "result" : "results"}
            </span>
          </div>

          {filtered.length === 0 ? (
            <p className={styles.emptyState}>No institutions match.</p>
          ) : (
            <ul className={styles.resultList}>
              {filtered.map((u) => (
                <UniversityResultCard
                  key={u.id}
                  university={u}
                  isFavorite={favoriteIds.has(u.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </ul>
          )}
        </section>
      </div>
    </PageTemplate>
  );
};

export default SearchUniversitiesPage;
