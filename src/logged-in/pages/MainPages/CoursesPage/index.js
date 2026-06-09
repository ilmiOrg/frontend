import React, { useEffect, useMemo, useState } from "react";
import PageTemplate from "../../../shared/PageTemplate";
import { BookOpenIcon, ExternalLinkIcon } from "../../../shared/Icons";
import { SelectField } from "../../../../ui-components";
import { getCourses } from "../../../../api/courses";
import s from "../../../shared/ContentPage/style.module.css";

const CoursesPage = () => {
  const [all, setAll] = useState([]);
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    getCourses()
      .then((data) => active && setAll(Array.isArray(data) ? data : []))
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const subjectOptions = useMemo(() => {
    const subjects = [...new Set(all.map((c) => c.subject).filter(Boolean))];
    return [{ value: "", label: "All subjects" }, ...subjects.map((v) => ({ value: v, label: title(v) }))];
  }, [all]);

  const courses = useMemo(
    () => (subject ? all.filter((c) => c.subject === subject) : all),
    [all, subject]
  );

  return (
    <PageTemplate
      icon={<BookOpenIcon size={22} />}
      title="Courses"
      description="Partner prep courses (English, math, and more)."
    >
      <div className={s.layout}>
        <div className={s.introPanel}>
          <SelectField label="Subject" value={subject} onChange={setSubject} options={subjectOptions} />
        </div>

        {loading ? (
          <p className={s.emptyState}>Loading courses…</p>
        ) : error ? (
          <p className={s.emptyState}>{error}</p>
        ) : courses.length === 0 ? (
          <p className={s.emptyState}>No courses yet.</p>
        ) : (
          <>
            <h3 className={s.sectionLabel}>{courses.length} courses</h3>
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
                    {c.url ? (
                      <a className={s.metaBadge} href={c.url} target="_blank" rel="noreferrer">
                        View <ExternalLinkIcon size={12} />
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
