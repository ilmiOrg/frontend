import React from 'react'
import styles from './style.module.css'

const UserCard = ({ user = {} }) => {
  const defaultUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '👤',
    verified: true,
    stats: {
      applications: 5,
      matches: 12,
      scholarships: 3
    }
  }

  const userData = { ...defaultUser, ...user }

  return (
    <div className={styles.userCard}>
      <div className={styles.userAvatar}>
        {userData.avatar}
      </div>
      <div className={styles.userInfo}>
        <div className={styles.userName}>
          {userData.name}
          {userData.verified && (
            <span className={styles.verifiedBadge}>✓</span>
          )}
        </div>
        <div className={styles.userEmail}>{userData.email}</div>
      </div>
      <div className={styles.userStats}>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>{userData.stats.applications}</div>
          <div className={styles.statLabel}>Applications</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>{userData.stats.matches}</div>
          <div className={styles.statLabel}>Matches</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>{userData.stats.scholarships}</div>
          <div className={styles.statLabel}>Scholarships</div>
        </div>
      </div>
    </div>
  )
}

export default UserCard


