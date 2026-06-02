import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageTemplate from "../../../shared/PageTemplate";
import { GraduationCapIcon, DollarIcon, FileEditIcon, CalendarIcon, MessageCircleIcon, StarIcon, SendIcon, CheckCircleIcon } from "../../../shared/Icons";
import { useTranslation } from "../../../../hooks/useLanguage";
import styles from "./style.module.css";

const SendInfoPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("university");
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    // Load EmailJS
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js";
    script.onload = () => {
      if (window.emailjs) {
        window.emailjs.init("I_m3b6E2nY4M58E_k");
      }
    };
    document.head.appendChild(script);
  }, []);

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
    setIsSubmitting(true);

    try {
      if (window.emailjs) {
        await window.emailjs.send("service_quad", "template_info", {
          form_type: activeTab,
          ...formData,
          to_email: "info@quad.edu",
        });
      }
      setSubmitSuccess(true);
      setFormData({});
    } catch (error) {
      console.error("Error sending email:", error);
      setSubmitSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
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
              <label>{t("sendInfoFieldFullName")} *</label>
              <input
                type="text"
                name="fullName"
                required
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhFullName")}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t("sendInfoFieldEmail")} *</label>
              <input
                type="email"
                name="email"
                required
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhEmail")}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t("sendInfoFieldPhone")}</label>
              <input
                type="tel"
                name="phone"
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhPhone")}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t("sendInfoFieldUniversityInterest")} *</label>
              <input
                type="text"
                name="university"
                required
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhUniversityInterest")}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t("sendInfoFieldProgramMajor")}</label>
              <input
                type="text"
                name="program"
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhProgramInterest")}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t("sendInfoFieldGpa")}</label>
              <input
                type="text"
                name="gpa"
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhGpa")}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t("sendInfoFieldAdditional")}</label>
              <textarea
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
              <label>{t("sendInfoFieldFullName")} *</label>
              <input
                type="text"
                name="fullName"
                required
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhFullName")}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t("sendInfoFieldEmail")} *</label>
              <input
                type="email"
                name="email"
                required
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhEmail")}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t("sendInfoFieldPhone")}</label>
              <input
                type="tel"
                name="phone"
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhPhone")}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t("sendInfoFieldScholarshipName")} *</label>
              <input
                type="text"
                name="scholarshipName"
                required
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhScholarship")}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t("sendInfoFieldUniversity")}</label>
              <input
                type="text"
                name="university"
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhUniversityOpt")}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t("sendInfoFieldAchievements")}</label>
              <textarea
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
              <label>{t("sendInfoFieldFullName")} *</label>
              <input
                type="text"
                name="fullName"
                required
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhFullName")}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t("sendInfoFieldEmail")} *</label>
              <input
                type="email"
                name="email"
                required
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhEmail")}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t("sendInfoFieldPhone")}</label>
              <input
                type="tel"
                name="phone"
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhPhone")}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t("sendInfoFieldUniversity")} *</label>
              <input
                type="text"
                name="university"
                required
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhUniversityRequired")}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t("sendInfoFieldProgram")} *</label>
              <input
                type="text"
                name="program"
                required
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhProgramRequired")}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t("sendInfoFieldDeadline")}</label>
              <input
                type="date"
                name="deadline"
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t("sendInfoFieldHelp")}</label>
              <textarea
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
              <label>{t("sendInfoFieldFullName")} *</label>
              <input
                type="text"
                name="fullName"
                required
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhFullName")}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t("sendInfoFieldEmail")} *</label>
              <input
                type="email"
                name="email"
                required
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhEmail")}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t("sendInfoFieldPhone")}</label>
              <input
                type="tel"
                name="phone"
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhPhone")}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t("sendInfoFieldMeetingType")} *</label>
              <select
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
              <label>{t("sendInfoFieldPreferredDate")} *</label>
              <input
                type="date"
                name="preferredDate"
                required
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t("sendInfoFieldPreferredTime")}</label>
              <input
                type="time"
                name="preferredTime"
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t("sendInfoFieldNotes")}</label>
              <textarea
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
              <label>{t("sendInfoFieldFullName")} *</label>
              <input
                type="text"
                name="fullName"
                required
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhFullName")}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t("sendInfoFieldEmail")} *</label>
              <input
                type="email"
                name="email"
                required
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhEmail")}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t("sendInfoFieldPhone")}</label>
              <input
                type="tel"
                name="phone"
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhPhone")}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t("sendInfoFieldSubject")} *</label>
              <input
                type="text"
                name="subject"
                required
                onChange={handleInputChange}
                className={styles.input}
                placeholder={t("sendInfoPhSubject")}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t("sendInfoFieldMessage")} *</label>
              <textarea
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

        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${
                activeTab === tab.id ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>{renderForm()}</div>

          <div className={styles.formActions}>
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
