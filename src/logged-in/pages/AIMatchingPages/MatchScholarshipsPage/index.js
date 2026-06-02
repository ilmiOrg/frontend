import React from "react";
import { useTranslation } from "../../../../hooks/useLanguage";
import PageTemplate from "../../../shared/PageTemplate";
import { AwardIcon, CheckIcon, CalendarIcon, BookOpenIcon, CalculatorIcon, DollarIcon } from "../../../shared/Icons";
import s from "../../../shared/ContentPage/style.module.css";

const FEATURES = [
  { key: "matchScholarshipsEligibility", descKey: "matchScholarshipsEligibilityDesc", Icon: CheckIcon, color: "" },
  { key: "matchScholarshipsDeadlines", descKey: "matchScholarshipsDeadlinesDesc", Icon: CalendarIcon, color: "green" },
  { key: "matchScholarshipsGuidance", descKey: "matchScholarshipsGuidanceDesc", Icon: BookOpenIcon, color: "purple" },
  { key: "matchScholarshipsCalculator", descKey: "matchScholarshipsCalculatorDesc", Icon: CalculatorIcon, color: "amber" },
];

const CATEGORIES = [
  { key: "matchScholarshipsMerit", Icon: AwardIcon },
  { key: "matchScholarshipsNeed", Icon: DollarIcon },
  { key: "matchScholarshipsCountry", Icon: BookOpenIcon },
  { key: "matchScholarshipsField", Icon: CalculatorIcon },
];

const MatchScholarshipsPage = () => {
  const { t } = useTranslation();

  return (
    <PageTemplate
      icon={<AwardIcon size={22} />}
      title={t("matchScholarshipsTitle")}
      actions={<button className={s.primaryBtn}>{t("getStarted")}</button>}
    >
      <div className={s.layout}>
        <div className={s.introPanel}>
          <p className={s.introText}>{t("matchScholarshipsIntro")}</p>
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

        <div className={s.cardGrid}>
          {CATEGORIES.map((item) => (
            <div key={item.key} className={s.contentCard}>
              <div className={s.cardHeader}>
                <div className={s.cardIcon}>
                  <item.Icon size={18} />
                </div>
                <h4 className={s.cardTitle}>{t(item.key)}</h4>
              </div>
              <span className={`${s.metaBadge} ${s.highlight}`}>{t("comingSoon")}</span>
            </div>
          ))}
        </div>
      </div>
    </PageTemplate>
  );
};

export default MatchScholarshipsPage;
