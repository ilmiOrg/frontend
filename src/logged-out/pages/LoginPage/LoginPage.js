import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import styles from './style.module.css'

const LoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, loginAsGuest } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed. Check your email and password.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles['login-page'] || styles.loginPage}>
      <div className={styles['liquid-shape'] || styles.liquidShape}></div>
      <div className={styles['liquid-shape'] || styles.liquidShape}></div>
      <div className={styles['liquid-shape'] || styles.liquidShape}></div>

      <div className={styles['login-container'] || styles.loginContainer}>
        <div className={styles['login-card'] || styles.loginCard}>
          <div className={styles['login-header'] || styles.loginHeader}>
            <h1 className={styles.logo}>ilmi</h1>
            <p className={styles.subtitle}>Welcome back! Please sign in to your account.</p>
          </div>

          {error && (
            <div className={styles.errorMessage} role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles['login-form'] || styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.formInput}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.formLabel}>Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.formInput}
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className={styles.loginButton}
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className={styles['login-footer'] || styles.loginFooter}>
            <p>Don&apos;t have an account? <a href="/register" onClick={(e) => { e.preventDefault(); navigate('/register'); }} className={styles.link}>Sign up here</a></p>
            <p style={{ marginTop: '0.75rem' }}>
              <button type="button" onClick={() => { loginAsGuest(); navigate('/dashboard'); }} className={styles.linkButton}>
                Continue as guest
              </button>
              {' '}— bypass login and try the app.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
