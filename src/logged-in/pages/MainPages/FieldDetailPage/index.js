import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "../../../../hooks/useLanguage";
import PageTemplate from "../../../shared/PageTemplate";
import { BookOpenIcon, LaptopIcon, BarChartIcon, HeartPulseIcon, ScaleIcon, GearIcon, PaletteIcon, GlobeIcon, DollarIcon, LeafIcon, NewspaperIcon, BuildingIcon, BrainIcon } from "../../../shared/Icons";
import { SelectField } from "../../../../ui-components";
import styles from "./style.module.css";
import { getUniversityFields } from "../../../../api/fields";
import { getUniversities } from "../../../../api/universities";
import { mapUniversityFromApi } from "../SearchUniversitiesPage/searchUniversitiesData";

const ALL = "all";

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
    { value: "English", label: t("searchUniLangEnglish") },
    { value: "German", label: t("searchUniLangGerman") },
    { value: "French", label: t("searchUniLangFrench") },
    { value: "Spanish", label: t("searchUniLangSpanish") },
    { value: "Dutch", label: t("searchUniLangDutch") },
    { value: "Italian", label: t("searchUniLangItalian") },
    { value: "Japanese", label: t("searchUniLangJapanese") },
    { value: "Korean", label: t("searchUniLangKorean") },
  ];
}

function formatTuition(n, t) {
  if (n === 0) return t("tuitionFree");
  return `≈ €${n.toLocaleString()} ${t("tuitionPerYear")}`;
}

const FieldDetailPage = () => {
  const { slug } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [field, setField] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [degreeLevel, setDegreeLevel] = useState(ALL);
  const [language, setLanguage] = useState(ALL);

  useEffect(() => {
    getUniversityFields()
      .then((fields) => {
        const found = fields.find((f) => f.fieldSlug === slug) || null;
        setField(found);
      })
      .catch(() => setField(null));
  }, [slug]);

  useEffect(() => {
    setLoading(true);
    getUniversities()
      .then((items) => setUniversities(items.map(mapUniversityFromApi)))
      .catch(() => setUniversities([]))
      .finally(() => setLoading(false));
  }, []);

  const matchingUnis = useMemo(() => {
    if (!field) return [];

    return universities.filter((u) => {
      const uniFields = u.fields || [];
      const fieldLink = uniFields.find((f) => f.fieldId === field.fieldId);
      if (!fieldLink) return false;

      if (degreeLevel !== ALL) {
        if (!(fieldLink.degreeLevels || []).includes(degreeLevel)) return false;
      }

      if (language !== ALL) {
        if (!(fieldLink.languages || []).includes(language)) return false;
      }

      return true;
    });
  }, [universities, field, degreeLevel, language]);

  const pageTitle = field ? field.fieldName : t("searchFieldsLoading");
  const icon = field ? (FIELD_ICONS[field.fieldSlug] || <BookOpenIcon size={22} />) : <BookOpenIcon size={22} />;

  return (
    <PageTemplate icon={icon} title={pageTitle} onBack={() => navigate(-1)}>
      <div className={styles.layout}>
        {field && (
          <div className={styles.fieldHeader}>
            <span className={styles.fieldIcon}>{icon}</span>
            <div className={styles.fieldInfo}>
              <h1 className={styles.fieldName}>{field.fieldName}</h1>
              <p className={styles.fieldCount}>
                {matchingUnis.length}{" "}
                {matchingUnis.length === 1
                  ? t("fieldDetailUniSingular")
                  : t("fieldDetailUniPlural")}
              </p>
            </div>
          </div>
        )}

        <div className={styles.filterBar}>
          <div className={styles.filterItem}>
            <SelectField
              label={t("searchFieldsDegreeLevel")}
              value={degreeLevel}
              onChange={setDegreeLevel}
              options={getDegreeOptions(t)}
            />
          </div>
          <div className={styles.filterItem}>
            <SelectField
              label={t("searchFieldsLanguage")}
              value={language}
              onChange={setLanguage}
              options={getLanguageOptions(t)}
            />
          </div>
        </div>

        <div className={styles.uniGrid}>
          {loading ? (
            <p className={styles.emptyState}>{t("searchFieldsLoading")}</p>
          ) : matchingUnis.length === 0 ? (
            <p className={styles.emptyState}>{t("searchNoResults")}</p>
          ) : (
            matchingUnis.map((u) => {
              const fieldLink = (u.fields || []).find(
                (f) => f.fieldId === field.fieldId
              );
              return (
                <Link
                  key={u.universityId}
                  className={styles.uniCard}
                  to={`/dashboard/search/universities/${u.slug}`}
                >
                  <h3 className={styles.uniName}>{u.name}</h3>
                  <p className={styles.uniMeta}>
                    {u.city}, {u.country}
                  </p>
                  <p className={styles.uniTuition}>
                    {formatTuition(u.tuitionAnnual, t)}
                  </p>
                  {fieldLink && (
                    <p className={styles.uniFieldMeta}>
                      {(fieldLink.degreeLevels || []).join(", ")} ·{" "}
                      {(fieldLink.languages || []).join(", ")}
                    </p>
                  )}
                </Link>
              );
            })
          )}
        </div>
      </div>
    </PageTemplate>
  );
};

export default FieldDetailPage;
