import React, { useEffect, useState } from "react";
import PageTemplate from "../../../shared/PageTemplate";
import { AwardIcon } from "../../../shared/Icons";
import { SelectField } from "../../../../ui-components";
import { getScholarships } from "../../../../api/scholarships";
import s from "../../../shared/ContentPage/style.module.css";
import local from "./style.module.css";

const FIELD_OPTIONS = [
  { value: "", label: "All fields" },
  ...[
    "COMPUTER_SCIENCE", "ENGINEERING", "MEDICINE", "LAW", "BUSINESS", "ECONOMICS",
    "MATHEMATICS", "PHYSICS", "BIOLOGY", "CHEMISTRY", "HUMANITIES", "SOCIAL_SCIENCES",
    "ARTS", "EDUCATION", "ARCHITECTURE",
  ].map((v) => ({ value: v, label: pretty(v) })),
];

const DEGREE_OPTIONS = [
  { value: "", label: "All levels" },
  { value: "BACHELOR", label: "Bachelor" },
  { value: "MASTER", label: "Master" },
  { value: "DOCTORATE", label: "Doctorate" },
];

function pretty(v) {
  return String(v || "").toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function awardLabel(sc) {
  if (sc.awardType === "FULL_TUITION") return "Full tuition";
  if (sc.awardType === "PERCENTAGE_OFF_TUITION" && sc.awardValue != null) return `${Number(sc.awardValue)}% off tuition`;
  if (sc.awardType === "FIXED_AMOUNT" && sc.awardValue != null) return `${Number(sc.awardValue).toLocaleString()} ${sc.currency || ""}`;
  return pretty(sc.awardType || "Award");
}

const SearchScholarshipsPage = () => {
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
      title="Scholarships"
      description="Browse scholarships — filter by field and level."
    >
      <div className={s.layout}>
        <div className={s.introPanel}>
          <div className={local.filterRow}>
            <SelectField label="Field" value={field} onChange={setField} options={FIELD_OPTIONS} />
            <SelectField label="Level" value={degree} onChange={setDegree} options={DEGREE_OPTIONS} />
          </div>
        </div>

        {loading ? (
          <p className={s.emptyState}>Loading scholarships…</p>
        ) : error ? (
          <p className={s.emptyState}>{error}</p>
        ) : items.length === 0 ? (
          <p className={s.emptyState}>No scholarships match your filters yet — try broadening the field or level.</p>
        ) : (
          <>
            <h3 className={s.sectionLabel}>{items.length} scholarships</h3>
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
                    <span className={`${s.metaBadge} ${s.highlight}`}>{awardLabel(sc)}</span>
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
