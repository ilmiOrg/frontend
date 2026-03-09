import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { login as apiLogin, register as apiRegister } from '../api/auth'

const AUTH_TOKEN_KEY = 'token'
const AUTH_EMAIL_KEY = 'userEmail'
const AUTH_GUEST_KEY = 'authGuest'

/** Guest user shown in UI when using "Continue as guest" (no backend login). */
export const GUEST_USER = { email: 'guest@ilmi.demo', name: 'Guest', isGuest: true }

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    const email = localStorage.getItem(AUTH_EMAIL_KEY)
    const isGuest = localStorage.getItem(AUTH_GUEST_KEY) === 'true'
    if (isGuest) {
      setIsAuthenticated(true)
      setUser({ ...GUEST_USER })
    } else if (token && email) {
      setIsAuthenticated(true)
      setUser({ email, name: email.split('@')[0], isGuest: false })
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    localStorage.removeItem(AUTH_GUEST_KEY)
    const data = await apiLogin(email, password)
    localStorage.setItem(AUTH_TOKEN_KEY, data.token)
    localStorage.setItem(AUTH_EMAIL_KEY, data.email)
    setIsAuthenticated(true)
    setUser({ email: data.email, name: data.email?.split('@')[0], isGuest: false })
    return { success: true }
  }, [])

  /** Bypass login: enter app as guest (no backend). Use "Get started" or "Continue as guest". */
  const loginAsGuest = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_EMAIL_KEY)
    localStorage.setItem(AUTH_GUEST_KEY, 'true')
    setIsAuthenticated(true)
    setUser({ ...GUEST_USER })
    return { success: true }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_EMAIL_KEY)
    localStorage.removeItem(AUTH_GUEST_KEY)
    setIsAuthenticated(false)
    setUser(null)
  }, [])

  const register = useCallback(async (userData) => {
    localStorage.removeItem(AUTH_GUEST_KEY)
    const data = await apiRegister(userData)
    localStorage.setItem(AUTH_TOKEN_KEY, data.token)
    localStorage.setItem(AUTH_EMAIL_KEY, data.email)
    setIsAuthenticated(true)
    setUser({ email: data.email, name: data.email?.split('@')[0], isGuest: false })
    return { success: true }
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, loginAsGuest, logout, register, user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
