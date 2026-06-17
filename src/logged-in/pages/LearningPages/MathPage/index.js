import React from "react";
import { useTranslation } from "../../../../hooks/useLanguage";
import PageTemplate from "../../../shared/PageTemplate";
import { CalculatorIcon, BookOpenIcon, ListChecksIcon, TrendingUpIcon } from "../../../shared/Icons";
import s from "../../../shared/ContentPage/style.module.css";

const FEATURES = [
  { key: "mathSat", descKey: "mathSatDesc", Icon: BookOpenIcon, color: "" },
  { key: "mathAdvanced", descKey: "mathAdvancedDesc", Icon: CalculatorIcon, color: "green" },
  { key: "mathPractice", descKey: "mathPracticeDesc", Icon: ListChecksIcon, color: "purple" },
  { key: "mathProgress", descKey: "mathProgressDesc", Icon: TrendingUpIcon, color: "amber" },
];

const TOPICS = [
  { key: "mathAlgebra", pct: 0 },
  { key: "mathCalculus", pct: 0 },
  { key: "mathStatistics", pct: 0 },
  { key: "mathGeometry", pct: 0 },
];

const MathPage = () => {
  const { t } = useTranslation();

  return (
    <PageTemplate
      icon={<CalculatorIcon size={22} />}
      title={t("mathTitle")}
      actions={<button className={s.primaryBtn}>{t("getStarted")}</button>}
    >
      <div className={s.layout}>
        <div className={s.introPanel}>
          <p className={s.introText}>{t("mathIntro")}</p>
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

        {TOPICS.map((item) => (
          <div key={item.key} className={s.progressItem}>
            <div className={s.progressHeader}>
              <span className={s.progressName}>{t(item.key)}</span>
              <span className={s.progressPct}>{item.pct}%</span>
            </div>
            <div className={s.progressTrack}>
              <div className={s.progressFill} style={{ "--fill": `${item.pct}%` }} />
            </div>
          </div>
        ))}

        <div className={s.ctaPanel}>
          <div className={s.ctaBody}>
            <h3 className={s.ctaTitle}>{t("mathTitle")}</h3>
            <p className={s.ctaDesc}>{t("mathIntro")}</p>
          </div>
          <button className={s.ctaBtn}>{t("startNow")}</button>
        </div>
      </div>
    </PageTemplate>
  );
};

export default MathPage;
