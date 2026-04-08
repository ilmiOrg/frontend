import React from "react";
import { useTranslation } from "../../../../hooks/useLanguage";
import PageTemplate from "../../../shared/PageTemplate";
import { PenToolIcon, ZapIcon, BookOpenIcon, LanguagesIcon, MessageCircleIcon } from "../../../shared/Icons";
import s from "../../../shared/ContentPage/style.module.css";

const ESSAY_TYPES = [
  { key: "essayReviewsPersonalStatement" },
  { key: "essayReviewsSupplemental" },
  { key: "essayReviewsDiversity" },
  { key: "essayReviewsResearchPurpose" },
];

const FEATURES = [
  { key: "essayReviewsAiFeedback", descKey: "essayReviewsAiFeedbackDesc", Icon: ZapIcon, color: "" },
  { key: "essayReviewsStructure", descKey: "essayReviewsStructureDesc", Icon: BookOpenIcon, color: "green" },
  { key: "essayReviewsGrammar", descKey: "essayReviewsGrammarDesc", Icon: LanguagesIcon, color: "purple" },
  { key: "essayReviewsTone", descKey: "essayReviewsToneDesc", Icon: MessageCircleIcon, color: "amber" },
];

const EssayReviewsPage = () => {
  const { t } = useTranslation();

  return (
    <PageTemplate
      icon={<PenToolIcon size={22} />}
      title={t("essayReviewsTitle")}
      actions={<button className={s.primaryBtn}>{t("essayReviewsSubmitEssay")}</button>}
    >
      <div className={s.layout}>
        <div className={s.introPanel}>
          <p className={s.introText}>{t("essayReviewsIntro")}</p>
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
          {ESSAY_TYPES.map((item) => (
            <div key={item.key} className={s.contentCard}>
              <div className={s.cardHeader}>
                <div className={s.cardIcon}>
                  <PenToolIcon size={18} />
                </div>
                <h4 className={s.cardTitle}>{t(item.key)}</h4>
              </div>
              <p className={s.cardDesc}>{t("essayReviewsTurnaround")}</p>
            </div>
          ))}
        </div>

        <div className={s.ctaPanel}>
          <div className={s.ctaBody}>
            <h3 className={s.ctaTitle}>{t("essayReviewsSubmitEssay")}</h3>
            <p className={s.ctaDesc}>{t("essayReviewsIntro")}</p>
          </div>
          <button className={s.ctaBtn}>{t("getStarted")}</button>
        </div>
      </div>
    </PageTemplate>
  );
};

export default EssayReviewsPage;
