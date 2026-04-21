import React, { useMemo, useState } from "react";
import QRCode from "react-qr-code";
import {
  ILMI_CONTACT_EMAIL,
  ILMI_PHONE_DISPLAY,
  ILMI_PHONE_TEL,
  ILMI_TELEGRAM_CHANNEL_URL,
  ILMI_SOCIAL_LINKS,
} from "../../lib/ilmiContact";
import ContactSocialIcon from "./ContactSocialIcon";
import styles from "./style.module.css";

const PLATFORM_LABEL_KEYS = {
  linkedin: "contactPlatformLinkedIn",
  telegram: "contactPlatformTelegram",
  instagram: "contactPlatformInstagram",
  x: "contactPlatformX",
  youtube: "contactPlatformYouTube",
  tiktok: "contactPlatformTikTok",
};

function tileAriaLabel(item, t) {
  if (item.key === "email") {
    return `${t("contactEmailLabel")}: ${item.display}`;
  }
  if (item.key === "phone") {
    return `${t("dashContactPhoneLabel")}: ${item.display}`;
  }
  return `${t(PLATFORM_LABEL_KEYS[item.key])}: ${item.display}`;
}

/**
 * Logged-in contact hub: same ideas as the logged-out landing — icon tiles + Telegram QR, no copy-link buttons.
 * @param {"dashboard"|"embedded"} variant
 */
const IlmiContactHub = ({ t, variant = "dashboard" }) => {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const gridItems = useMemo(
    () => [
      {
        key: "email",
        icon: "gmail",
        href: `mailto:${ILMI_CONTACT_EMAIL}`,
        display: ILMI_CONTACT_EMAIL,
        external: false,
      },
      {
        key: "phone",
        icon: "phone",
        href: ILMI_PHONE_TEL,
        display: ILMI_PHONE_DISPLAY,
        external: false,
      },
      ...ILMI_SOCIAL_LINKS.map((link) => ({
        key: link.id,
        icon: link.id,
        href: link.href,
        display: "@ilmi",
        external: true,
      })),
    ],
    [],
  );

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setContactForm({ name: "", email: "", subject: "", message: "" });
  };

  const TelegramQr = ({ size = 104, compact = false, embedded = false }) => {
    const captionClass = embedded ? styles.qrCaptionEmbedded : styles.qrCaption;
    const frameClass = embedded ? styles.qrFrameEmbedded : styles.qrFrame;
    const caption = (
      <p className={captionClass}>{t("dashContactTelegramQrCaption")}</p>
    );
    const frame = (
      <div className={frameClass}>
        <QRCode value={ILMI_TELEGRAM_CHANNEL_URL} size={size} bgColor="#ffffff" fgColor="#0f172a" />
      </div>
    );

    if (embedded) {
      return (
        <a
          href={ILMI_TELEGRAM_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.qrBannerEmbedded}
        >
          {caption}
          {frame}
        </a>
      );
    }

    return (
      <div className={compact ? styles.qrBannerCompact : styles.qrBanner}>
        {caption}
        {frame}
      </div>
    );
  };

  const embeddedTileSlots = [
    styles.tileSlot0,
    styles.tileSlot1,
    styles.tileSlot2,
    styles.tileSlot3,
    styles.tileSlot4,
    styles.tileSlot5,
    styles.tileSlot6,
    styles.tileSlot7,
  ];

  const renderContactTile = (item, tileClassName) => (
    <a
      key={item.key}
      href={item.href}
      className={tileClassName}
      {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      aria-label={tileAriaLabel(item, t)}
    >
      <span className={styles.tileIcon}>
        <ContactSocialIcon name={item.icon} />
      </span>
      <span className={styles.tileText}>{item.display}</span>
    </a>
  );

  const TilesGrid = ({ compact }) => (
    <div className={compact ? styles.itemsGridCompact : styles.itemsGrid}>
      {gridItems.map((item) => renderContactTile(item, compact ? styles.tileCompact : styles.tile))}
    </div>
  );

  const compactStrip = (
    <div className={styles.compactStrip}>
      <div className={styles.compactHeader}>
        <h3 id="ilmi-contact-compact-title" className={styles.compactTitle}>
          {t("dashContactDetailsTitle")}
        </h3>
        <p className={styles.compactSubtitle}>{t("dashContactCompactHint")}</p>
      </div>
      <TelegramQr size={88} compact />
      <TilesGrid compact />
    </div>
  );

  const fullGrid = (
    <div className={styles.grid}>
      <div className={styles.infoCard}>
        <p className={styles.panelEyebrow}>{t("dashContactUsTitle")}</p>
        <div className={styles.embeddedContactStack}>
          <div className={styles.embeddedContactMatrix}>
            <div className={styles.qrCell}>
              <TelegramQr size={220} embedded />
            </div>
            {gridItems.map((item, index) =>
              renderContactTile(item, `${styles.tileEmbedded} ${embeddedTileSlots[index]}`),
            )}
          </div>
        </div>
      </div>

      <div className={styles.formCard}>
        <h2 className={styles.formTitle}>{t("dashContactFormTitle")}</h2>
        {contactSubmitted ? (
          <div className={styles.success}>
            <p>{t("dashContactFormThanks")}</p>
            <button type="button" className={styles.submitBtnLight} onClick={() => setContactSubmitted(false)}>
              {t("dashContactFormAgain")}
            </button>
          </div>
        ) : (
          <form onSubmit={handleContactSubmit} className={`${styles.form} ${styles.formStretch}`}>
            <div className={styles.formRowPair}>
              <div className={styles.formRow}>
                <label className={styles.label} htmlFor="ilmi-contact-name">
                  {t("dashContactFormName")}
                </label>
                <input
                  id="ilmi-contact-name"
                  type="text"
                  name="name"
                  value={contactForm.name}
                  onChange={handleContactChange}
                  required
                  placeholder={t("dashContactFormNamePh")}
                  className={styles.input}
                  autoComplete="name"
                />
              </div>
              <div className={styles.formRow}>
                <label className={styles.label} htmlFor="ilmi-contact-email">
                  {t("dashContactFormEmail")}
                </label>
                <input
                  id="ilmi-contact-email"
                  type="email"
                  name="email"
                  value={contactForm.email}
                  onChange={handleContactChange}
                  required
                  placeholder={t("dashContactFormEmailPh")}
                  className={styles.input}
                  autoComplete="email"
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <label className={styles.label} htmlFor="ilmi-contact-topic">
                {t("dashContactFormTopic")}
              </label>
              <input
                id="ilmi-contact-topic"
                type="text"
                name="subject"
                value={contactForm.subject}
                onChange={handleContactChange}
                required
                placeholder={t("dashContactFormTopicPh")}
                className={styles.input}
              />
            </div>
            <div className={`${styles.formRow} ${styles.formMessageRow}`}>
              <label className={styles.label} htmlFor="ilmi-contact-message">
                {t("dashContactFormMessage")}
              </label>
              <textarea
                id="ilmi-contact-message"
                name="message"
                value={contactForm.message}
                onChange={handleContactChange}
                required
                placeholder={t("dashContactFormMessagePh")}
                className={`${styles.textarea} ${styles.textareaStretch}`}
                rows={5}
              />
            </div>
            <button type="submit" className={styles.submitBtnLight}>
              {t("dashContactFormSubmit")}
            </button>
          </form>
        )}
      </div>
    </div>
  );

  return (
    <section
      className={styles.section}
      aria-labelledby={variant === "dashboard" ? "ilmi-contact-compact-title" : undefined}
    >
      {variant === "dashboard" ? compactStrip : fullGrid}
    </section>
  );
};

export default IlmiContactHub;
