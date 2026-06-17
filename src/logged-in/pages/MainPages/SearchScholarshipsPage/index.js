import React, { useEffect, useState } from "react";
import PageTemplate from "../../../shared/PageTemplate";
import { AwardIcon } from "../../../shared/Icons";
import { SelectField } from "../../../../ui-components";
import { getScholarships } from "../../../../api/scholarships";
import { useTranslation } from "../../../../hooks/useLanguage";
import s from "../../../shared/ContentPage/style.module.css";
import local from "./style.module.css";

const FIELD_VALUES = [
  "COMPUTER_SCIENCE", "ENGINEERING", "MEDICINE", "LAW", "BUSINESS", "ECONOMICS",
  "MATHEMATICS", "PHYSICS", "BIOLOGY", "CHEMISTRY", "HUMANITIES", "SOCIAL_SCIENCES",
  "ARTS", "EDUCATION", "ARCHITECTURE",
];

function pretty(v) {
  return String(v || "").toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function awardLabel(sc, t) {
  if (sc.awardType === "FULL_TUITION") return t("searchScholarshipsAwardFullTuition");
  if (sc.awardType === "PERCENTAGE_OFF_TUITION" && sc.awardValue != null) return t("searchScholarshipsAwardPercentOff").replace("{value}", Number(sc.awardValue));
  if (sc.awardType === "FIXED_AMOUNT" && sc.awardValue != null) return `${Number(sc.awardValue).toLocaleString()} ${sc.currency || ""}`;
  return pretty(sc.awardType || t("searchScholarshipsAwardDefault"));
}

const SearchScholarshipsPage = () => {
  const { t } = useTranslation();
  const FIELD_OPTIONS = [
    { value: "", label: t("searchScholarshipsAllFields") },
    ...FIELD_VALUES.map((v) => ({ value: v, label: pretty(v) })),
  ];
  const DEGREE_OPTIONS = [
    { value: "", label: t("searchScholarshipsAllLevels") },
    { value: "BACHELOR", label: t("searchScholarshipsLevelBachelor") },
    { value: "MASTER", label: t("searchScholarshipsLevelMaster") },
    { value: "DOCTORATE", label: t("searchScholarshipsLevelDoctorate") },
  ];
  const [field, setField] = useState("");
  const [degree, setDegree] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    const filters = {};
    if (field) filters.field = field;
    if (degree) filters.degree = degree;
    getScholarships(filters)
      .then((data) => active && setItems(Array.isArray(data) ? data : []))
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [field, degree]);

  return (
    <PageTemplate
      icon={<AwardIcon size={22} />}
      title={t("searchScholarshipsPageTitle")}
      description={t("searchScholarshipsPageDesc")}
    >
      <div className={s.layout}>
        <div className={s.introPanel}>
          <div className={local.filterRow}>
            <SelectField label={t("searchScholarshipsFieldLabel")} value={field} onChange={setField} options={FIELD_OPTIONS} />
            <SelectField label={t("searchScholarshipsLevelLabel")} value={degree} onChange={setDegree} options={DEGREE_OPTIONS} />
          </div>
        </div>

        {loading ? (
          <p className={s.emptyState}>{t("searchScholarshipsLoading")}</p>
        ) : error ? (
          <p className={s.emptyState}>{error}</p>
        ) : items.length === 0 ? (
          <p className={s.emptyState}>{t("searchScholarshipsEmpty")}</p>
        ) : (
          <>
            <h3 className={s.sectionLabel}>{t("searchScholarshipsCount").replace("{count}", items.length)}</h3>
            <div className={s.cardGrid}>
              {items.map((sc) => (
                <div className={s.contentCard} key={sc.id}>
                  <div className={s.cardHeader}>
                    <div className={s.cardIcon}><AwardIcon size={20} /></div>
                    <div>
                      <h4 className={s.cardTitle}>{sc.name}</h4>
                      <p className={s.cardDesc}>
                        {sc.universityName || "—"}
                        {sc.countryName ? ` · ${sc.countryName}` : ""}
                      </p>
                    </div>
                  </div>
                  {sc.description ? <p className={s.cardDesc}>{sc.description}</p> : null}
                  <div className={s.cardMeta}>
                    <span className={`${s.metaBadge} ${s.highlight}`}>{awardLabel(sc, t)}</span>
                    {sc.degreeLevel ? <span className={s.metaBadge}>{pretty(sc.degreeLevel)}</span> : null}
                    {sc.fieldType ? <span className={s.metaBadge}>{pretty(sc.fieldType)}</span> : null}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </PageTemplate>
  );
};

export default SearchScholarshipsPage;
