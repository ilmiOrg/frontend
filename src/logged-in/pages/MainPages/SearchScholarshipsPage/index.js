import React, { useEffect, useRef, useState } from "react";
import PageTemplate from "../../../shared/PageTemplate";
import { AwardIcon } from "../../../shared/Icons";
import { SelectField } from "../../../../ui-components";
import { getScholarships } from "../../../../api/scholarships";
import { useTranslation } from "../../../../hooks/useLanguage";
import { formatEnum as pretty } from "../../../../lib/formatEnum";
import s from "../../../shared/ContentPage/style.module.css";
import local from "./style.module.css";

const FIELD_VALUES = [
  "COMPUTER_SCIENCE", "ENGINEERING", "MEDICINE", "LAW", "BUSINESS", "ECONOMICS",
  "MATHEMATICS", "PHYSICS", "BIOLOGY", "CHEMISTRY", "HUMANITIES", "SOCIAL_SCIENCES",
  "ARTS", "EDUCATION", "ARCHITECTURE",
];

const PAGE_SIZE = 12;

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
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  // Page in a ref so loadMore reads the latest value (no stale closure on rapid clicks).
  const pageRef = useRef(0);

  const buildFilters = (p) => {
    const filters = { page: p, size: PAGE_SIZE };
    if (field) filters.field = field;
    if (degree) filters.degree = degree;
    return filters;
  };

  // Load the first page whenever a filter changes.
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    pageRef.current = 0;
    getScholarships(buildFilters(0))
      .then((data) => {
        if (!active) return;
        const list = Array.isArray(data) ? data : [];
        setItems(list);
        setHasMore(list.length === PAGE_SIZE);
      })
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field, degree]);

  const loadMore = () => {
    if (loadingMore) return; // re-entrancy guard
    const next = pageRef.current + 1;
    setLoadingMore(true);
    setError(null);
    getScholarships(buildFilters(next))
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        pageRef.current = next;
        setItems((prev) => [...prev, ...list]);
        setHasMore(list.length === PAGE_SIZE);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoadingMore(false));
  };

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
            {hasMore ? (
              <div className={s.loadMoreRow}>
                <button
                  type="button"
                  className={s.loadMoreBtn}
                  onClick={loadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? t("loadingMore") : t("loadMore")}
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </PageTemplate>
  );
};

export default SearchScholarshipsPage;
