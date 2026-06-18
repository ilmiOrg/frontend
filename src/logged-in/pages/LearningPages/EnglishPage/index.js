import React from "react";
import { useTranslation } from "../../../../hooks/useLanguage";
import PageTemplate from "../../../shared/PageTemplate";
import { LanguagesIcon, BookOpenIcon, PenToolIcon, MicIcon } from "../../../shared/Icons";
import s from "../../../shared/ContentPage/style.module.css";

const FEATURES = [
  { key: "englishIelts", descKey: "englishIeltsDesc", Icon: BookOpenIcon, color: "" },
  { key: "englishToefl", descKey: "englishToeflDesc", Icon: LanguagesIcon, color: "green" },
  { key: "englishAcademic", descKey: "englishAcademicDesc", Icon: PenToolIcon, color: "purple" },
  { key: "englishSpeaking", descKey: "englishSpeakingDesc", Icon: MicIcon, color: "amber" },
];

const SKILLS = [
  { key: "englishReading" },
  { key: "englishWriting" },
  { key: "englishListening" },
  { key: "englishSpeakingSkill" },
];

const EnglishPage = () => {
  const { t } = useTranslation();

  return (
    <PageTemplate
      icon={<LanguagesIcon size={22} />}
      title={t("englishTitle")}
    >
      <div className={s.layout}>
        <div className={s.introPanel}>
          <p className={s.introText}>{t("englishIntro")}</p>
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

        <div className={s.statsRow}>
          {SKILLS.map((item) => (
            <div key={item.key} className={s.statCard}>
              <span className={s.statNumber}>--</span>
              <span className={s.statLabel}>{t(item.key)}</span>
            </div>
          ))}
        </div>

        <div className={s.ctaPanel}>
          <div className={s.ctaBody}>
            <h3 className={s.ctaTitle}>{t("englishTitle")}</h3>
            <p className={s.ctaDesc}>{t("englishIntro")}</p>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default EnglishPage;
