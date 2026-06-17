import React, { useEffect, useMemo, useState } from "react";
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

const JobsPage = () => {
  const { t } = useTranslation();
  const FIELD_OPTIONS = [
    { value: "", label: t("jobsAllFields") },
    ...FIELD_VALUES.map((v) => ({ value: v, label: prettyEnum(v) })),
  ];
  const [field, setField] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    getJobs(field ? { field } : {})
      .then((data) => active && setJobs(Array.isArray(data) ? data : []))
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [field]);

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
          </>
        )}
      </div>
    </PageTemplate>
  );
};

export default JobsPage;
