import React from "react";
import { useTranslation } from "../../../../hooks/useLanguage";
import PageTemplate from "../../../shared/PageTemplate";
import { StarIcon, TargetIcon, CalendarIcon, ListChecksIcon, BookOpenIcon } from "../../../shared/Icons";
import s from "../../../shared/ContentPage/style.module.css";

const FEATURES = [
  { key: "dreamUniGoals", descKey: "dreamUniGoalsDesc", Icon: TargetIcon, color: "" },
  { key: "dreamUniDeadlines", descKey: "dreamUniDeadlinesDesc", Icon: CalendarIcon, color: "green" },
  { key: "dreamUniTimeline", descKey: "dreamUniTimelineDesc", Icon: ListChecksIcon, color: "purple" },
  { key: "dreamUniChecklist", descKey: "dreamUniChecklistDesc", Icon: BookOpenIcon, color: "amber" },
];

const DreamUniversityPage = () => {
  const { t } = useTranslation();

  return (
    <PageTemplate
      icon={<StarIcon size={22} />}
      title={t("dreamUniTitle")}
      actions={<button className={s.primaryBtn}>{t("getStarted")}</button>}
    >
      <div className={s.layout}>
        <div className={s.introPanel}>
          <p className={s.introText}>{t("dreamUniIntro")}</p>
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

export default DreamUniversityPage;
