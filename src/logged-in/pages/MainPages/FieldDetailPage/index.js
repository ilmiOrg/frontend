import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "../../../../hooks/useLanguage";
import PageTemplate from "../../../shared/PageTemplate";
import { SelectField } from "../../../../ui-components";
import styles from "./style.module.css";
import { getUniversityFields } from "../../../../api/fields";
import { getUniversities } from "../../../../api/universities";
import { mapUniversityFromApi } from "../SearchUniversitiesPage/searchUniversitiesData";

const ALL = "all";

const FIELD_ICONS = {
  "computer-science-it": "💻",
  "business-management": "📊",
  "medicine-health": "🏥",
  law: "⚖️",
  engineering: "⚙️",
  "arts-design": "🎨",
  "social-sciences": "🌍",
  "economics-finance": "💰",
  "environmental-sciences": "🌿",
  "journalism-media": "📰",
  architecture: "🏛️",
  "data-science-ai": "🤖",
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
  const icon = field ? (FIELD_ICONS[field.fieldSlug] || "📖") : "📚";

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
