import React from "react";
import { useTranslation } from "../../../../hooks/useLanguage";
import PageTemplate from "../../../shared/PageTemplate";
import { BookOpenIcon, PlayCircleIcon, ListChecksIcon, CheckIcon, ClockIcon } from "../../../shared/Icons";
import s from "../../../shared/ContentPage/style.module.css";

const FEATURES = [
  { key: "getCoursesVideo", descKey: "getCoursesVideoDesc", Icon: PlayCircleIcon, color: "" },
  { key: "getCoursesInteractive", descKey: "getCoursesInteractiveDesc", Icon: ListChecksIcon, color: "green" },
  { key: "getCoursesCertificate", descKey: "getCoursesCertificateDesc", Icon: CheckIcon, color: "purple" },
  { key: "getCoursesSelfPaced", descKey: "getCoursesSelfPacedDesc", Icon: ClockIcon, color: "amber" },
];

const CATEGORIES = [
  { key: "getCoursesTestPrep" },
  { key: "getCoursesLanguage" },
  { key: "getCoursesSkills" },
  { key: "getCoursesAcademic" },
];

const GetCoursesPage = () => {
  const { t } = useTranslation();

  return (
    <PageTemplate
      icon={<BookOpenIcon size={22} />}
      title={t("getCoursesTitle")}
    >
      <div className={s.layout}>
        <div className={s.introPanel}>
          <p className={s.introText}>{t("getCoursesIntro")}</p>
          <div className={s.featureGrid}>
            {FEATURES.map((f) => (
              <div key={f.key} className={s.featureCard}>
                <div className={`${s.featureIconWrap} ${f.color ? s[f.color] : ""}`}>
                  <f.Icon size={18} />
                </div>
                <div className={s.featureBody}>
                  <h4 className={s.featureTitle}>{t(f.key)}</h4>
                  <p className={s.featureDesc}>{t(f.descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr className={s.divider} />
        <h3 className={s.sectionLabel}>{t("popularTopics")}</h3>

        <div className={s.cardGrid}>
          {CATEGORIES.map((item) => (
            <div key={item.key} className={s.contentCard}>
              <div className={s.cardHeader}>
                <div className={s.cardIcon}>
                  <BookOpenIcon size={18} />
                </div>
                <h4 className={s.cardTitle}>{t(item.key)}</h4>
              </div>
              <span className={`${s.metaBadge} ${s.highlight}`}>{t("comingSoon")}</span>
            </div>
          ))}
        </div>

        <div className={s.ctaPanel}>
          <div className={s.ctaBody}>
            <h3 className={s.ctaTitle}>{t("getCoursesTitle")}</h3>
            <p className={s.ctaDesc}>{t("getCoursesIntro")}</p>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default GetCoursesPage;
