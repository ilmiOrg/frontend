import React, { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Button from '../Button'
import styles from './style.module.css'

const Modal = ({ 
  isOpen, 
  onClose, 
  title = '',
  children,
  size = 'medium',
  variant = 'default',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = '',
  ...props 
}) => {
  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape' && closeOnEscape) {
      onClose()
    }
  }, [onClose, closeOnEscape])

  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose()
    }
  }, [onClose, closeOnOverlayClick])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleEscape])

  if (!isOpen) return null

  const modalClasses = [
    styles.modal,
    styles[size],
    styles[variant],
    className
  ].filter(Boolean).join(' ')

  return createPortal(
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={modalClasses} onClick={(e) => e.stopPropagation()} {...props}>
        {title && (
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            {showCloseButton && (
              <button 
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Close modal"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
        )}
        
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default Modal
