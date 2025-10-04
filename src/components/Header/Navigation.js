import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from '../../hooks/useLanguage'
import styles from './style.module.css'

function Navigation() {
  const location = useLocation()
  const { t } = useTranslation()

  return (
    <nav className={styles.nav}>
      <Link 
        to="/" 
        className={`${styles.navLink} ${location.pathname === '/' ? styles.active : ''}`}
      >
        {t('home')}
      </Link>
      <Link 
        to="/search" 
        className={`${styles.navLink} ${location.pathname === '/search' ? styles.active : ''}`}
      >
        {t('search')}
      </Link>
      <Link 
        to="/dashboard" 
        className={`${styles.navLink} ${location.pathname === '/dashboard' ? styles.active : ''}`}
      >
        {t('dashboard')}
      </Link>
      <Link 
        to="/scholarships" 
        className={`${styles.navLink} ${location.pathname === '/scholarships' ? styles.active : ''}`}
      >
        {t('scholarships')}
      </Link>
    </nav>
  )
}

export default Navigation