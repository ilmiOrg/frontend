import React from 'react'
import styles from './style.module.css'

const Input = ({ 
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  disabled = false,
  required = false,
  fullWidth = false,
  icon = null,
  className = '',
  ...props
}) => {
  const inputClass = `
    ${styles.input} 
    ${error ? styles.inputError : ''}
    ${disabled ? styles.inputDisabled : ''}
    ${fullWidth ? styles.inputFullWidth : ''}
    ${icon ? styles.inputWithIcon : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  return (
    <div className={styles.inputWrapper}>
      {label && (
        <label className={styles.inputLabel}>
          {label}
          {required && <span className={styles.inputRequired}>*</span>}
        </label>
      )}
      <div className={styles.inputContainer}>
        {icon && <span className={styles.inputIcon}>{icon}</span>}
        <input
          type={type}
          className={inputClass}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          disabled={disabled}
          required={required}
          {...props}
        />
      </div>
      {error && <span className={styles.inputErrorMessage}>{error}</span>}
    </div>
  )
}

export default Input

