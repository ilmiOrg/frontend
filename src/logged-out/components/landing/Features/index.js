import React from "react";
import { LandingSparklesHeader } from "../../../../components/ui/LandingSparklesHeader";
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

const FeaturesSection = () => {
  const features = [
    {
      iconKey: "target",
      title: "Smart University Matching",
      description:
        "Our AI reviews your profile, goals, and preferences to recommend universities that fit your path.",
    },
    {
      iconKey: "wallet",
      title: "Scholarship and Funding Guidance",
      description:
        "Find scholarships, grants, and aid options to plan your education budget with confidence.",
    },
    {
      iconKey: "chart",
      title: "Admission Insights",
      description:
        "Compare admission trends, program details, and outcomes so you can make informed choices.",
    },
    {
      iconKey: "globe",
      title: "Global University Access",
      description:
        "Explore universities in multiple countries with clear program and admission information.",
    },
    {
      iconKey: "phone",
      title: "Easy Access on Any Device",
      description:
        "Use ilmi smoothly on mobile or desktop to check matches and track your next steps.",
    },
    {
      iconKey: "users",
      title: "Advisor Support",
      description:
        "Get practical help from advisors who understand admissions, applications, and planning.",
    },
  ];

  return (
    <section className={styles.features} id="features">
      <div className={styles.featuresContainer}>
        <div className={styles.headerWrap}>
          <LandingSparklesHeader title="Main Services" />
        </div>
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIcon}>{ICONS[feature.iconKey]}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
