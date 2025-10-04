import React, { forwardRef, useState, useCallback } from 'react'
import styles from './style.module.css'

const Input = forwardRef(function Input({
  type = 'text',
  placeholder = '',
  value = '',
  onChange,
  onFocus,
  onBlur,
  disabled = false,
  error = false,
  success = false,
  warning = false,
  size = 'medium',
  variant = 'default',
  label = '',
  helperText = '',
  errorText = '',
  required = false,
  className = '',
  icon = null,
  iconPosition = 'left',
  clearable = false,
  ...props
}, ref) {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleFocus = useCallback((e) => {
    setIsFocused(true)
    onFocus?.(e)
  }, [onFocus])

  const handleBlur = useCallback((e) => {
    setIsFocused(false)
    onBlur?.(e)
  }, [onBlur])

  const handleClear = useCallback(() => {
    onChange?.({ target: { value: '' } })
  }, [onChange])

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev)
  }, [])

  const inputClasses = [
    styles.input,
    styles[size],
    styles[variant],
    error && styles.error,
    success && styles.success,
    warning && styles.warning,
    disabled && styles.disabled,
    isFocused && styles.focused,
    icon && styles[`icon-${iconPosition}`],
    className
  ].filter(Boolean).join(' ')

  const containerClasses = [
    styles.container,
    error && styles.containerError,
    success && styles.containerSuccess,
    warning && styles.containerWarning,
    disabled && styles.containerDisabled
  ].filter(Boolean).join(' ')

  const inputType = type === 'password' && showPassword ? 'text' : type

  return (
    <div className={containerClasses}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      
      <div className={styles.inputWrapper}>
        {icon && iconPosition === 'left' && (
          <span className={styles.iconLeft}>{icon}</span>
        )}
        
        <input
          ref={ref}
          type={inputType}
          className={inputClasses}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          {...props}
        />
        
        {type === 'password' && (
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={togglePasswordVisibility}
            tabIndex={-1}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        )}
        
        {clearable && value && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClear}
            tabIndex={-1}
          >
            ×
          </button>
        )}
        
        {icon && iconPosition === 'right' && (
          <span className={styles.iconRight}>{icon}</span>
        )}
      </div>
      
      {(helperText || errorText) && (
        <div className={styles.helperText}>
          {error && errorText ? errorText : helperText}
        </div>
      )}
    </div>
  )
})

export default Input
