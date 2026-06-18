import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PageTemplate from "../../../shared/PageTemplate";
import { GraduationCapIcon, DollarIcon, FileEditIcon, CalendarIcon, MessageCircleIcon, StarIcon, SendIcon, CheckCircleIcon } from "../../../shared/Icons";
import { useTranslation } from "../../../../hooks/useLanguage";
import styles from "./style.module.css";

// EmailJS config comes from the environment — no secrets committed to source. When the public
// key is unset the form still renders but submission fails gracefully (handled in handleSubmit).
const EMAILJS_KEY = process.env.REACT_APP_EMAILJS_KEY;
const EMAILJS_SERVICE = process.env.REACT_APP_EMAILJS_SERVICE || "service_quad";
const EMAILJS_TEMPLATE = process.env.REACT_APP_EMAILJS_TEMPLATE || "template_info";
const EMAILJS_TO = process.env.REACT_APP_EMAILJS_TO || "info@quad.edu";

const SendInfoPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("university");
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!EMAILJS_KEY) return undefined; // not configured — skip loading the SDK
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js";
    script.onload = () => {
      if (window.emailjs) {
        window.emailjs.init(EMAILJS_KEY);
      }
    };
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  // Switching tabs swaps the whole field set — clear so fields from a previous tab
  // don't ride along in the submitted payload.
  useEffect(() => {
    setFormData({});
  }, [activeTab]);

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(false);
    setIsSubmitting(true);

    try {
      if (!EMAILJS_KEY || !window.emailjs) {
        // Not configured / CDN failed — do NOT report success, the message wasn't sent.
        throw new Error("Email service unavailable");
      }
      await window.emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, {
        form_type: activeTab,
        ...formData,
        to_email: EMAILJS_TO,
      });
      if (!mountedRef.current) return;
      setSubmitSuccess(true);
      setFormData({});
    } catch (error) {
      console.error("Error sending email:", error);
      if (mountedRef.current) setSubmitError(true);
    } finally {
      if (mountedRef.current) setIsSubmitting(false);
    }
  };

  const handleTabKey = (e, index) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (index + dir + tabs.length) % tabs.length;
    setActiveTab(tabs[nextIndex].id);
  };

  const tabs = [
    { id: "university", label: t("sendInfoTabUniversity"), icon: <GraduationCapIcon size={16} /> },
    { id: "scholarship", label: t("sendInfoTabScholarship"), icon: <DollarIcon size={16} /> },
    { id: "application", label: t("sendInfoTabApplication"), icon: <FileEditIcon size={16} /> },
    { id: "meeting", label: t("sendInfoTabMeeting"), icon: <CalendarIcon size={16} /> },
    { id: "other", label: t("sendInfoTabOther"), icon: <MessageCircleIcon size={16} /> },
  ];

  const renderForm = () => {
    switch (activeTab) {
      case "university":
        return (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="sendinfo-fullName">{t("sendInfoFieldFullName")} *</label>
              <input
                id="sendinfo-fullName"
                type="text"
                name="fullName"
                required
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhFullName")}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="sendinfo-email">{t("sendInfoFieldEmail")} *</label>
              <input
                id="sendinfo-email"
                type="email"
                name="email"
                required
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhEmail")}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="sendinfo-phone">{t("sendInfoFieldPhone")}</label>
              <input
                id="sendinfo-phone"
                type="tel"
                name="phone"
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhPhone")}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="sendinfo-university">{t("sendInfoFieldUniversityInterest")} *</label>
              <input
                id="sendinfo-university"
                type="text"
                name="university"
                required
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhUniversityInterest")}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="sendinfo-program">{t("sendInfoFieldProgramMajor")}</label>
              <input
                id="sendinfo-program"
                type="text"
                name="program"
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhProgramInterest")}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="sendinfo-gpa">{t("sendInfoFieldGpa")}</label>
              <input
                id="sendinfo-gpa"
                type="text"
                name="gpa"
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhGpa")}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="sendinfo-message">{t("sendInfoFieldAdditional")}</label>
              <textarea
                id="sendinfo-message"
                name="message"
                onChange={handleInputChange}
                className={styles.textarea}
                placeholder={t("sendInfoPhGoals")}
                rows={4}
              ></textarea>
            </div>
          </>
        );
      case "scholarship":
        return (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="sendinfo-fullName">{t("sendInfoFieldFullName")} *</label>
              <input
                id="sendinfo-fullName"
                type="text"
                name="fullName"
                required
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhFullName")}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="sendinfo-email">{t("sendInfoFieldEmail")} *</label>
              <input
                id="sendinfo-email"
                type="email"
                name="email"
                required
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhEmail")}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="sendinfo-phone">{t("sendInfoFieldPhone")}</label>
              <input
                id="sendinfo-phone"
                type="tel"
                name="phone"
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhPhone")}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="sendinfo-scholarshipName">{t("sendInfoFieldScholarshipName")} *</label>
              <input
                id="sendinfo-scholarshipName"
                type="text"
                name="scholarshipName"
                required
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhScholarship")}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="sendinfo-university">{t("sendInfoFieldUniversity")}</label>
              <input
                id="sendinfo-university"
                type="text"
                name="university"
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhUniversityOpt")}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="sendinfo-achievements">{t("sendInfoFieldAchievements")}</label>
              <textarea
                id="sendinfo-achievements"
                name="achievements"
                onChange={handleInputChange}
                className={styles.textarea}
                placeholder={t("sendInfoPhAchievements")}
                rows={4}
              ></textarea>
            </div>
          </>
        );
      case "application":
        return (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="sendinfo-fullName">{t("sendInfoFieldFullName")} *</label>
              <input
                id="sendinfo-fullName"
                type="text"
                name="fullName"
                required
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhFullName")}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="sendinfo-email">{t("sendInfoFieldEmail")} *</label>
              <input
                id="sendinfo-email"
                type="email"
                name="email"
                required
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhEmail")}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="sendinfo-phone">{t("sendInfoFieldPhone")}</label>
              <input
                id="sendinfo-phone"
                type="tel"
                name="phone"
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhPhone")}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="sendinfo-university">{t("sendInfoFieldUniversity")} *</label>
              <input
                id="sendinfo-university"
                type="text"
                name="university"
                required
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhUniversityRequired")}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="sendinfo-program">{t("sendInfoFieldProgram")} *</label>
              <input
                id="sendinfo-program"
                type="text"
                name="program"
                required
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhProgramRequired")}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="sendinfo-deadline">{t("sendInfoFieldDeadline")}</label>
              <input
                id="sendinfo-deadline"
                type="date"
                name="deadline"
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="sendinfo-helpNeeded">{t("sendInfoFieldHelp")}</label>
              <textarea
                id="sendinfo-helpNeeded"
                name="helpNeeded"
                onChange={handleInputChange}
                className={styles.textarea}
                placeholder={t("sendInfoPhHelp")}
                rows={4}
              ></textarea>
            </div>
          </>
        );
      case "meeting":
        return (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="sendinfo-fullName">{t("sendInfoFieldFullName")} *</label>
              <input
                id="sendinfo-fullName"
                type="text"
                name="fullName"
                required
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhFullName")}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="sendinfo-email">{t("sendInfoFieldEmail")} *</label>
              <input
                id="sendinfo-email"
                type="email"
                name="email"
                required
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhEmail")}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="sendinfo-phone">{t("sendInfoFieldPhone")}</label>
              <input
                id="sendinfo-phone"
                type="tel"
                name="phone"
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhPhone")}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="sendinfo-meetingType">{t("sendInfoFieldMeetingType")} *</label>
              <select
                id="sendinfo-meetingType"
                name="meetingType"
                required
                onChange={handleInputChange}
                className={styles.select}
              >
                <option value="">{t("sendInfoMeetingSelect")}</option>
                <option value="consultation">{t("sendInfoMeetingConsult")}</option>
                <option value="application-review">{t("sendInfoMeetingAppReview")}</option>
                <option value="scholarship-advice">{t("sendInfoMeetingScholarship")}</option>
                <option value="career-guidance">{t("sendInfoMeetingCareer")}</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="sendinfo-preferredDate">{t("sendInfoFieldPreferredDate")} *</label>
              <input
                id="sendinfo-preferredDate"
                type="date"
                name="preferredDate"
                required
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="sendinfo-preferredTime">{t("sendInfoFieldPreferredTime")}</label>
              <input
                id="sendinfo-preferredTime"
                type="time"
                name="preferredTime"
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="sendinfo-notes">{t("sendInfoFieldNotes")}</label>
              <textarea
                id="sendinfo-notes"
                name="notes"
                onChange={handleInputChange}
                className={styles.textarea}
                placeholder={t("sendInfoPhNotes")}
                rows={3}
              ></textarea>
            </div>
          </>
        );
      default:
        return (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="sendinfo-fullName">{t("sendInfoFieldFullName")} *</label>
              <input
                id="sendinfo-fullName"
                type="text"
                name="fullName"
                required
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhFullName")}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="sendinfo-email">{t("sendInfoFieldEmail")} *</label>
              <input
                id="sendinfo-email"
                type="email"
                name="email"
                required
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhEmail")}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="sendinfo-phone">{t("sendInfoFieldPhone")}</label>
              <input
                id="sendinfo-phone"
                type="tel"
                name="phone"
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhPhone")}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="sendinfo-subject">{t("sendInfoFieldSubject")} *</label>
              <input
                id="sendinfo-subject"
                type="text"
                name="subject"
                required
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhSubject")}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="sendinfo-message">{t("sendInfoFieldMessage")} *</label>
              <textarea
                id="sendinfo-message"
                name="message"
                required
                onChange={handleInputChange}
                className={styles.textarea}
                placeholder={t("sendInfoPhContact")}
                rows={5}
              ></textarea>
            </div>
          </>
        );
    }
  };

  if (submitSuccess) {
    return (
      <PageTemplate
        icon={<SendIcon size={22} />}
        title={t("sendInfoPageTitle")}
        onBack={handleBack}
      >
        <div className={styles.successContainer}>
          <div className={styles.successIcon}><CheckCircleIcon size={48} /></div>
          <h2>{t("sendInfoSuccessTitle")}</h2>
          <p>
            {t("sendInfoSuccessBody")}
          </p>
          <div className={styles.premiumBanner}>
            <span className={styles.premiumIcon}><StarIcon size={20} /></span>
            <div>
              <h3>{t("sendInfoPremiumActivated")}</h3>
              <p>{t("sendInfoPremiumActivatedBody")}</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className={styles.backToDashboard}
          >
            {t("sendInfoBackToDashboard")}
          </button>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate
      icon={<SendIcon size={22} />}
      title={t("sendInfoPageTitle")}
      onBack={handleBack}
    >
      <div className={styles.content}>
        <div className={styles.premiumOffer}>
          <div className={styles.offerIcon}><StarIcon size={24} /></div>
          <div className={styles.offerContent}>
            <h3>{t("sendInfoOfferHeadline")}</h3>
            <p>
              {t("sendInfoOfferBody")}
            </p>
          </div>
        </div>

        <div className={styles.tabs} role="tablist">
          {tabs.map((tab, i) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              tabIndex={activeTab === tab.id ? 0 : -1}
              className={`${styles.tab} ${
                activeTab === tab.id ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(e) => handleTabKey(e, i)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>{renderForm()}</div>

          <div className={styles.formActions}>
            {submitError && (
              <p className={styles.errorMessage} role="alert">
                {t("sendInfoError")}
              </p>
            )}
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>{t("sendInfoSubmitting")}</>
              ) : (
                <><SendIcon size={16} /> {t("sendInfoSubmit")}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </PageTemplate>
  );
};

export default SendInfoPage;
