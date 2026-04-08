import React from "react";
import { useTranslation } from "../../../../hooks/useLanguage";
import PageTemplate from "../../../shared/PageTemplate";
import { UsersIcon, TargetIcon, BookOpenIcon, MessageCircleIcon, TrendingUpIcon } from "../../../shared/Icons";
import s from "../../../shared/ContentPage/style.module.css";

const FEATURES = [
  { key: "similarStudentsMatching", descKey: "similarStudentsMatchingDesc", Icon: TargetIcon, color: "" },
  { key: "similarStudentsGroups", descKey: "similarStudentsGroupsDesc", Icon: BookOpenIcon, color: "green" },
  { key: "similarStudentsExperience", descKey: "similarStudentsExperienceDesc", Icon: MessageCircleIcon, color: "purple" },
  { key: "similarStudentsNetwork", descKey: "similarStudentsNetworkDesc", Icon: TrendingUpIcon, color: "amber" },
];

const SimilarStudentsPage = () => {
  const { t } = useTranslation();

  return (
    <PageTemplate
      icon={<UsersIcon size={22} />}
      title={t("similarStudentsTitle")}
      actions={<button className={s.primaryBtn}>{t("getStarted")}</button>}
    >
      <div className={s.layout}>
        <div className={s.introPanel}>
          <p className={s.introText}>{t("similarStudentsIntro")}</p>
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

        <div className={s.ctaPanel}>
          <div className={s.ctaBody}>
            <h3 className={s.ctaTitle}>{t("similarStudentsTitle")}</h3>
            <p className={s.ctaDesc}>{t("similarStudentsIntro")}</p>
          </div>
          <button className={s.ctaBtn}>{t("startNow")}</button>
        </div>
      </div>
    </PageTemplate>
  );
};

export default SimilarStudentsPage;
