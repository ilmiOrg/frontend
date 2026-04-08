import React from "react";
import { useTranslation } from "../../../../hooks/useLanguage";
import PageTemplate from "../../../shared/PageTemplate";
import { TargetIcon, ZapIcon, ListChecksIcon, SearchIcon, FlameIcon } from "../../../shared/Icons";
import s from "../../../shared/ContentPage/style.module.css";

const FEATURES = [
  { key: "internshipsFeature1", descKey: "internshipsFeature1Desc", Icon: ZapIcon, color: "" },
  { key: "internshipsFeature2", descKey: "internshipsFeature2Desc", Icon: ListChecksIcon, color: "green" },
  { key: "internshipsFeature3", descKey: "internshipsFeature3Desc", Icon: SearchIcon, color: "purple" },
  { key: "internshipsFeature4", descKey: "internshipsFeature4Desc", Icon: FlameIcon, color: "amber" },
];

const InternshipsPage = () => {
  const { t } = useTranslation();

  return (
    <PageTemplate
      icon={<TargetIcon size={22} />}
      title={t("internshipsTitle")}
      actions={<button className={s.primaryBtn}>{t("internshipsCta")}</button>}
    >
      <div className={s.layout}>
        <div className={s.introPanel}>
          <p className={s.introText}>{t("internshipsDesc")}</p>
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
            <h3 className={s.ctaTitle}>{t("internshipsCta")}</h3>
            <p className={s.ctaDesc}>{t("internshipsDesc")}</p>
          </div>
          <button className={s.ctaBtn}>{t("getStarted")}</button>
        </div>
      </div>
    </PageTemplate>
  );
};

export default InternshipsPage;
