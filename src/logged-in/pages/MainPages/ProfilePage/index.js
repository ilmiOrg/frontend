import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../contexts/AuthContext'
import styles from './style.module.css'

const ProfilePage = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()

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

  const handleBack = () => {
    navigate('/dashboard')
  }

  const handleLogout = () => {
    logout()
    navigate('/')
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
            <span className={styles.icon}>👤</span>
            <div>
              <h1 className={styles.title}>My Profile</h1>
              <p className={styles.description}>Manage your account settings</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.profileCard}>
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face" alt="Profile" />
            </div>
            <button className={styles.changeAvatarBtn}>Change Photo</button>
          </div>
          
          <div className={styles.infoSection}>
            <div className={styles.infoGroup}>
              <label>Full Name</label>
              <input type="text" defaultValue="Alex Johnson" className={styles.input} />
            </div>
            <div className={styles.infoGroup}>
              <label>Email</label>
              <input type="email" defaultValue="alex.johnson@email.com" className={styles.input} />
            </div>
            <div className={styles.infoGroup}>
              <label>Phone</label>
              <input type="tel" defaultValue="+1 234 567 8900" className={styles.input} />
            </div>
            <div className={styles.infoGroup}>
              <label>Location</label>
              <input type="text" defaultValue="Bishkek, Kyrgyzstan" className={styles.input} />
            </div>
          </div>
        </div>

        <div className={styles.statsCard}>
          <h3>Account Statistics</h3>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>15</span>
              <span className={styles.statLabel}>Applications</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>8</span>
              <span className={styles.statLabel}>Scholarships</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>247</span>
              <span className={styles.statLabel}>Profile Views</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>92%</span>
              <span className={styles.statLabel}>Match Score</span>
            </div>
          </div>
        </div>

        <div className={styles.premiumCard}>
          <div className={styles.premiumBadge}>⭐ Premium</div>
          <h3>Premium Member</h3>
          <p>You have access to all premium features</p>
          <ul className={styles.premiumFeatures}>
            <li>✓ Unlimited university matches</li>
            <li>✓ Priority application support</li>
            <li>✓ Exclusive scholarship alerts</li>
            <li>✓ Direct mentor access</li>
          </ul>
        </div>

        <div className={styles.actionsCard}>
          <button className={styles.saveBtn}>Save Changes</button>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage


