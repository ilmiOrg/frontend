import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import { useAuth } from "../../../../contexts/AuthContext";
import { useTranslation } from "../../../../hooks/useLanguage";
import PageTemplate from "../../../shared/PageTemplate";
import { UserIcon, StarIcon, LogOutIcon, CheckIcon } from "../../../shared/Icons";
import {
  getStudentProfile,
  updateStudentProfile,
} from "../../../../api/studentProfile";
import s from "../../../shared/ContentPage/style.module.css";
import styles from "./style.module.css";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { t } = useTranslation();

  const [shareUrl, setShareUrl] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [certificationsText, setCertificationsText] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const isGuest = user?.isGuest === true;

  useEffect(() => {
    setShareUrl(`${window.location.origin}/dashboard/profile`);
  }, []);

  const loadProfile = useCallback(async () => {
    if (isGuest) {
      return;
    }
    setLoading(true);
    setLoadError(null);
    try {
      const data = await getStudentProfile();
      setFirstName(data.firstName || "");
      setLastName(data.lastName || "");
      setEmail(data.email || "");
      setPhone(data.phone || "");
      setLocation(data.location || "");
      const certs = Array.isArray(data.certifications) ? data.certifications : [];
      setCertificationsText(certs.join("\n"));
    } catch (err) {
      setLoadError(err.message || t("profileLoadError"));
    } finally {
      setLoading(false);
    }
  }, [isGuest, t]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSave = async () => {
    if (isGuest) {
      return;
    }
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      const certifications = certificationsText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
      await updateStudentProfile({
        firstName,
        lastName,
        phone,
        location,
        certifications,
      });
      setSaveSuccess(true);
      window.setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      setSaveError(err.message || t("profileSaveError"));
    } finally {
      setSaving(false);
    }
  };

  const handleCopyLink = async () => {
    if (!shareUrl) {
      return;
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
      window.setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      setSaveError(t("profileSaveError"));
    }
  };

  return (
    <PageTemplate
      icon={<UserIcon size={22} />}
      title={t("profileTitle")}
      backTo="/dashboard"
      onBack={() => navigate("/dashboard")}
    >
      <div className={s.layout}>
        {isGuest ? (
          <div className={styles.noticeBanner} role="status">
            {t("profileGuestHint")}
          </div>
        ) : null}

        {loadError ? (
          <div className={styles.messageError} role="alert">
            {loadError}
          </div>
        ) : null}
        {saveError ? (
          <div className={styles.messageError} role="alert">
            {saveError}
          </div>
        ) : null}
        {saveSuccess ? (
          <div className={styles.messageSuccess} role="status">
            {t("profileSaveSuccess")}
          </div>
        ) : null}

        <div className={styles.profileCard}>
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>
              <UserIcon size={32} />
            </div>
            <button type="button" className={s.primaryBtn} disabled>
              {t("profileChangePhoto")}
            </button>
          </div>

          <div className={styles.infoSection}>
            <div className={styles.infoGroup}>
              <label htmlFor="profile-first">{t("profileFirstName")}</label>
              <input
                id="profile-first"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={styles.input}
                disabled={loading || isGuest}
                autoComplete="given-name"
              />
            </div>
            <div className={styles.infoGroup}>
              <label htmlFor="profile-last">{t("profileLastName")}</label>
              <input
                id="profile-last"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={styles.input}
                disabled={loading || isGuest}
                autoComplete="family-name"
              />
            </div>
            <div className={styles.infoGroup}>
              <label htmlFor="profile-email">{t("profileEmail")}</label>
              <input
                id="profile-email"
                type="email"
                value={email || user?.email || ""}
                readOnly
                className={`${styles.input} ${styles.inputReadonly}`}
              />
            </div>
            <div className={styles.infoGroup}>
              <label htmlFor="profile-phone">{t("profilePhone")}</label>
              <input
                id="profile-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={styles.input}
                disabled={loading || isGuest}
                autoComplete="tel"
              />
            </div>
            <div className={styles.infoGroup}>
              <label htmlFor="profile-location">{t("profileLocation")}</label>
              <input
                id="profile-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={styles.input}
                disabled={loading || isGuest}
                autoComplete="address-level2"
              />
            </div>
            <div className={`${styles.infoGroup} ${styles.infoGroupWide}`}>
              <label htmlFor="profile-certs">{t("profileCertifications")}</label>
              <p className={styles.fieldHint}>{t("profileCertificationsHint")}</p>
              <textarea
                id="profile-certs"
                value={certificationsText}
                onChange={(e) => setCertificationsText(e.target.value)}
                className={styles.textarea}
                rows={5}
                disabled={loading || isGuest}
              />
            </div>
          </div>
        </div>

        <div className={styles.shareCard}>
          <h3 className={styles.shareTitle}>{t("profileShareTitle")}</h3>
          <p className={styles.shareDesc}>{t("profileShareDesc")}</p>
          <div className={styles.shareRow}>
            <div className={styles.qrWrap}>
              {shareUrl ? (
                <QRCode
                  value={shareUrl}
                  size={140}
                  bgColor="#ffffff"
                  fgColor="#0f172a"
                />
              ) : null}
            </div>
            <div className={styles.shareActions}>
              <code className={styles.linkPreview}>{shareUrl || "—"}</code>
              <button
                type="button"
                className={s.primaryBtn}
                onClick={handleCopyLink}
                disabled={!shareUrl}
              >
                {linkCopied ? t("profileLinkCopied") : t("profileCopyLink")}
              </button>
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
            <li>
              <CheckIcon size={14} /> {t("profilePremiumMatch")}
            </li>
            <li>
              <CheckIcon size={14} /> {t("profilePremiumSupport")}
            </li>
            <li>
              <CheckIcon size={14} /> {t("profilePremiumAlerts")}
            </li>
            <li>
              <CheckIcon size={14} /> {t("profilePremiumMentor")}
            </li>
          </ul>
        </div>

        <div className={styles.actionsCard}>
          <button
            type="button"
            className={s.primaryBtn}
            onClick={handleSave}
            disabled={loading || saving || isGuest}
          >
            {saving ? t("profileSaving") : t("profileSave")}
          </button>
          <button
            type="button"
            className={styles.logoutBtn}
            onClick={handleLogout}
          >
            <LogOutIcon size={16} /> {t("profileLogout")}
          </button>
        </div>
      </div>
    </PageTemplate>
  );
};

export default ProfilePage;
