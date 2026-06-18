import React, { useEffect, useMemo, useRef, useState } from "react";
import PageTemplate from "../../../shared/PageTemplate";
import { TrendingUpIcon, ExternalLinkIcon } from "../../../shared/Icons";
import { SelectField } from "../../../../ui-components";
import { getJobs } from "../../../../api/jobs";
import { useTranslation } from "../../../../hooks/useLanguage";
import s from "../../../shared/ContentPage/style.module.css";

const FIELD_VALUES = [
  "COMPUTER_SCIENCE", "ENGINEERING", "MEDICINE", "LAW", "BUSINESS", "ECONOMICS",
  "MATHEMATICS", "PHYSICS", "BIOLOGY", "CHEMISTRY", "HUMANITIES", "SOCIAL_SCIENCES",
  "ARTS", "EDUCATION", "ARCHITECTURE",
];

function prettyEnum(v) {
  return String(v || "").toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const PAGE_SIZE = 12;

const JobsPage = () => {
  const { t } = useTranslation();
  const FIELD_OPTIONS = [
    { value: "", label: t("jobsAllFields") },
    ...FIELD_VALUES.map((v) => ({ value: v, label: prettyEnum(v) })),
  ];
  const [field, setField] = useState("");
  const [jobs, setJobs] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  // Page lives in a ref so loadMore always reads the latest value (no stale closure across
  // rapid clicks) without recreating the handler on every render.
  const pageRef = useRef(0);

  // Load the first page whenever the field filter changes.
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    pageRef.current = 0;
    getJobs({ ...(field ? { field } : {}), page: 0, size: PAGE_SIZE })
      .then((data) => {
        if (!active) return;
        const list = Array.isArray(data) ? data : [];
        setJobs(list);
        setHasMore(list.length === PAGE_SIZE);
      })
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [field]);

  const loadMore = () => {
    if (loadingMore) return; // re-entrancy guard
    const next = pageRef.current + 1;
    setLoadingMore(true);
    setError(null);
    getJobs({ ...(field ? { field } : {}), page: next, size: PAGE_SIZE })
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        pageRef.current = next;
        setJobs((prev) => [...prev, ...list]);
        setHasMore(list.length === PAGE_SIZE);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoadingMore(false));
  };

  const count = useMemo(() => jobs.length, [jobs]);

  return (
    <PageTemplate
      icon={<TrendingUpIcon size={22} />}
      title={t("dashJobs")}
      description={t("jobsDesc")}
    >
      <div className={s.layout}>
        <div className={s.introPanel}>
          <SelectField label={t("jobsFieldLabel")} value={field} onChange={setField} options={FIELD_OPTIONS} />
        </div>

        {loading ? (
          <p className={s.emptyState}>{t("jobsLoading")}</p>
        ) : error ? (
          <p className={s.emptyState}>{error}</p>
        ) : count === 0 ? (
          <p className={s.emptyState}>{t("jobsEmpty")}</p>
        ) : (
          <>
            <h3 className={s.sectionLabel}>{t("jobsCount").replace("{count}", count)}</h3>
            <div className={s.cardGrid}>
              {jobs.map((j) => (
                <div className={s.contentCard} key={j.id}>
                  <div className={s.cardHeader}>
                    <div className={s.cardIcon}><TrendingUpIcon size={20} /></div>
                    <div>
                      <h4 className={s.cardTitle}>{j.title}</h4>
                      <p className={s.cardDesc}>
                        {j.company || "—"}
                        {j.city ? ` · ${j.city}` : ""}
                        {j.countryCode ? `, ${j.countryCode}` : ""}
                      </p>
                    </div>
                  </div>
                  {j.description ? <p className={s.cardDesc}>{j.description}</p> : null}
                  <div className={s.cardMeta}>
                    {j.field ? <span className={`${s.metaBadge} ${s.highlight}`}>{prettyEnum(j.field)}</span> : null}
                    {j.degreeRequired ? <span className={s.metaBadge}>{prettyEnum(j.degreeRequired)}</span> : null}
                    {j.url ? (
                      <a className={s.metaBadge} href={j.url} target="_blank" rel="noreferrer">
                        {t("jobsApply")} <ExternalLinkIcon size={12} />
                      </a>
                    ) : null}
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

export default JobsPage;
