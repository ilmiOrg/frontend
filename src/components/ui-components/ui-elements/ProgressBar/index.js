import React from 'react'
import styles from './style.module.css'

const ProgressBar = ({
  value = 0,
  max = 100,
  size = 'medium',
  variant = 'primary',
  showLabel = false,
  label = '',
  animated = false,
  striped = false,
  className = '',
  ...props
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  const progressClasses = [
    styles.progressBar,
    styles[size],
    className
  ].filter(Boolean).join(' ')

  const fillClasses = [
    styles.progressFill,
    styles[variant],
    animated && styles.animated,
    striped && styles.striped
  ].filter(Boolean).join(' ')

  return (
    <div className={progressClasses} {...props}>
      {showLabel && (
        <div className={styles.label}>
          {label || `${Math.round(percentage)}%`}
        </div>
      )}
      <div className={styles.track}>
        <div 
          className={fillClasses}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label || `Progress: ${Math.round(percentage)}%`}
        />
      </div>
    </div>
  )
}

export default ProgressBar
