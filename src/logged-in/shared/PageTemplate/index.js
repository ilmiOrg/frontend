import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './style.module.css'

const PageTemplate = ({ icon, title, description, actions, children }) => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/dashboard')
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
            {icon && <span className={styles.icon}>{icon}</span>}
            <div>
              <h1 className={styles.title}>{title}</h1>
              {description && <p className={styles.description}>{description}</p>}
            </div>
          </div>
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  )
}

export default PageTemplate
