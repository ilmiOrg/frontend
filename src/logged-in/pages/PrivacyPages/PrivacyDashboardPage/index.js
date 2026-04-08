import React from "react";
import { useTranslation } from "../../../../hooks/useLanguage";
import PageTemplate from "../../../shared/PageTemplate";
import { ShieldIcon, SearchIcon, UserIcon, ExternalLinkIcon, XIcon } from "../../../shared/Icons";
import s from "../../../shared/ContentPage/style.module.css";

const FEATURES = [
  { key: "privacyFeature1", descKey: "privacyFeature1Desc", Icon: SearchIcon, color: "" },
  { key: "privacyFeature2", descKey: "privacyFeature2Desc", Icon: UserIcon, color: "green" },
  { key: "privacyFeature3", descKey: "privacyFeature3Desc", Icon: ExternalLinkIcon, color: "purple" },
  { key: "privacyFeature4", descKey: "privacyFeature4Desc", Icon: XIcon, color: "rose" },
];

const PrivacyDashboardPage = () => {
  const { t } = useTranslation();

  return (
    <PageTemplate
      icon={<ShieldIcon size={22} />}
      title={t("privacyTitle")}
      actions={<button className={s.primaryBtn}>{t("privacyCta")}</button>}
    >
      <div className={s.layout}>
        <div className={s.introPanel}>
          <p className={s.introText}>{t("privacyDesc")}</p>
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
            <h3 className={s.ctaTitle}>{t("privacyCta")}</h3>
            <p className={s.ctaDesc}>{t("privacyDesc")}</p>
          </div>
          <button className={s.ctaBtn}>{t("getStarted")}</button>
        </div>
      </div>
    </PageTemplate>
  );
};

export default PrivacyDashboardPage;
