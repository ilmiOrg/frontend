import { useState, useEffect, createContext, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

// Create Auth Context
const AuthContext = createContext()

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const auth = useAuthLogic()
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Auth logic hook
const useAuthLogic = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem('isAuthenticated') === 'true'
    setIsAuthenticated(authStatus)
    setIsLoading(false)
  }, [])

  const login = async (email, password) => {
    setIsLoading(true)
    
    try {
      // Mock login - in a real app, this would make an API call
      if (email && password) {
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('userEmail', email)
        setIsAuthenticated(true)
        
        // Redirect to dashboard after successful login
        navigate('/dashboard')
        
        return { success: true }
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userEmail')
    setIsAuthenticated(false)
    navigate('/')
  }

  const register = async (userData) => {
    setIsLoading(true)
    
    try {
      // Mock registration - in a real app, this would make an API call
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('userEmail', userData.email)
      setIsAuthenticated(true)
      
      // Redirect to dashboard after successful registration
      navigate('/dashboard')
      
      return { success: true }
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
    register
  }
}
