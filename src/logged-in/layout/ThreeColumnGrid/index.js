import React from 'react'
import styles from './style.module.css'

const ThreeColumnGrid = ({ 
  leftContent, 
  middleContent, 
  rightContent,
  className = '' 
}) => {
  return (
    <div className={`${styles.threeColumnGrid} ${className}`}>
      {/* Left Column - Navigation */}
      <aside className={styles.leftColumn}>
        {leftContent}
      </aside>

      {/* Middle Column - Main Content */}
      <main className={styles.middleColumn}>
        {middleContent}
      </main>

      {/* Right Column - Activity Panel */}
      <aside className={styles.rightColumn}>
        {rightContent}
      </aside>
    </div>
  )
}

export default ThreeColumnGrid