import React from 'react'
import styles from './style.module.css'

const MainNav = ({ currentPath = '/dashboard' }) => {
  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      path: '/dashboard',
      active: currentPath === '/dashboard'
    },
    {
      id: 'universities',
      label: 'Universities',
      icon: '🏫',
      path: '/universities',
      active: currentPath === '/universities'
    },
    {
      id: 'scholarships',
      label: 'Scholarships',
      icon: '💰',
      path: '/scholarships',
      active: currentPath === '/scholarships'
    },
    {
      id: 'applications',
      label: 'Applications',
      icon: '📝',
      path: '/applications',
      active: currentPath === '/applications'
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: '📄',
      path: '/documents',
      active: currentPath === '/documents'
    },
    {
      id: 'ai-matching',
      label: 'AI Matching',
      icon: '🤖',
      path: '/ai-matching',
      active: currentPath === '/ai-matching'
    },
    {
      id: 'social',
      label: 'Community',
      icon: '👥',
      path: '/social',
      active: currentPath === '/social'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: '🔔',
      path: '/notifications',
      active: currentPath === '/notifications'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: '👤',
      path: '/profile',
      active: currentPath === '/profile'
    }
  ]

  return (
    <nav className={styles.mainNav}>
      <ul className={styles.navList}>
        {navigationItems.map((item) => (
          <li key={item.id} className={styles.navItem}>
            <a
              href={item.path}
              className={`${styles.navLink} ${item.active ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default MainNav


