import React from "react";
import { useTranslation } from "../../../../hooks/useLanguage";
import PageTemplate from "../../../shared/PageTemplate";
import { CalendarIcon, ClockIcon, ListChecksIcon, CheckIcon, ZapIcon } from "../../../shared/Icons";
import s from "../../../shared/ContentPage/style.module.css";

const FEATURES = [
  { key: "appTimelineFeature1", descKey: "appTimelineFeature1Desc", Icon: ClockIcon, color: "" },
  { key: "appTimelineFeature2", descKey: "appTimelineFeature2Desc", Icon: ListChecksIcon, color: "green" },
  { key: "appTimelineFeature3", descKey: "appTimelineFeature3Desc", Icon: ZapIcon, color: "purple" },
  { key: "appTimelineFeature4", descKey: "appTimelineFeature4Desc", Icon: CheckIcon, color: "amber" },
];

const ApplicationTimelinePage = () => {
  const { t } = useTranslation();

  return (
    <PageTemplate
      icon={<CalendarIcon size={22} />}
      title={t("appTimelineTitle")}
      actions={<button className={s.primaryBtn}>{t("appTimelineCta")}</button>}
    >
      <div className={s.layout}>
        <div className={s.introPanel}>
          <p className={s.introText}>{t("appTimelineDesc")}</p>
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

        <div className={s.ctaPanel}>
          <div className={s.ctaBody}>
            <h3 className={s.ctaTitle}>{t("appTimelineCta")}</h3>
            <p className={s.ctaDesc}>{t("appTimelineDesc")}</p>
          </div>
          <button className={s.ctaBtn}>{t("getStarted")}</button>
        </div>
      </div>
    </PageTemplate>
  );
};

export default ApplicationTimelinePage;
