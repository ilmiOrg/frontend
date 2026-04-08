import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "../../../../hooks/useLanguage";
import { ChevronRightIcon } from "../../../shared/Icons";
import { SearchField, SelectField, NumberField, FilterChip, TextLinkButton } from "../../../../ui-components";
import { getUniversities } from "../../../../api/universities";
import { mapUniversityFromApi, ALL } from "../SearchUniversitiesPage/searchUniversitiesData";
import s from "./DashboardUniSearch.module.css";

const SHOW_COUNT = 6;

const EUROPE_COUNTRIES = new Set([
  "Germany", "France", "Netherlands", "United Kingdom", "Spain", "Italy", "Switzerland",
]);

const POPULAR_INITIAL = {
  affordable: false, budget: false, english: false, europe: false,
  business: false, medicine: false, arts: false,
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

const DEGREE_OPTIONS = [
  { value: ALL, label: "All levels" },
  { value: "bachelor", label: "Bachelor" },
  { value: "master", label: "Master" },
  { value: "phd", label: "PhD / Doctorate" },
];

const LANGUAGE_OPTIONS = [
  { value: ALL, label: "Any language" },
  { value: "English", label: "English" },
  { value: "German", label: "German" },
  { value: "French", label: "French" },
];

function matchesBusiness(specs) {
  return specs.some((x) => ["Business", "Economics", "Law", "Political Science"].includes(x));
}
function matchesMedicine(specs) {
  return specs.some((x) => ["Medicine", "Sciences"].includes(x));
}
function matchesArts(specs) {
  return specs.some((x) => ["Arts", "Design", "Architecture", "Media"].includes(x));
}

function formatTuition(n) {
  if (n === 0) return "Free";
  return `€${n.toLocaleString()}`;
}

function badgeLetters(name) {
  const skip = new Set(["of", "the", "and", "university", "college", "international"]);
  const parts = name.split(/\s+/).filter((w) => !skip.has(w.toLowerCase()));
  if (parts.length >= 2 && parts[0][0] && parts[1][0]) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase() || "UNI";
}

export default function DashboardUniSearch() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [nameQuery, setNameQuery] = useState("");
  const [tuitionMin, setTuitionMin] = useState("");
  const [tuitionMax, setTuitionMax] = useState("");
  const [country, setCountry] = useState(ALL);
  const [degreeLevel, setDegreeLevel] = useState(ALL);
  const [language, setLanguage] = useState(ALL);
  const [popular, setPopular] = useState(() => ({ ...POPULAR_INITIAL }));
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUniversities()
      .then((items) => setUniversities(items.map(mapUniversityFromApi)))
      .catch(() => setUniversities([]))
      .finally(() => setLoading(false));
  }, []);

  const countryOptions = useMemo(() => {
    const countries = [...new Set(universities.map((u) => u.country))].sort();
    return [{ value: ALL, label: "All countries" }, ...countries.map((c) => ({ value: c, label: c }))];
  }, [universities]);

  const togglePopular = useCallback((key) => {
    setPopular((p) => ({ ...p, [key]: !p[key] }));
  }, []);

  const resetFilters = useCallback(() => {
    setNameQuery("");
    setTuitionMin("");
    setTuitionMax("");
    setCountry(ALL);
    setDegreeLevel(ALL);
    setLanguage(ALL);
    setPopular({ ...POPULAR_INITIAL });
  }, []);

  const filtered = useMemo(() => {
    const minT = tuitionMin === "" ? null : Math.max(0, Number(tuitionMin) || 0);
    const maxT = tuitionMax === "" ? null : Math.max(0, Number(tuitionMax) || 0);
    const q = nameQuery.trim().toLowerCase();

    return universities.filter((u) => {
      if (q && !u.name.toLowerCase().includes(q)) return false;
      if (country !== ALL && u.country !== country) return false;
      if (degreeLevel !== ALL && !u.degreeLevels.includes(degreeLevel)) return false;
      if (language !== ALL && !u.languages.includes(language)) return false;
      if (minT !== null && u.tuitionAnnual < minT) return false;
      if (maxT !== null && u.tuitionAnnual > maxT) return false;
      if (popular.affordable && u.tuitionAnnual > 10000) return false;
      if (popular.budget && u.tuitionAnnual > 5000) return false;
      if (popular.english && !u.languages.includes("English")) return false;
      if (popular.europe && !EUROPE_COUNTRIES.has(u.country)) return false;
      if (popular.business && !matchesBusiness(u.specializations)) return false;
      if (popular.medicine && !matchesMedicine(u.specializations)) return false;
      if (popular.arts && !matchesArts(u.specializations)) return false;
      return true;
    });
  }, [nameQuery, tuitionMin, tuitionMax, country, degreeLevel, language, popular, universities]);

  const visible = filtered.slice(0, SHOW_COUNT);

  return (
    <div className={s.root}>
      <SearchField
        value={nameQuery}
        onChange={setNameQuery}
        placeholder="Search by university or college name…"
      />

      <div className={s.filtersHead}>
        <h3 className={s.panelTitle}>Popular filters</h3>
        <TextLinkButton onClick={resetFilters}>Clear all</TextLinkButton>
      </div>

      <div className={s.chipRow}>
        {POPULAR_CHIPS.map(({ key, label }) => (
          <FilterChip key={key} pressed={popular[key]} onToggle={() => togglePopular(key)}>
            {label}
          </FilterChip>
        ))}
      </div>

      <div className={s.divider} />

      <div className={s.filterGrid}>
        <SelectField compact label="Country" value={country} onChange={setCountry} options={countryOptions} />
        <SelectField compact label="Degree level" value={degreeLevel} onChange={setDegreeLevel} options={DEGREE_OPTIONS} />
        <SelectField compact label="Language" value={language} onChange={setLanguage} options={LANGUAGE_OPTIONS} />
        <div>
          <div className={s.tuitionLabel}>Tuition per year (€)</div>
          <div className={s.tuitionRow}>
            <NumberField value={tuitionMin} onChange={setTuitionMin} placeholder="Min" />
            <span className={s.tuitionSep}>—</span>
            <NumberField value={tuitionMax} onChange={setTuitionMax} placeholder="Max" />
          </div>
        </div>
      </div>

      <p className={s.resultCount}>
        {loading ? "Loading…" : `${filtered.length} ${filtered.length === 1 ? "result" : "results"}`}
      </p>

      {!loading && filtered.length === 0 && (
        <p className={s.empty}>{t("searchNoResults")}</p>
      )}

      {!loading && visible.length > 0 && (
        <ul className={s.cardList}>
          {visible.map((u) => (
            <li key={u.universityId}>
              <Link to={`/dashboard/search/universities/${u.slug}`} className={s.compactCard}>
                <div className={s.cardBadge}>
                  {u.logoUrl ? (
                    <img src={u.logoUrl} alt="" className={s.badgeLogo} loading="lazy" />
                  ) : (
                    <span className={s.badgeText}>{u.abbr || badgeLetters(u.name)}</span>
                  )}
                </div>
                <div className={s.cardBody}>
                  <h4 className={s.cardName}>{u.name}</h4>
                  <p className={s.cardMeta}>{u.city}, {u.country}</p>
                </div>
                <span className={s.cardTuition}>{formatTuition(u.tuitionAnnual)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {!loading && filtered.length > SHOW_COUNT && (
        <button
          type="button"
          className={s.showMore}
          onClick={() => navigate("/dashboard/search/universities")}
        >
          Show all {filtered.length} universities <ChevronRightIcon size={14} />
        </button>
      )}
    </div>
  );
}
