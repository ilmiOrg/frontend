import React from 'react'
import styles from './style.module.css'

const Spinner = ({
  size = 'medium',
  variant = 'primary',
  className = '',
  ...props
}) => {
  const spinnerClasses = [
    styles.spinner,
    styles[size],
    styles[variant],
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={spinnerClasses} {...props}>
      <div className={styles.spinnerInner}></div>
    </div>
  )
}

export default Spinner
