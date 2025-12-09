import React from 'react'
import ThreeColumnGrid from '../ThreeColumnGrid'
import styles from './style.module.css'

const AppLayout = ({ 
  leftContent, 
  middleContent, 
  rightContent,
  className = '' 
}) => {
  return (
    <div className={`${styles.appLayout} ${className}`}>
      <ThreeColumnGrid
        leftContent={leftContent}
        middleContent={middleContent}
        rightContent={rightContent}
      />
    </div>
  )
}

export default AppLayout


