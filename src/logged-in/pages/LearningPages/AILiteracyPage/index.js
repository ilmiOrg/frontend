import React from "react";
import { useTranslation } from "../../../../hooks/useLanguage";
import PageTemplate from "../../../shared/PageTemplate";
import { CpuIcon, BookOpenIcon, MessageCircleIcon, ShieldIcon } from "../../../shared/Icons";
import s from "../../../shared/ContentPage/style.module.css";

const FEATURES = [
  { key: "aiLiteracyFundamentals", descKey: "aiLiteracyFundamentalsDesc", Icon: CpuIcon, color: "" },
  { key: "aiLiteracyPrompt", descKey: "aiLiteracyPromptDesc", Icon: MessageCircleIcon, color: "green" },
  { key: "aiLiteracyData", descKey: "aiLiteracyDataDesc", Icon: BookOpenIcon, color: "purple" },
  { key: "aiLiteracyEthics", descKey: "aiLiteracyEthicsDesc", Icon: ShieldIcon, color: "amber" },
];

const AILiteracyPage = () => {
  const { t } = useTranslation();

  return (
    <PageTemplate
      icon={<CpuIcon size={22} />}
      title={t("aiLiteracyTitle")}
    >
      <div className={s.layout}>
        <div className={s.introPanel}>
          <p className={s.introText}>{t("aiLiteracyIntro")}</p>
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
            <h3 className={s.ctaTitle}>{t("aiLiteracyTitle")}</h3>
            <p className={s.ctaDesc}>{t("aiLiteracyIntro")}</p>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default AILiteracyPage;
