import React from "react";
import { useTranslation } from "../../../../hooks/useLanguage";
import IlmiContactHub from "../../../../components/IlmiContactHub";
import PageTemplate from "../../../shared/PageTemplate";
import { SendIcon } from "../../../shared/Icons";
import { ILMI_CONTACT_EMAIL } from "../../../../lib/ilmiContact";
import s from "../../../shared/ContentPage/style.module.css";
import cpStyles from "./style.module.css";

const ContactPremiumPage = () => {
  const { t } = useTranslation();

  const bookMeetingHref = `mailto:${ILMI_CONTACT_EMAIL}?subject=${encodeURIComponent(
    t("contactBookMeetingEmailSubject"),
  )}`;

  return (
    <PageTemplate icon={<SendIcon size={22} />} title={t("contactPremiumTitle")} backTo="/dashboard">
      <div className={s.layout}>
        <header className={cpStyles.hero}>
          <p className={cpStyles.heroKicker}>{t("contactPremiumKicker")}</p>
          <p className={cpStyles.heroIntro}>{t("contactPremiumIntro")}</p>
          <div className={cpStyles.heroActions}>
            <a href={bookMeetingHref} className={cpStyles.heroBookBtn}>
              {t("contactBookMeeting")}
            </a>
          </div>
        </header>
        <IlmiContactHub variant="embedded" t={t} />
      </div>
    </PageTemplate>
  );
};

export default ContactPremiumPage;
