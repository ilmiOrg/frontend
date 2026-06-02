import React from "react";
import { LandingSparklesHeader } from "../../../../components/ui/LandingSparklesHeader";
import { useTranslation } from "../../../../hooks/useLanguage";
import styles from "./style.module.css";

const ICONS = {
  target: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
  ),
  wallet: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><path d="M1 10h22" /></svg>
  ),
  chart: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
  ),
  globe: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
  ),
  phone: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
  ),
  users: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  ),
};

const FEATURES = [
  { iconKey: "target", titleKey: "featureSmartMatchTitle", descKey: "featureSmartMatchDesc" },
  { iconKey: "wallet", titleKey: "featureScholarshipTitle", descKey: "featureScholarshipDesc" },
  { iconKey: "chart", titleKey: "featureInsightsTitle", descKey: "featureInsightsDesc" },
  { iconKey: "globe", titleKey: "featureGlobalTitle", descKey: "featureGlobalDesc" },
  { iconKey: "phone", titleKey: "featureAnyDeviceTitle", descKey: "featureAnyDeviceDesc" },
  { iconKey: "users", titleKey: "featureAdvisorTitle", descKey: "featureAdvisorDesc" },
];

const FeaturesSection = () => {
  const { t } = useTranslation();

  return (
    <section className={styles.features} id="features">
      <div className={styles.featuresContainer}>
        <div className={styles.headerWrap}>
          <LandingSparklesHeader title={t("publicMainServices")} />
        </div>
        <div className={styles.featuresGrid}>
          {FEATURES.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIcon}>{ICONS[feature.iconKey]}</div>
              <h3 className={styles.featureTitle}>{t(feature.titleKey)}</h3>
              <p className={styles.featureDescription}>{t(feature.descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
