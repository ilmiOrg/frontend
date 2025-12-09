import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './style.module.css'

const SendInfoPage = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('university')
  const [formData, setFormData] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Fix scrollbar - only one scrollbar on the right (the page element)
  useEffect(() => {
    const styleEl = document.createElement('style')
    styleEl.id = 'page-scrollbar-fix'
    styleEl.textContent = `
      html, body, #root {
        overflow: hidden !important;
        height: 100vh !important;
        max-height: 100vh !important;
      }
      html::-webkit-scrollbar,
      body::-webkit-scrollbar,
      #root::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
      }
    `
    document.head.appendChild(styleEl)
    return () => {
      const existing = document.getElementById('page-scrollbar-fix')
      if (existing) existing.remove()
    }
  }, [])

  useEffect(() => {
    // Load EmailJS
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js'
    script.onload = () => {
      if (window.emailjs) {
        window.emailjs.init('I_m3b6E2nY4M58E_k')
      }
    }
    document.head.appendChild(script)
  }, [])

  const handleBack = () => {
    navigate('/dashboard')
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (window.emailjs) {
        await window.emailjs.send(
          'service_quad',
          'template_info',
          {
            form_type: activeTab,
            ...formData,
            to_email: 'info@quad.edu'
          }
        )
      }
      setSubmitSuccess(true)
      setFormData({})
    } catch (error) {
      console.error('Error sending email:', error)
      setSubmitSuccess(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const tabs = [
    { id: 'university', label: '🎓 University Info', icon: '🎓' },
    { id: 'scholarship', label: '💰 Scholarship Info', icon: '💰' },
    { id: 'application', label: '📄 Application Help', icon: '📄' },
    { id: 'meeting', label: '📅 Book Meeting', icon: '📅' },
    { id: 'other', label: '💬 Other Request', icon: '💬' }
  ]

  const renderForm = () => {
    switch (activeTab) {
      case 'university':
        return (
          <>
            <div className={styles.formGroup}>
              <label>Full Name *</label>
              <input type="text" name="fullName" required onChange={handleInputChange} className={styles.input} placeholder="Enter your full name" />
            </div>
            <div className={styles.formGroup}>
              <label>Email *</label>
              <input type="email" name="email" required onChange={handleInputChange} className={styles.input} placeholder="Enter your email" />
            </div>
            <div className={styles.formGroup}>
              <label>Phone</label>
              <input type="tel" name="phone" onChange={handleInputChange} className={styles.input} placeholder="Enter your phone number" />
            </div>
            <div className={styles.formGroup}>
              <label>University of Interest *</label>
              <input type="text" name="university" required onChange={handleInputChange} className={styles.input} placeholder="Which university are you interested in?" />
            </div>
            <div className={styles.formGroup}>
              <label>Program/Major</label>
              <input type="text" name="program" onChange={handleInputChange} className={styles.input} placeholder="What program are you interested in?" />
            </div>
            <div className={styles.formGroup}>
              <label>Your GPA</label>
              <input type="text" name="gpa" onChange={handleInputChange} className={styles.input} placeholder="Enter your GPA" />
            </div>
            <div className={styles.formGroup}>
              <label>Additional Information</label>
              <textarea name="message" onChange={handleInputChange} className={styles.textarea} placeholder="Tell us more about your goals..." rows={4}></textarea>
            </div>
          </>
        )
      case 'scholarship':
        return (
          <>
            <div className={styles.formGroup}>
              <label>Full Name *</label>
              <input type="text" name="fullName" required onChange={handleInputChange} className={styles.input} placeholder="Enter your full name" />
            </div>
            <div className={styles.formGroup}>
              <label>Email *</label>
              <input type="email" name="email" required onChange={handleInputChange} className={styles.input} placeholder="Enter your email" />
            </div>
            <div className={styles.formGroup}>
              <label>Phone</label>
              <input type="tel" name="phone" onChange={handleInputChange} className={styles.input} placeholder="Enter your phone number" />
            </div>
            <div className={styles.formGroup}>
              <label>Scholarship Name *</label>
              <input type="text" name="scholarshipName" required onChange={handleInputChange} className={styles.input} placeholder="Which scholarship are you interested in?" />
            </div>
            <div className={styles.formGroup}>
              <label>University</label>
              <input type="text" name="university" onChange={handleInputChange} className={styles.input} placeholder="Associated university (if any)" />
            </div>
            <div className={styles.formGroup}>
              <label>Your Academic Achievements</label>
              <textarea name="achievements" onChange={handleInputChange} className={styles.textarea} placeholder="Describe your achievements..." rows={4}></textarea>
            </div>
          </>
        )
      case 'application':
        return (
          <>
            <div className={styles.formGroup}>
              <label>Full Name *</label>
              <input type="text" name="fullName" required onChange={handleInputChange} className={styles.input} placeholder="Enter your full name" />
            </div>
            <div className={styles.formGroup}>
              <label>Email *</label>
              <input type="email" name="email" required onChange={handleInputChange} className={styles.input} placeholder="Enter your email" />
            </div>
            <div className={styles.formGroup}>
              <label>Phone</label>
              <input type="tel" name="phone" onChange={handleInputChange} className={styles.input} placeholder="Enter your phone number" />
            </div>
            <div className={styles.formGroup}>
              <label>University *</label>
              <input type="text" name="university" required onChange={handleInputChange} className={styles.input} placeholder="Which university?" />
            </div>
            <div className={styles.formGroup}>
              <label>Program *</label>
              <input type="text" name="program" required onChange={handleInputChange} className={styles.input} placeholder="Which program?" />
            </div>
            <div className={styles.formGroup}>
              <label>Application Deadline</label>
              <input type="date" name="deadline" onChange={handleInputChange} className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label>What help do you need?</label>
              <textarea name="helpNeeded" onChange={handleInputChange} className={styles.textarea} placeholder="Describe what assistance you need..." rows={4}></textarea>
            </div>
          </>
        )
      case 'meeting':
        return (
          <>
            <div className={styles.formGroup}>
              <label>Full Name *</label>
              <input type="text" name="fullName" required onChange={handleInputChange} className={styles.input} placeholder="Enter your full name" />
            </div>
            <div className={styles.formGroup}>
              <label>Email *</label>
              <input type="email" name="email" required onChange={handleInputChange} className={styles.input} placeholder="Enter your email" />
            </div>
            <div className={styles.formGroup}>
              <label>Phone</label>
              <input type="tel" name="phone" onChange={handleInputChange} className={styles.input} placeholder="Enter your phone number" />
            </div>
            <div className={styles.formGroup}>
              <label>Meeting Type *</label>
              <select name="meetingType" required onChange={handleInputChange} className={styles.select}>
                <option value="">Select meeting type</option>
                <option value="consultation">General Consultation</option>
                <option value="application-review">Application Review</option>
                <option value="scholarship-advice">Scholarship Advice</option>
                <option value="career-guidance">Career Guidance</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Preferred Date *</label>
              <input type="date" name="preferredDate" required onChange={handleInputChange} className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label>Preferred Time</label>
              <input type="time" name="preferredTime" onChange={handleInputChange} className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label>Additional Notes</label>
              <textarea name="notes" onChange={handleInputChange} className={styles.textarea} placeholder="Any additional information..." rows={3}></textarea>
            </div>
          </>
        )
      default:
        return (
          <>
            <div className={styles.formGroup}>
              <label>Full Name *</label>
              <input type="text" name="fullName" required onChange={handleInputChange} className={styles.input} placeholder="Enter your full name" />
            </div>
            <div className={styles.formGroup}>
              <label>Email *</label>
              <input type="email" name="email" required onChange={handleInputChange} className={styles.input} placeholder="Enter your email" />
            </div>
            <div className={styles.formGroup}>
              <label>Phone</label>
              <input type="tel" name="phone" onChange={handleInputChange} className={styles.input} placeholder="Enter your phone number" />
            </div>
            <div className={styles.formGroup}>
              <label>Subject *</label>
              <input type="text" name="subject" required onChange={handleInputChange} className={styles.input} placeholder="What is your request about?" />
            </div>
            <div className={styles.formGroup}>
              <label>Message *</label>
              <textarea name="message" required onChange={handleInputChange} className={styles.textarea} placeholder="Tell us how we can help..." rows={5}></textarea>
            </div>
          </>
        )
    }
  }

  if (submitSuccess) {
    return (
      <div className={styles.page}>
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>✅</div>
          <h2>Information Sent Successfully!</h2>
          <p>Thank you for reaching out. Our team will review your information and contact you soon.</p>
          <div className={styles.premiumBanner}>
            <span className={styles.premiumIcon}>⭐</span>
            <div>
              <h3>Premium Access Activated!</h3>
              <p>You now have access to premium features for 7 days.</p>
            </div>
          </div>
          <button onClick={() => navigate('/dashboard')} className={styles.backToDashboard}>
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button onClick={handleBack} className={styles.backButton} title="Back to Dashboard">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <div className={styles.headerContent}>
            <span className={styles.icon}>📤</span>
            <div>
              <h1 className={styles.title}>Send Info & Get Premium</h1>
              <p className={styles.description}>Share your information and unlock premium features</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.premiumOffer}>
          <div className={styles.offerIcon}>⭐</div>
          <div className={styles.offerContent}>
            <h3>Get 7 Days Premium FREE!</h3>
            <p>Send us your university or scholarship inquiry and receive 7 days of premium access instantly.</p>
          </div>
        </div>

        <div className={styles.tabs}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            {renderForm()}
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? (
                <>⏳ Sending...</>
              ) : (
                <>📤 Send Information & Get Premium</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SendInfoPage


