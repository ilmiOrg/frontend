import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "../../../../hooks/useLanguage";
import PageTemplate from "../../../shared/PageTemplate";
import { BookOpenIcon, GraduationCapIcon, LaptopIcon, BarChartIcon, HeartPulseIcon, ScaleIcon, GearIcon, PaletteIcon, GlobeIcon, DollarIcon, LeafIcon, NewspaperIcon, BuildingIcon, BrainIcon, ChevronRightIcon } from "../../../shared/Icons";
import styles from "./FieldUniversityDetailPage.module.css";
import { getUniversityFields } from "../../../../api/fields";
import { getUniversities } from "../../../../api/universities";
import { mapUniversityFromApi } from "../SearchUniversitiesPage/searchUniversitiesData";

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

function formatTuition(n, t) {
  if (n === 0) return t("tuitionFree");
  return `≈ €${n.toLocaleString()} ${t("tuitionPerYear")}`;
}

export default function FieldUniversityDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const parts = slug.split("+");
  const uniSlug = parts[0];
  const fieldSlugs = parts.slice(1);

  const [allFields, setAllFields] = useState([]);
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getUniversityFields(), getUniversities()])
      .then(([fieldsData, uniData]) => {
        setAllFields(fieldsData);
        const mapped = uniData.map(mapUniversityFromApi);
        const found = mapped.find((u) => u.slug === uniSlug) || null;
        setUniversity(found);
      })
      .catch(() => {
        setAllFields([]);
        setUniversity(null);
      })
      .finally(() => setLoading(false));
  }, [uniSlug]);

  const selectedFields = useMemo(() => {
    if (!university) return [];
    const uniFields = university.fields || [];
    const fieldSlugSet = new Set(fieldSlugs);

    return uniFields.filter((uf) => {
      const master = allFields.find((f) => f.fieldId === uf.fieldId);
      return master && fieldSlugSet.has(master.fieldSlug);
    }).map((uf) => {
      const master = allFields.find((f) => f.fieldId === uf.fieldId);
      return { ...uf, fieldSlug: master?.fieldSlug || "" };
    });
  }, [university, allFields, fieldSlugs]);

  if (loading) {
    return (
      <PageTemplate icon={<BookOpenIcon size={22} />} title={t("searchFieldsLoading")} onBack={() => navigate(-1)}>
        <p className={styles.loadingText}>{t("searchFieldsLoading")}</p>
      </PageTemplate>
    );
  }

  if (!university) {
    return (
      <PageTemplate icon={<BookOpenIcon size={22} />} title={t("fieldUniNotFound")} onBack={() => navigate(-1)}>
        <div className={styles.emptyState}>
          <p>{t("fieldUniNotFound")}</p>
          <Link className={styles.backBtn} to="/dashboard/search/fields">
            {t("fieldUniBackToFields")}
          </Link>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate
      icon={<GraduationCapIcon size={22} />}
      title={university.name}
      onBack={() => navigate(-1)}
    >
      <div className={styles.layout}>
        <div className={styles.uniCard}>
          <img
            className={styles.heroImg}
            src={university.imageUrl}
            alt=""
            width={960}
            height={300}
          />
          <div className={styles.uniInfo}>
            <h1 className={styles.uniName}>{university.name}</h1>
            <p className={styles.uniMeta}>
              {university.city}, {university.country}
            </p>
            <p className={styles.uniTuition}>
              {formatTuition(university.tuitionAnnual, t)}
            </p>
            {university.shortDescription && (
              <p className={styles.uniDesc}>{university.shortDescription}</p>
            )}
          </div>
        </div>

        <section className={styles.fieldsSection}>
          <h2 className={styles.sectionTitle}>
            {t("fieldUniSelectedFields")} ({selectedFields.length})
          </h2>

          {selectedFields.length === 0 ? (
            <p className={styles.emptyNote}>{t("fieldUniNoMatchingFields")}</p>
          ) : (
            <div className={styles.fieldCards}>
              {selectedFields.map((f) => (
                <div key={f.fieldId} className={styles.fieldCard}>
                  <div className={styles.fieldCardHeader}>
                    <span className={styles.fieldIcon}>
                      {FIELD_ICONS[f.fieldSlug] || <BookOpenIcon size={18} />}
                    </span>
                    <h3 className={styles.fieldName}>{f.fieldName}</h3>
                    <Link
                      to={`/dashboard/search/fields/${f.fieldSlug}`}
                      className={styles.fieldViewLink}
                    >
                      {t("searchFieldsViewDetails")} <ChevronRightIcon size={14} />
                    </Link>
                  </div>

                  <div className={styles.fieldDetails}>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>
                        {t("fieldUniDegrees")}
                      </span>
                      <div className={styles.detailChips}>
                        {(f.degreeLevels || []).length > 0 ? (
                          f.degreeLevels.map((d) => (
                            <span key={d} className={styles.chip}>
                              {d}
                            </span>
                          ))
                        ) : (
                          <span className={styles.chipEmpty}>—</span>
                        )}
                      </div>
                    </div>

                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>
                        {t("fieldUniLanguages")}
                      </span>
                      <div className={styles.detailChips}>
                        {(f.languages || []).length > 0 ? (
                          f.languages.map((l) => (
                            <span key={l} className={styles.chipLang}>
                              {l}
                            </span>
                          ))
                        ) : (
                          <span className={styles.chipEmpty}>—</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className={styles.actions}>
          <Link
            to={`/dashboard/search/universities/${university.slug}`}
            className={styles.viewFullBtn}
          >
            {t("fieldUniViewFull")}
          </Link>
        </div>
      </div>
    </PageTemplate>
  );
}
