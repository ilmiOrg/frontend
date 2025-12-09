import React from 'react'
import { useAuth } from '../../../../core/hooks/useAuth'
import NavSection from '../NavSection'
import NavItem from '../NavItem'
import { navigationConfig, secondaryNav } from '../../config/navigationConfig'
import styles from './style.module.css'

const MainNav = () => {
  const { user, logout } = useAuth()
  
  return (
    <nav className={styles.mainNav}>
      {/* User Profile Section */}
      <div className={styles.mainNavHeader}>
        <div className={styles.userProfile}>
          <div className={styles.userProfileAvatar}>
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className={styles.userProfileInfo}>
            <div className={styles.userProfileName}>
              {user?.name || 'Student'}
            </div>
            <div className={styles.userProfileEmail}>
              {user?.email || 'student@example.com'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Navigation Sections */}
      <div className={styles.mainNavContent}>
        {navigationConfig.map((section, index) => (
          <NavSection key={index} section={section} />
        ))}
      </div>
      
      {/* Secondary Navigation */}
      <div className={styles.mainNavFooter}>
        <NavSection section={secondaryNav} />
        
        {/* Logout Button */}
        <div className={styles.logoutSection}>
          <NavItem
            icon="🚪"
            label="Logout"
            onClick={logout}
          />
        </div>
      </div>
    </nav>
  )
}

export default MainNav