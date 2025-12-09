import React from 'react'
import styles from './style.module.css'

const Spinner = ({ size = 'md', variant = 'primary', className = '' }) => {
  const spinnerClasses = [
    styles.spinner,
    styles[size],
    styles[variant],
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={spinnerClasses}>
      <div className={styles.spinnerInner}></div>
    </div>
  )
}

export default Spinner