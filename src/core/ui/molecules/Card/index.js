import React from 'react'
import styles from './style.module.css'

const Card = ({ 
  children, 
  variant = 'default',
  padding = 'md',
  className = '',
  onClick,
  ...props 
}) => {
  const cardClasses = [
    styles.card,
    styles[variant],
    styles[`padding-${padding}`],
    onClick ? styles.clickable : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <div
      className={cardClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card


