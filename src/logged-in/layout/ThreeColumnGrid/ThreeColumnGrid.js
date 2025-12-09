import React from 'react'
import styles from './style.module.css'

const ThreeColumnGrid = ({ 
  leftColumn, 
  middleColumn, 
  rightColumn,
  className = '',
  ...props 
}) => {
  const gridClasses = [
    styles.threeColumnGrid,
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={gridClasses} {...props}>
      <div className={styles.leftColumn}>
        {leftColumn}
      </div>
      <div className={styles.middleColumn}>
        {middleColumn}
      </div>
      <div className={styles.rightColumn}>
        {rightColumn}
      </div>
    </div>
  )
}

export default ThreeColumnGrid

import styles from './style.module.css'

const ThreeColumnGrid = ({ 
  leftColumn, 
  middleColumn, 
  rightColumn,
  className = '',
  ...props 
}) => {
  const gridClasses = [
    styles.threeColumnGrid,
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={gridClasses} {...props}>
      <div className={styles.leftColumn}>
        {leftColumn}
      </div>
      <div className={styles.middleColumn}>
        {middleColumn}
      </div>
      <div className={styles.rightColumn}>
        {rightColumn}
      </div>
    </div>
  )
}

export default ThreeColumnGrid


