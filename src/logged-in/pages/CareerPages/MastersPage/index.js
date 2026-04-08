import React from "react";
import { useTranslation } from "../../../../hooks/useLanguage";
import PageTemplate from "../../../shared/PageTemplate";
import { GraduationCapIcon, SearchIcon, AwardIcon, DollarIcon, TrendingUpIcon } from "../../../shared/Icons";
import s from "../../../shared/ContentPage/style.module.css";

const FEATURES = [
  { key: "mastersFeature1", descKey: "mastersFeature1Desc", Icon: SearchIcon, color: "" },
  { key: "mastersFeature2", descKey: "mastersFeature2Desc", Icon: AwardIcon, color: "green" },
  { key: "mastersFeature3", descKey: "mastersFeature3Desc", Icon: DollarIcon, color: "purple" },
  { key: "mastersFeature4", descKey: "mastersFeature4Desc", Icon: TrendingUpIcon, color: "amber" },
];

const MastersPage = () => {
  const { t } = useTranslation();

  return (
    <PageTemplate
      icon={<GraduationCapIcon size={22} />}
      title={t("mastersTitle")}
      actions={<button className={s.primaryBtn}>{t("mastersCta")}</button>}
    >
      <div className={s.layout}>
        <div className={s.introPanel}>
          <p className={s.introText}>{t("mastersDesc")}</p>
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
            <h3 className={s.ctaTitle}>{t("mastersCta")}</h3>
            <p className={s.ctaDesc}>{t("mastersDesc")}</p>
          </div>
          <button className={s.ctaBtn}>{t("getStarted")}</button>
        </div>
      </div>
    </PageTemplate>
  );
};

export default MastersPage;
