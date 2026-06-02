import React from "react";
import { useTranslation } from "../../../../hooks/useLanguage";
import PageTemplate from "../../../shared/PageTemplate";
import { GraduationCapIcon, TrendingUpIcon, BookOpenIcon, LanguagesIcon, UsersIcon } from "../../../shared/Icons";
import s from "../../../shared/ContentPage/style.module.css";

const FEATURES = [
  { key: "alumniMentorsCareer", descKey: "alumniMentorsCareerDesc", Icon: TrendingUpIcon, color: "" },
  { key: "alumniMentorsTips", descKey: "alumniMentorsTipsDesc", Icon: BookOpenIcon, color: "green" },
  { key: "alumniMentorsCulture", descKey: "alumniMentorsCultureDesc", Icon: LanguagesIcon, color: "purple" },
  { key: "alumniMentorsAccess", descKey: "alumniMentorsAccessDesc", Icon: UsersIcon, color: "amber" },
];

const AlumniMentorsPage = () => {
  const { t } = useTranslation();

  return (
    <PageTemplate
      icon={<GraduationCapIcon size={22} />}
      title={t("alumniMentorsTitle")}
      actions={<button className={s.primaryBtn}>{t("getStarted")}</button>}
    >
      <div className={s.layout}>
        <div className={s.introPanel}>
          <p className={s.introText}>{t("alumniMentorsIntro")}</p>
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

        <p className={s.emptyState}>{t("comingSoon")}</p>
      </div>
    </PageTemplate>
  );
};

export default AlumniMentorsPage;
