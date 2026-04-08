import React from "react";
import { useTranslation } from "../../../../hooks/useLanguage";
import PageTemplate from "../../../shared/PageTemplate";
import { PlayCircleIcon, MapPinIcon, UsersIcon, CalendarIcon, ExternalLinkIcon } from "../../../shared/Icons";
import s from "../../../shared/ContentPage/style.module.css";

const FEATURES = [
  { key: "uniReelsFeature1", descKey: "uniReelsFeature1Desc", Icon: MapPinIcon, color: "" },
  { key: "uniReelsFeature2", descKey: "uniReelsFeature2Desc", Icon: UsersIcon, color: "green" },
  { key: "uniReelsFeature3", descKey: "uniReelsFeature3Desc", Icon: ExternalLinkIcon, color: "purple" },
  { key: "uniReelsFeature4", descKey: "uniReelsFeature4Desc", Icon: CalendarIcon, color: "amber" },
];

const UniversityReelsPage = () => {
  const { t } = useTranslation();

  return (
    <PageTemplate
      icon={<PlayCircleIcon size={22} />}
      title={t("uniReelsTitle")}
      actions={<button className={s.primaryBtn}>{t("uniReelsCta")}</button>}
    >
      <div className={s.layout}>
        <div className={s.introPanel}>
          <p className={s.introText}>{t("uniReelsDesc")}</p>
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
            <h3 className={s.ctaTitle}>{t("uniReelsCta")}</h3>
            <p className={s.ctaDesc}>{t("uniReelsDesc")}</p>
          </div>
          <button className={s.ctaBtn}>{t("getStarted")}</button>
        </div>
      </div>
    </PageTemplate>
  );
};

export default UniversityReelsPage;
