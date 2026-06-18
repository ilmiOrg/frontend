import React from "react";
import { useTranslation } from "../../../../hooks/useLanguage";
import PageTemplate from "../../../shared/PageTemplate";
import { UsersIcon, HeartIcon, BookOpenIcon, GraduationCapIcon, LanguagesIcon } from "../../../shared/Icons";
import s from "../../../shared/ContentPage/style.module.css";

const FEATURES = [
  { key: "connectFriendsInterest", descKey: "connectFriendsInterestDesc", Icon: HeartIcon, color: "" },
  { key: "connectFriendsStudy", descKey: "connectFriendsStudyDesc", Icon: BookOpenIcon, color: "green" },
  { key: "connectFriendsCampus", descKey: "connectFriendsCampusDesc", Icon: GraduationCapIcon, color: "purple" },
  { key: "connectFriendsCultural", descKey: "connectFriendsCulturalDesc", Icon: LanguagesIcon, color: "amber" },
];

const ConnectFriendsPage = () => {
  const { t } = useTranslation();

  return (
    <PageTemplate
      icon={<UsersIcon size={22} />}
      title={t("connectFriendsTitle")}
    >
      <div className={s.layout}>
        <div className={s.introPanel}>
          <p className={s.introText}>{t("connectFriendsIntro")}</p>
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
      </div>
    </PageTemplate>
  );
};

export default ConnectFriendsPage;
