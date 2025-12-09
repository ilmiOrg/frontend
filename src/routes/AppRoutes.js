import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// Logged-out components
import PublicHomePage from '../logged-out/pages/PublicHomePage'
import LoginPage from '../logged-out/pages/LoginPage'

// Logged-in components
import DashboardPage from '../logged-in/pages/MainPages/DashboardPage'

// Mock authentication hook
const useAuth = () => {
  // In a real app, this would check actual authentication state
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  
  const login = (credentials) => {
    // Mock login - in real app, this would make API call
    localStorage.setItem('isAuthenticated', 'true')
    return Promise.resolve({ success: true })
  }
  
  const logout = () => {
    localStorage.removeItem('isAuthenticated')
  }
  
  return { isAuthenticated, login, logout }
}

// Private Route Component
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" />
}

// Public Route Component (redirect to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  return !isAuthenticated ? children : <Navigate to="/dashboard" />
}

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={
            <PublicRoute>
              <PublicHomePage />
            </PublicRoute>
          } 
        />
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />
        
        {/* Private Routes */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          } 
        />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes


