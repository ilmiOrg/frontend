import React from "react";
import { useTranslation } from "../../../../hooks/useLanguage";
import { ScrollContainer } from "../../../../components/ui/ScrollContainer";
import { BookOpenIcon, UsersIcon, ZapIcon, SendIcon, TrendingUpIcon } from "../../../shared/Icons";
import s from "../../../shared/ContentPage/style.module.css";
import styles from "./style.module.css";

const FEATURES = [
  { key: "studyTogetherFeature1", descKey: "studyTogetherFeature1Desc", Icon: UsersIcon, color: "" },
  { key: "studyTogetherFeature2", descKey: "studyTogetherFeature2Desc", Icon: ZapIcon, color: "green" },
  { key: "studyTogetherFeature3", descKey: "studyTogetherFeature3Desc", Icon: SendIcon, color: "purple" },
  { key: "studyTogetherFeature4", descKey: "studyTogetherFeature4Desc", Icon: TrendingUpIcon, color: "amber" },
];

const StudyTogetherPage = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <span className={styles.icon}><BookOpenIcon size={22} /></span>
          <div>
            <h1 className={styles.title}>{t("studyTogetherTitle")}</h1>
            <p className={styles.description}>{t("studyTogetherDesc")}</p>
          </div>
        </div>
        <button className={styles.primaryBtn}>{t("studyTogetherCta")}</button>
      </div>

      <ScrollContainer className={styles.scrollArea} disableHorizontalScroll>
      <div className={s.layout}>
        <div className={s.introPanel}>
          <p className={s.introText}>{t("studyTogetherDesc")}</p>
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
            <h3 className={s.ctaTitle}>{t("studyTogetherCta")}</h3>
            <p className={s.ctaDesc}>{t("studyTogetherDesc")}</p>
          </div>
          <button className={s.ctaBtn}>{t("getStarted")}</button>
        </div>
      </div>
      </ScrollContainer>
    </div>
  );
};

export default StudyTogetherPage;
