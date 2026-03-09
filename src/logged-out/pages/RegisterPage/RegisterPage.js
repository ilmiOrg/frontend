import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { getCountries } from '../../../api/countries'
import styles from '../LoginPage/style.module.css'

const RegisterPage = () => {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [countryId, setCountryId] = useState('')
  const [countries, setCountries] = useState([])
  const [countriesLoading, setCountriesLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { register, loginAsGuest } = useAuth()

  useEffect(() => {
    getCountries()
      .then(setCountries)
      .catch(() => setCountries([]))
      .finally(() => setCountriesLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!countryId || !countryId.trim()) {
      setError('Please select a country.')
      return
    }
    const payload = {
      email: email.trim(),
      password: password,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      countryId: countryId.trim(),
    }
    if (!payload.email || !payload.firstName || !payload.lastName || !payload.password) {
      setError('Please fill in all fields.')
      return
    }
    setIsLoading(true)
    try {
      await register(payload)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Registration failed.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleContinueAsGuest = () => {
    loginAsGuest()
    navigate('/dashboard')
  }

  return (
    <div className={styles['login-page'] || styles.loginPage}>
      <div className={styles['liquid-shape'] || styles.liquidShape} />
      <div className={styles['liquid-shape'] || styles.liquidShape} />
      <div className={styles['liquid-shape'] || styles.liquidShape} />

      <div className={styles['login-container'] || styles.loginContainer}>
        <div className={`${styles['login-card'] || styles.loginCard} ${styles.authCardWide || ''}`}>
          <div className={styles['login-header'] || styles.loginHeader}>
            <h1 className={styles.logo}>ilmi</h1>
            <p className={styles.subtitle}>Create your account — choose your country to join.</p>
          </div>

          {error && (
            <div className={styles.errorMessage} role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles['login-form'] || styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="firstName" className={styles.formLabel}>First name</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={styles.formInput}
                placeholder="First name"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="lastName" className={styles.formLabel}>Last name</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={styles.formInput}
                placeholder="Last name"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.formInput}
                placeholder="you@example.com"
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
                placeholder="Password"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="country" className={styles.formLabel}>Country</label>
              <select
                id="country"
                value={countryId}
                onChange={(e) => setCountryId(e.target.value)}
                className={styles.selectInput || styles.formInput}
                required
                disabled={countriesLoading}
                aria-describedby={!countriesLoading && countries.length === 0 ? 'country-hint' : undefined}
              >
                <option value="">{countriesLoading ? 'Loading countries...' : 'Select your country'}</option>
                {countries.map((c) => (
                  <option key={c.countryId} value={c.countryId}>
                    {c.countryName} ({c.countryCode})
                  </option>
                ))}
              </select>
              {!countriesLoading && countries.length > 0 && (
                <span className={styles.formHint} id="country-hint">
                  Required to create your account.
                </span>
              )}
              {!countriesLoading && countries.length === 0 && (
                <span className={styles.formHint} id="country-hint">
                  No countries loaded. Start the backend and ensure the database has countries, or use &quot;Continue as guest&quot; below.
                </span>
              )}
            </div>

            <button
              type="submit"
              className={styles.loginButton}
              disabled={isLoading || countries.length === 0}
            >
              {isLoading ? 'Creating account...' : 'Create account & join'}
            </button>
          </form>

          <div className={styles['login-footer'] || styles.loginFooter}>
            <p>
              Already have an account?{' '}
              <button type="button" onClick={() => navigate('/login')} className={styles.linkButton}>
                Log in
              </button>
            </p>
            <p style={{ marginTop: '0.75rem' }}>
              <button type="button" onClick={handleContinueAsGuest} className={styles.linkButton}>
                Continue as guest
              </button>
              {' '}— try the app without signing up.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
