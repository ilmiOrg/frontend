import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useTranslation } from "../../../hooks/useLanguage";
import { ILMI_LOGO_URL } from "../../../lib/ilmiLogoUrl";
import { SplineScene } from "../../../components/SplineScene";
import { Spotlight } from "../../../components/Spotlight";
import { LandingSparklesHeader } from "../../../components/ui/LandingSparklesHeader";
import { SkyToggle } from "../../../components/ui/SkyToggle";
import LanguageSwitcher from "../../../components/LanguageSwitcher";
import { ScrollContainer } from "../../../components/ui/ScrollContainer";
import FeaturesSection from "../../components/landing/Features";
import styles from "./style.module.css";

const SPLINE_SCENE_URL =
  "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

const HERO_COPY_KEYS = {
  titleLine2: "heroTitleLine2",
  description: "heroDescription2",
  ctaPrimary: "heroCtaPrimary",
  ctaSecondary: "heroCtaSecondary",
};

const PublicHomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [isDark, setIsDark] = useState(() => {
    // Force true by default to maintain dark mode
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("theme");
    if (saved === "light") return false;
    return true;
  });

  useEffect(() => {
    const handler = () =>
      setIsDark(document.body.getAttribute("theme") === "dark");
    window.addEventListener("themeChanged", handler);
    return () => window.removeEventListener("themeChanged", handler);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.body.setAttribute("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
    document.documentElement.classList.toggle("light", !next);
    localStorage.setItem("theme", next ? "dark" : "light");
    window.dispatchEvent(
      new CustomEvent("themeChanged", {
        detail: { theme: next ? "dark" : "light", isDark: next },
      })
    );
  };

  // Section refs for smooth scrolling
  const featuresRef = useRef(null);
  const aboutRef = useRef(null);
  const faqRef = useRef(null);
  const contactRef = useRef(null);

  const [faqOpenIndex, setFaqOpenIndex] = useState(0);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const FAQ_ITEMS = [
    { question: t("faqQ1"), answer: t("faqA1") },
    { question: t("faqQ2"), answer: t("faqA2") },
    { question: t("faqQ3"), answer: t("faqA3") },
    { question: t("faqQ4"), answer: t("faqA4") },
  ];

  const SOCIAL_ICON_SIZE = 24;
  const ContactSocialIcon = ({ name, className }) => {
    const common = { width: SOCIAL_ICON_SIZE, height: SOCIAL_ICON_SIZE, className };
    switch (name) {
      case "linkedin":
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" {...common}>
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        );
      case "telegram":
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" {...common}>
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
          </svg>
        );
      case "instagram":
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" {...common}>
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        );
      case "x":
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" {...common}>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        );
      case "gmail":
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" {...common}>
            <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.364V5.457c0-2.023 2.309-3.178 3.927-1.964L2.455 4.64 12 9.548l9.545-4.91-1.382-1.127C21.69 2.28 24 3.434 24 5.457z" />
          </svg>
        );
      case "phone":
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" {...common}>
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
          </svg>
        );
      case "youtube":
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" {...common}>
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        );
      case "tiktok":
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" {...common}>
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const SOCIAL_LINKS = [
    { name: "LinkedIn", icon: "linkedin", href: "https://www.linkedin.com/company/ilmi" },
    { name: "Telegram", icon: "telegram", href: "https://t.me/ilmi" },
    { name: "Instagram", icon: "instagram", href: "https://www.instagram.com/ilmi" },
    { name: "X", icon: "x", href: "https://x.com/ilmi" },
    { name: "YouTube", icon: "youtube", href: "https://www.youtube.com/@ilmi" },
    { name: "TikTok", icon: "tiktok", href: "https://www.tiktok.com/@ilmi" },
  ];

  const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@ilmi";

  const CONTACT_ITEMS = [
    { type: "gmail", title: "Gmail", value: "hello@ilmi.org", link: "mailto:hello@ilmi.org", icon: "gmail" },
    { type: "phone", title: "Phone", value: "+996 XXX XX XX XX", link: "tel:+996XXXXXXXXX", icon: "phone" },
    ...SOCIAL_LINKS.map((s) => ({ type: "social", ...s })),
  ];

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setContactForm({ name: "", email: "", subject: "", message: "" });
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.id = "ilmi-page-styles";
    styleEl.textContent = `
      html, body {
        overflow: hidden !important;
        height: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        background: transparent !important;
      }
      #root {
        height: 100% !important;
        overflow: hidden !important;
      }
    `;
    document.head.appendChild(styleEl);
    return () => {
      const existingStyle = document.getElementById("ilmi-page-styles");
      if (existingStyle) existingStyle.remove();
    };
  }, []);

  const handleLogin = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
  };

  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className={styles.page}>
      {/* Navigation */}
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <div className={styles.navContainerLeft}>
            <button onClick={() => navigate("/")} className={styles.logo}>
              <img src={ILMI_LOGO_URL} alt="ilmi" className={styles.logoImage} />
              <span>ilmi</span>
            </button>
          </div>
          <div className={styles.navContainerCenter}>
            <div className={styles.navCenter}>
              <button
                className={styles.navLink}
                onClick={() => scrollToSection(featuresRef)}
              >
                {t("navFeatures")}
              </button>
              <button
                className={styles.navLink}
                onClick={() => scrollToSection(aboutRef)}
              >
                {t("navAbout")}
              </button>
              <button
                className={styles.navLink}
                onClick={() => scrollToSection(faqRef)}
              >
                {t("navFaq")}
              </button>
              <button
                className={styles.navLink}
                onClick={() => scrollToSection(contactRef)}
              >
                {t("navContact")}
              </button>
            </div>
          </div>
          <div className={styles.navContainerRight}>
            <div className={styles.navButtons}>
              <button onClick={handleLogin} className={styles.btnGhost}>
                {t("navLogin")}
              </button>
              <button onClick={handleGetStarted} className={styles.btnPrimary}>
                {t("navGetStarted")}
              </button>
              <div className={styles.navControls}>
                <LanguageSwitcher className={styles.navLang} />
                <span className={styles.navThemeWrap} aria-hidden="true">
                  <SkyToggle checked={isDark} onChange={toggleTheme} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main scroll area */}
      <div className={styles.scrollArea}>
        <ScrollContainer className={styles.mainScroll} disableHorizontalScroll>
          <div className={styles.scrollContent}>
            {/* Hero */}
            <section className={styles.hero}>
              <div className={styles.heroSplineWrap}>
                <SplineScene
                  scene={SPLINE_SCENE_URL}
                  className={styles.heroSpline}
                  nudgeRobotRight={0.85}
                  robotObjectNames={[
                    "Robot",
                    "Character",
                    "Agent",
                    "robot",
                    "Character2",
                    "Cube",
                    "Model",
                    "Avatar",
                    "Figure",
                  ]}
                />
                <div className={styles.heroOverlay} aria-hidden />
                <Spotlight
                  className={styles.heroSpotlight}
                  fill="var(--on-surface)"
                />
                <div className={styles.heroContentWrap}>
                  <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>
                      <span className={styles.heroLineGradient}>
                        {t(HERO_COPY_KEYS.titleLine2)}
                      </span>
                    </h1>

                    <p className={styles.heroDescription}>
                      {t(HERO_COPY_KEYS.description)}
                    </p>

                    <div className={styles.heroActions}>
                      <button
                        onClick={handleGetStarted}
                        className={styles.btnHero}
                      >
                        {t(HERO_COPY_KEYS.ctaPrimary)}
                      </button>
                      <a
                        href={YOUTUBE_CHANNEL_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.btnSecondary}
                        aria-label={t("publicSeeHowItWorks")}
                      >
                        <span className={styles.btnSecondaryIcon}>
                          <ContactSocialIcon
                            name="youtube"
                            className={styles.btnSecondaryIconSvg}
                          />
                        </span>
                        {t(HERO_COPY_KEYS.ctaSecondary)}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Features */}
            <section ref={featuresRef}>
              <FeaturesSection />
            </section>

            {/* About Us */}
            <section className={styles.about} ref={aboutRef}>
              <div className={styles.aboutContainer}>
                <LandingSparklesHeader title={t("publicAboutUs")} />
                <div className={styles.aboutShell}>
                  <div className={styles.aboutTopGrid}>
                    <div className={styles.aboutTextBlock}>
                      <p className={styles.aboutLead}>{t("publicAboutLead")}</p>
                      <p className={styles.aboutCopy}>{t("publicAboutCopy")}</p>
                    </div>
                    <div className={styles.aboutStatsBlock}>
                      <div className={styles.aboutStatCard}>
                        <p className={styles.aboutStatNumber}>100%</p>
                        <p className={styles.aboutStatLabel}>{t("aboutCoreAccess")}</p>
                      </div>
                      <div className={styles.aboutStatCard}>
                        <p className={styles.aboutStatNumber}>24/7</p>
                        <p className={styles.aboutStatLabel}>
                          Student Support
                        </p>
                      </div>
                      <div className={styles.aboutStatCard}>
                        <p className={styles.aboutStatNumber}>{t("aboutGlobal")}</p>
                        <p className={styles.aboutStatLabel}>
                          Universities Worldwide
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.aboutSupportSection}>
                    <div className={styles.aboutSupportGrid}>
                      <div className={styles.aboutSupportCard}>
                        <span className={styles.aboutSupportLabel}>
                          Support Number
                        </span>
                        <span className={styles.aboutSupportValue}>
                          +996 XXX XX XX XX
                        </span>
                      </div>
                      <div className={styles.aboutSupportCard}>
                        <span className={styles.aboutSupportLabel}>{t("publicSupportQr")}</span>
                        <div className={styles.aboutQrDummy}>
                          Add your support QR image here
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section className={styles.faqSection} ref={faqRef}>
              <div className={styles.faqContainer}>
                <LandingSparklesHeader title={t("publicFaq")} />
                <ul className={styles.faqList}>
                  {FAQ_ITEMS.map((item, index) => (
                    <li key={index} className={styles.faqItem}>
                      <button
                        type="button"
                        className={styles.faqQuestionWrap}
                        onClick={() =>
                          setFaqOpenIndex(faqOpenIndex === index ? null : index)
                        }
                        aria-expanded={faqOpenIndex === index}
                      >
                        <span className={styles.faqQuestion}>{item.question}</span>
                        <span
                          className={`${styles.faqChevron} ${
                            faqOpenIndex === index ? styles.faqChevronOpen : ""
                          }`}
                          aria-hidden
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                        </span>
                      </button>
                      <div
                        className={`${styles.faqAnswerWrap} ${
                          faqOpenIndex === index ? styles.faqAnswerWrapOpen : ""
                        }`}
                      >
                        <p className={styles.faqAnswer}>{item.answer}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Contact Us */}
            <section className={styles.contactSection} ref={contactRef}>
              <div className={styles.contactContainer}>
                <LandingSparklesHeader title={t("publicContactUs")} />
                <div className={styles.contactGrid}>
                  <div className={`${styles.contactBlock} ${styles.contactInfoBlock}`}>
                    <div className={styles.contactItemsGrid}>
                      {CONTACT_ITEMS.map((item, index) => (
                        <a
                          key={index}
                          href={item.type === "social" ? item.href : item.link}
                          className={styles.contactItemCard}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={
                            item.type === "social"
                              ? `${item.name} @ilmi`
                              : `${item.title} ${item.value}`
                          }
                        >
                          {(item.type === "social" || item.type === "gmail" || item.type === "phone") ? (
                            <>
                              <span className={styles.contactItemIcon}>
                                <ContactSocialIcon
                                  name={item.icon}
                                  className={styles.contactSocialIconSvg}
                                />
                              </span>
                              <span className={styles.contactItemValue}>
                                {item.type === "social" ? "@ilmi" : item.value}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className={styles.contactItemTitle}>
                                {item.title}
                              </span>
                              <span className={styles.contactItemValue}>
                                {item.value}
                              </span>
                            </>
                          )}
                        </a>
                      ))}
                    </div>
                  </div>
                  <div className={`${styles.contactBlock} ${styles.contactFormCard}`}>
                    <h3 className={styles.contactBlockTitle}>{t("publicSendMessage")}</h3>
                    {contactSubmitted ? (
                      <div className={styles.contactSuccess}>
                        <p>{t("publicMessageSent")}</p>
                        <button
                          type="button"
                          className={styles.contactSubmitBtn}
                          onClick={() => setContactSubmitted(false)}
                        >
                          Send another one
                        </button>
                      </div>
                    ) : (
                      <form
                        onSubmit={handleContactSubmit}
                        className={styles.contactForm}
                      >
                        <div className={styles.contactFormRow}>
                          <label className={styles.contactLabel}>{t("publicFullName")}</label>
                          <input
                            type="text"
                            name="name"
                            value={contactForm.name}
                            onChange={handleContactChange}
                            required
                            placeholder={t("publicFullNamePh")}
                            className={styles.contactInput}
                          />
                        </div>
                        <div className={styles.contactFormRow}>
                          <label className={styles.contactLabel}>{t("contactLabelEmail")}</label>
                          <input
                            type="email"
                            name="email"
                            value={contactForm.email}
                            onChange={handleContactChange}
                            required
                            placeholder="you@example.com"
                            className={styles.contactInput}
                          />
                        </div>
                        <div className={styles.contactFormRow}>
                          <label className={styles.contactLabel}>{t("contactLabelTopic")}</label>
                          <input
                            type="text"
                            name="subject"
                            value={contactForm.subject}
                            onChange={handleContactChange}
                            required
                            placeholder={t("publicTopicPh")}
                            className={styles.contactInput}
                          />
                        </div>
                        <div className={styles.contactFormRow}>
                          <label className={styles.contactLabel}>{t("publicMessageLabel")}</label>
                          <textarea
                            name="message"
                            value={contactForm.message}
                            onChange={handleContactChange}
                            required
                            placeholder={t("publicMessagePh")}
                            className={styles.contactTextarea}
                            rows={4}
                          />
                        </div>
                        <button type="submit" className={styles.contactSubmitBtn}>
                          Send Message
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
              <div className={styles.footerContainer}>
                <div className={styles.footerBrand}>
                  <div className={styles.footerLogo}>
                    <img
                      src={ILMI_LOGO_URL}
                      alt="ilmi"
                      className={styles.footerLogoImg}
                    />
                    <span>ilmi</span>
                  </div>
                  <span className={styles.footerCopy}>
                    © {new Date().getFullYear()} ilmi. All rights reserved
                  </span>
                </div>
                <div className={styles.footerLinks}>
                  <button className={styles.footerLink}>{t("publicFooterPrivacy")}</button>
                  <button className={styles.footerLink}>{t("publicFooterTerms")}</button>
                  <button className={styles.footerLink}>{t("publicFooterContact")}</button>
                </div>
              </div>
            </footer>
          </div>
        </ScrollContainer>
      </div>
    </div>
  );
};

export default PublicHomePage;
