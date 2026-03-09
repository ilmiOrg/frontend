import React from 'react'
import styles from './style.module.css'

const Sidebar = ({ children }) => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🎓</span>
          <span className={styles.logoText}>ilmi</span>
        </div>
      </div>
      <div className={styles.sidebarContent}>
        {children}
      </div>
    </div>
  )
}

export default Sidebar


