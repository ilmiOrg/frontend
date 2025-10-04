import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiHome, FiSearch, FiUser, FiBookmark, FiPlus } from 'react-icons/fi'
import { useTranslation } from '../../hooks/useLanguage'
import styles from './style.module.css'

function BottomNav() {
  const location = useLocation()
  const { t } = useTranslation()

  const navItems = [
    { path: '/', icon: FiHome, label: t('home') },
    { path: '/search', icon: FiSearch, label: t('search') },
    { path: '/dashboard', icon: FiUser, label: t('profile') },
    { path: '/scholarships', icon: FiBookmark, label: t('scholarships') }
  ]

  return (
    <nav className={styles.bottomNav}>
      <div className={styles.container}>
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`${styles.navItem} ${location.pathname === path ? styles.active : ''}`}
          >
            <Icon className={styles.icon} />
            <span className={styles.label}>{label}</span>
          </Link>
        ))}
        
        {/* Floating Action Button */}
        <div className={styles.fab}>
          <FiPlus className={styles.fabIcon} />
        </div>
      </div>
    </nav>
  )
}

export default BottomNav
