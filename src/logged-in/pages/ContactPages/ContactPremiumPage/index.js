import React from "react";
import { useTranslation } from "../../../../hooks/useLanguage";
import PageTemplate from "../../../shared/PageTemplate";
import { SendIcon, ZapIcon, PlayCircleIcon, FileEditIcon, UsersIcon } from "../../../shared/Icons";
import s from "../../../shared/ContentPage/style.module.css";

const FEATURES = [
  { key: "contactPremiumPriority", descKey: "contactPremiumPriorityDesc", Icon: ZapIcon, color: "" },
  { key: "contactPremiumVideo", descKey: "contactPremiumVideoDesc", Icon: PlayCircleIcon, color: "green" },
  { key: "contactPremiumDoc", descKey: "contactPremiumDocDesc", Icon: FileEditIcon, color: "purple" },
  { key: "contactPremiumTeam", descKey: "contactPremiumTeamDesc", Icon: UsersIcon, color: "amber" },
];

const CHANNELS = [
  { key: "contactPremiumEmail", descKey: "contactPremiumEmailDesc" },
  { key: "contactPremiumChat", descKey: "contactPremiumChatDesc" },
  { key: "contactPremiumCall", descKey: "contactPremiumCallDesc" },
];

const ContactPremiumPage = () => {
  const { t } = useTranslation();

  return (
    <PageTemplate
      icon={<SendIcon size={22} />}
      title={t("contactPremiumTitle")}
      actions={<button className={s.primaryBtn}>{t("contactPremiumContactUs")}</button>}
    >
      <div className={s.layout}>
        <div className={s.introPanel}>
          <p className={s.introText}>{t("contactPremiumIntro")}</p>
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
        <h3 className={s.sectionLabel}>{t("contactPremiumChannels")}</h3>

        <div className={s.cardGrid}>
          {CHANNELS.map((ch) => (
            <div key={ch.key} className={s.contentCard}>
              <div className={s.cardHeader}>
                <div className={s.cardIcon}>
                  <SendIcon size={18} />
                </div>
                <h4 className={s.cardTitle}>{t(ch.key)}</h4>
              </div>
              <p className={s.cardDesc}>{t(ch.descKey)}</p>
            </div>
          ))}
        </div>

        <div className={s.ctaPanel}>
          <div className={s.ctaBody}>
            <h3 className={s.ctaTitle}>{t("contactPremiumTitle")}</h3>
            <p className={s.ctaDesc}>{t("contactPremiumIntro")}</p>
          </div>
          <button className={s.ctaBtn}>{t("contactPremiumContactUs")}</button>
        </div>
      </div>
    </PageTemplate>
  );
};

export default ContactPremiumPage;
