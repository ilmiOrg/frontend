import React, { useEffect, useMemo, useState } from "react";
import PageTemplate from "../../../shared/PageTemplate";
import { BookOpenIcon, ExternalLinkIcon } from "../../../shared/Icons";
import { SelectField } from "../../../../ui-components";
import { getCourses } from "../../../../api/courses";
import { useTranslation } from "../../../../hooks/useLanguage";
import { isSafeHttpUrl } from "../../../../lib/safeUrl";
import s from "../../../shared/ContentPage/style.module.css";

const CoursesPage = () => {
  const { t } = useTranslation();
  const [all, setAll] = useState([]);
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    getCourses()
      .then((data) => active && setAll(Array.isArray(data) ? data : []))
      .catch((e) => active && setError(e?.message || t("errorGeneric")))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [t]);

  const subjectOptions = useMemo(() => {
    const subjects = [...new Set(all.map((c) => c.subject).filter(Boolean))];
    return [{ value: "", label: t("coursesAllSubjects") }, ...subjects.map((v) => ({ value: v, label: title(v) }))];
  }, [all, t]);

  const courses = useMemo(
    () => (subject ? all.filter((c) => c.subject === subject) : all),
    [all, subject]
  );

  return (
    <PageTemplate
      icon={<BookOpenIcon size={22} />}
      title={t("dashCourses")}
      description={t("coursesDesc")}
    >
      <div className={s.layout}>
        <div className={s.introPanel}>
          <SelectField label={t("coursesSubjectLabel")} value={subject} onChange={setSubject} options={subjectOptions} />
        </div>

        {loading ? (
          <p className={s.emptyState}>{t("coursesLoading")}</p>
        ) : error ? (
          <p className={s.emptyState}>{error}</p>
        ) : courses.length === 0 ? (
          <p className={s.emptyState}>{t("coursesEmpty")}</p>
        ) : (
          <>
            <h3 className={s.sectionLabel}>{t("coursesCount").replace("{count}", courses.length)}</h3>
            <div className={s.cardGrid}>
              {courses.map((c) => (
                <div className={s.contentCard} key={c.id}>
                  <div className={s.cardHeader}>
                    <div className={s.cardIcon}><BookOpenIcon size={20} /></div>
                    <div>
                      <h4 className={s.cardTitle}>{c.title}</h4>
                      <p className={s.cardDesc}>{c.provider || "—"}</p>
                    </div>
                  </div>
                  {c.description ? <p className={s.cardDesc}>{c.description}</p> : null}
                  <div className={s.cardMeta}>
                    {c.subject ? <span className={`${s.metaBadge} ${s.highlight}`}>{title(c.subject)}</span> : null}
                    {c.language ? <span className={s.metaBadge}>{c.language.toUpperCase()}</span> : null}
                    {c.priceAmount != null ? (
                      <span className={s.metaBadge}>{Number(c.priceAmount).toLocaleString()} {c.currency || ""}</span>
                    ) : null}
                    {isSafeHttpUrl(c.url) ? (
                      <a className={s.metaBadge} href={c.url} target="_blank" rel="noreferrer">
                        {t("coursesView")} <ExternalLinkIcon size={12} />
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

function title(v) {
  return String(v || "").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export default CoursesPage;
