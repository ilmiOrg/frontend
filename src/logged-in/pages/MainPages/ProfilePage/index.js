import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import { useTranslation } from "../../../../hooks/useLanguage";
import PageTemplate from "../../../shared/PageTemplate";
import { UserIcon, StarIcon, LogOutIcon, CheckIcon } from "../../../shared/Icons";
import s from "../../../shared/ContentPage/style.module.css";
import styles from "./style.module.css";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const userName = user?.name || "Student";
  const userEmail = user?.email || "";

  return (
    <PageTemplate
      icon={<UserIcon size={22} />}
      title={t("profileTitle")}
      backTo="/dashboard"
      onBack={() => navigate("/dashboard")}
    >
      <div className={s.layout}>
        <div className={styles.profileCard}>
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>
              <UserIcon size={32} />
            </div>
            <button className={s.primaryBtn}>{t("profileChangePhoto")}</button>
          </div>

          <div className={styles.infoSection}>
            <div className={styles.infoGroup}>
              <label>{t("profileFullName")}</label>
              <input type="text" defaultValue={userName} className={styles.input} />
            </div>
            <div className={styles.infoGroup}>
              <label>{t("profileEmail")}</label>
              <input type="email" defaultValue={userEmail} className={styles.input} />
            </div>
            <div className={styles.infoGroup}>
              <label>{t("profilePhone")}</label>
              <input type="tel" defaultValue="" className={styles.input} placeholder="+1 234 567 8900" />
            </div>
            <div className={styles.infoGroup}>
              <label>{t("profileLocation")}</label>
              <input type="text" defaultValue="" className={styles.input} placeholder="Bishkek, Kyrgyzstan" />
            </div>
          </div>
        </div>

        <div className={s.statsRow}>
          <div className={s.statCard}>
            <span className={s.statNumber}>0</span>
            <span className={s.statLabel}>{t("profileApplications")}</span>
          </div>
          <div className={s.statCard}>
            <span className={s.statNumber}>0</span>
            <span className={s.statLabel}>{t("profileScholarships")}</span>
          </div>
          <div className={s.statCard}>
            <span className={s.statNumber}>0</span>
            <span className={s.statLabel}>{t("profileViews")}</span>
          </div>
        </div>

        <div className={s.introPanel}>
          <div className={s.featureGrid}>
            <div className={s.featureCard}>
              <div className={`${s.featureIconWrap} ${s.amber}`}>
                <StarIcon size={18} />
              </div>
              <div className={s.featureBody}>
                <h4 className={s.featureTitle}>{t("profilePremium")}</h4>
                <p className={s.featureDesc}>{t("profilePremiumDesc")}</p>
              </div>
            </div>
          </div>
          <ul className={styles.premiumFeatures}>
            <li><CheckIcon size={14} /> {t("profilePremiumMatch")}</li>
            <li><CheckIcon size={14} /> {t("profilePremiumSupport")}</li>
            <li><CheckIcon size={14} /> {t("profilePremiumAlerts")}</li>
            <li><CheckIcon size={14} /> {t("profilePremiumMentor")}</li>
          </ul>
        </div>

        <div className={styles.actionsCard}>
          <button className={s.primaryBtn}>{t("profileSave")}</button>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOutIcon size={16} /> {t("profileLogout")}
          </button>
        </div>
      </div>
    </PageTemplate>
  );
};

export default ProfilePage;
