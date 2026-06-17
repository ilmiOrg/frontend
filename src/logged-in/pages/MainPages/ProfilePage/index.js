import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import { useAuth } from "../../../../contexts/AuthContext";
import { useTranslation } from "../../../../hooks/useLanguage";
import PageTemplate from "../../../shared/PageTemplate";
import { UserIcon, LogOutIcon } from "../../../shared/Icons";
import {
  getStudentProfile,
  updateStudentProfile,
} from "../../../../api/studentProfile";
import InterestsSection from "./InterestsSection";
import FundingSection from "./FundingSection";
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
  const [maxBudget, setMaxBudget] = useState("");
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
      setMaxBudget(data.maxBudget != null ? String(data.maxBudget) : "");
    } catch (err) {
      setLoadError(err.message || t("profileLoadError"));
    } finally {
      setLoading(false);
    }
    // `t` intentionally omitted: useLanguage returns a fresh `t` each render, so
    // depending on it would recreate loadProfile every render and loop the fetch.
  }, [isGuest]); // eslint-disable-line react-hooks/exhaustive-deps

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
      await updateStudentProfile({
        firstName,
        lastName,
        phone,
        location,
        maxBudget: maxBudget === "" ? null : Number(maxBudget),
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
            <div className={styles.infoGroup}>
              <label htmlFor="profile-budget">{t("profileMaxBudget")}</label>
              <input
                id="profile-budget"
                type="number"
                min="0"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                className={styles.input}
                disabled={loading || isGuest}
                placeholder={t("profileMaxBudgetPlaceholder")}
              />
            </div>
          </div>
        </div>

        {!isGuest ? (
          <FundingSection
            disabled={loading || isGuest}
            onTotalChange={(total) => setMaxBudget(total != null ? String(total) : "")}
          />
        ) : null}

        {!isGuest ? <InterestsSection disabled={loading || isGuest} /> : null}

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
