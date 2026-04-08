import React from "react";
import { useTranslation } from "../../../../hooks/useLanguage";
import PageTemplate from "../../../shared/PageTemplate";
import { DollarIcon, CalendarIcon, MapPinIcon, CheckIcon } from "../../../shared/Icons";
import s from "../../../shared/ContentPage/style.module.css";

const FEATURES = [
  { key: "searchScholarshipsType", descKey: "searchScholarshipsTypeDesc", Icon: DollarIcon, color: "" },
  { key: "searchScholarshipsCountry", descKey: "searchScholarshipsCountryDesc", Icon: MapPinIcon, color: "green" },
  { key: "searchScholarshipsDeadline", descKey: "searchScholarshipsDeadlineDesc", Icon: CalendarIcon, color: "purple" },
  { key: "searchScholarshipsEligibility", descKey: "searchScholarshipsEligibilityDesc", Icon: CheckIcon, color: "amber" },
];

const SearchScholarshipsPage = () => {
  const { t } = useTranslation();

  return (
    <PageTemplate
      icon={<DollarIcon size={22} />}
      title={t("searchScholarshipsTitle")}
      actions={<button className={s.primaryBtn}>{t("getStarted")}</button>}
    >
      <div className={s.layout}>
        <div className={s.introPanel}>
          <p className={s.introText}>{t("searchScholarshipsIntro")}</p>
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
            <h3 className={s.ctaTitle}>{t("searchScholarshipsTitle")}</h3>
            <p className={s.ctaDesc}>{t("searchScholarshipsIntro")}</p>
          </div>
          <button className={s.ctaBtn}>{t("startNow")}</button>
        </div>
      </div>
    </PageTemplate>
  );
};

export default SearchScholarshipsPage;
