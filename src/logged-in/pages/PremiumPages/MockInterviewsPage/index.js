import React from "react";
import { useTranslation } from "../../../../hooks/useLanguage";
import PageTemplate from "../../../shared/PageTemplate";
import { MicIcon, CpuIcon, MessageCircleIcon, BookOpenIcon, TrendingUpIcon } from "../../../shared/Icons";
import s from "../../../shared/ContentPage/style.module.css";

const FEATURES = [
  { key: "mockInterviewsAi", descKey: "mockInterviewsAiDesc", Icon: CpuIcon, color: "" },
  { key: "mockInterviewsFeedback", descKey: "mockInterviewsFeedbackDesc", Icon: MessageCircleIcon, color: "green" },
  { key: "mockInterviewsBank", descKey: "mockInterviewsBankDesc", Icon: BookOpenIcon, color: "purple" },
  { key: "mockInterviewsTrack", descKey: "mockInterviewsTrackDesc", Icon: TrendingUpIcon, color: "amber" },
];

const TYPES = [
  { key: "mockInterviewsGeneral", Icon: MicIcon },
  { key: "mockInterviewsTechnical", Icon: CpuIcon },
  { key: "mockInterviewsScholarship", Icon: BookOpenIcon },
  { key: "mockInterviewsPortfolio", Icon: MessageCircleIcon },
];

const MockInterviewsPage = () => {
  const { t } = useTranslation();

  return (
    <PageTemplate
      icon={<MicIcon size={22} />}
      title={t("mockInterviewsTitle")}
    >
      <div className={s.layout}>
        <div className={s.introPanel}>
          <p className={s.introText}>{t("mockInterviewsIntro")}</p>
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
          {TYPES.map((item) => (
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

        <div className={s.ctaPanel}>
          <div className={s.ctaBody}>
            <h3 className={s.ctaTitle}>{t("mockInterviewsTitle")}</h3>
            <p className={s.ctaDesc}>{t("mockInterviewsIntro")}</p>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default MockInterviewsPage;
