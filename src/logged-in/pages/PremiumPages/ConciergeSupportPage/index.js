import React from "react";
import { useTranslation } from "../../../../hooks/useLanguage";
import PageTemplate from "../../../shared/PageTemplate";
import { CrownIcon, ZapIcon, UserIcon, FileEditIcon, TrendingUpIcon } from "../../../shared/Icons";
import s from "../../../shared/ContentPage/style.module.css";

const FEATURES = [
  { key: "conciergeSupportPriority", descKey: "conciergeSupportPriorityDesc", Icon: ZapIcon, color: "" },
  { key: "conciergeSupportAdvisor", descKey: "conciergeSupportAdvisorDesc", Icon: UserIcon, color: "green" },
  { key: "conciergeSupportDocReview", descKey: "conciergeSupportDocReviewDesc", Icon: FileEditIcon, color: "purple" },
  { key: "conciergeSupportTracking", descKey: "conciergeSupportTrackingDesc", Icon: TrendingUpIcon, color: "amber" },
];

const ConciergeSupportPage = () => {
  const { t } = useTranslation();

  return (
    <PageTemplate
      icon={<CrownIcon size={22} />}
      title={t("conciergeSupportTitle")}
      actions={<button className={s.primaryBtn}>{t("getStarted")}</button>}
    >
      <div className={s.layout}>
        <div className={s.introPanel}>
          <p className={s.introText}>{t("conciergeSupportIntro")}</p>
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
            <h3 className={s.ctaTitle}>{t("conciergeSupportTitle")}</h3>
            <p className={s.ctaDesc}>{t("conciergeSupportIntro")}</p>
          </div>
          <button className={s.ctaBtn}>{t("startNow")}</button>
        </div>
      </div>
    </PageTemplate>
  );
};

export default ConciergeSupportPage;
