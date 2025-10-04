import React, { forwardRef } from 'react'
import styles from './style.module.css'

const Card = forwardRef(function Card({
  children,
  variant = 'default',
  size = 'medium',
  padding = 'medium',
  shadow = 'medium',
  hover = false,
  clickable = false,
  className = '',
  onClick,
  ...props
}, ref) {
  const cardClasses = [
    styles.card,
    styles[variant],
    styles[size],
    styles[`padding-${padding}`],
    styles[`shadow-${shadow}`],
    hover && styles.hover,
    clickable && styles.clickable,
    className
  ].filter(Boolean).join(' ')

  return (
    <div
      ref={ref}
      className={cardClasses}
      onClick={clickable ? onClick : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  )
})

export default Card
