import React from "react";
import { useTranslation } from "../../../../hooks/useLanguage";
import PageTemplate from "../../../shared/PageTemplate";
import { TrendingUpIcon, SearchIcon, TargetIcon, ZapIcon, CheckIcon } from "../../../shared/Icons";
import s from "../../../shared/ContentPage/style.module.css";

const FEATURES = [
  { key: "careerAnalysisFeature1", descKey: "careerAnalysisFeature1Desc", Icon: SearchIcon, color: "" },
  { key: "careerAnalysisFeature2", descKey: "careerAnalysisFeature2Desc", Icon: TargetIcon, color: "green" },
  { key: "careerAnalysisFeature3", descKey: "careerAnalysisFeature3Desc", Icon: ZapIcon, color: "purple" },
  { key: "careerAnalysisFeature4", descKey: "careerAnalysisFeature4Desc", Icon: CheckIcon, color: "amber" },
];

const CareerAnalysisPage = () => {
  const { t } = useTranslation();

  return (
    <PageTemplate
      icon={<TrendingUpIcon size={22} />}
      title={t("careerAnalysisTitle")}
      actions={<button className={s.primaryBtn}>{t("careerAnalysisCta")}</button>}
    >
      <div className={s.layout}>
        <div className={s.introPanel}>
          <p className={s.introText}>{t("careerAnalysisDesc")}</p>
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
            <h3 className={s.ctaTitle}>{t("careerAnalysisCta")}</h3>
            <p className={s.ctaDesc}>{t("careerAnalysisDesc")}</p>
          </div>
          <button className={s.ctaBtn}>{t("getStarted")}</button>
        </div>
      </div>
    </PageTemplate>
  );
};

export default CareerAnalysisPage;
