import React from "react";
import { useTranslation } from "../../../../hooks/useLanguage";
import PageTemplate from "../../../shared/PageTemplate";
import { FileEditIcon, CpuIcon, UsersIcon, GraduationCapIcon } from "../../../shared/Icons";
import s from "../../../shared/ContentPage/style.module.css";

const FEATURES = [
  { key: "essayWritingTemplates", descKey: "essayWritingTemplatesDesc", Icon: FileEditIcon, color: "" },
  { key: "essayWritingAi", descKey: "essayWritingAiDesc", Icon: CpuIcon, color: "green" },
  { key: "essayWritingPeer", descKey: "essayWritingPeerDesc", Icon: UsersIcon, color: "purple" },
  { key: "essayWritingUniTips", descKey: "essayWritingUniTipsDesc", Icon: GraduationCapIcon, color: "amber" },
];

const EssayWritingPage = () => {
  const { t } = useTranslation();

  return (
    <PageTemplate
      icon={<FileEditIcon size={22} />}
      title={t("essayWritingTitle")}
    >
      <div className={s.layout}>
        <div className={s.introPanel}>
          <p className={s.introText}>{t("essayWritingIntro")}</p>
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
            <h3 className={s.ctaTitle}>{t("essayWritingTitle")}</h3>
            <p className={s.ctaDesc}>{t("essayWritingIntro")}</p>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default EssayWritingPage;
