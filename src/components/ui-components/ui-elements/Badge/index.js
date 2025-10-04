import React from 'react'
import styles from './style.module.css'

const Badge = ({
  children,
  variant = 'default',
  size = 'medium',
  shape = 'rounded',
  className = '',
  ...props
}) => {
  const badgeClasses = [
    styles.badge,
    styles[variant],
    styles[size],
    styles[shape],
    className
  ].filter(Boolean).join(' ')

  return (
    <span className={badgeClasses} {...props}>
      {children}
    </span>
  )
}

export default Badge
