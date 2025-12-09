import React from 'react'
import styles from './style.module.css'

const ActivityPanel = ({ children }) => {
  return (
    <div className={styles.activityPanel}>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>Activity</h2>
      </div>
      <div className={styles.panelContent}>
        {children}
      </div>
    </div>
  )
}

export default ActivityPanel


