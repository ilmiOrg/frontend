import React from "react";
import { useTranslation } from "../../../../hooks/useLanguage";
import PageTemplate from "../../../shared/PageTemplate";
import { TargetIcon, SearchIcon, StarIcon, ZapIcon, TrendingUpIcon } from "../../../shared/Icons";
import s from "../../../shared/ContentPage/style.module.css";

const FEATURES = [
  { key: "matchUnisProfileAnalysis", descKey: "matchUnisProfileAnalysisDesc", Icon: SearchIcon, color: "" },
  { key: "matchUnisCompatibility", descKey: "matchUnisCompatibilityDesc", Icon: StarIcon, color: "green" },
  { key: "matchUnisSmartFilter", descKey: "matchUnisSmartFilterDesc", Icon: ZapIcon, color: "purple" },
  { key: "matchUnisRealtime", descKey: "matchUnisRealtimeDesc", Icon: TrendingUpIcon, color: "amber" },
];

const PROGRESS_ITEMS = [
  { label: "matchUnisProfileComplete", pct: 65 },
];

const MatchUniversitiesPage = () => {
  const { t } = useTranslation();

  return (
    <PageTemplate
      icon={<TargetIcon size={22} />}
      title={t("matchUnisTitle")}
      actions={<button className={s.primaryBtn}>{t("getStarted")}</button>}
    >
      <div className={s.layout}>
        <div className={s.introPanel}>
          <p className={s.introText}>{t("matchUnisIntro")}</p>
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
        <h3 className={s.sectionLabel}>{t("matchUnisProfileComplete")}</h3>

        {PROGRESS_ITEMS.map((item) => (
          <div key={item.label} className={s.progressItem}>
            <div className={s.progressHeader}>
              <span className={s.progressName}>{t(item.label)}</span>
              <span className={s.progressPct}>{item.pct}%</span>
            </div>
            <div className={s.progressTrack}>
              <div className={s.progressFill} style={{ width: `${item.pct}%` }} />
            </div>
          </div>
        ))}
        <p className={s.emptyState}>{t("matchUnisCompleteProfile")}</p>

        <div className={s.ctaPanel}>
          <div className={s.ctaBody}>
            <h3 className={s.ctaTitle}>{t("matchUnisTitle")}</h3>
            <p className={s.ctaDesc}>{t("matchUnisIntro")}</p>
          </div>
          <button className={s.ctaBtn}>{t("startNow")}</button>
        </div>
      </div>
    </PageTemplate>
  );
};

export default MatchUniversitiesPage;
