import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Spinner from '../core/ui/atoms/Spinner'

const LoginPage = lazy(() => import('../logged-out/pages/LoginPage'))
const PublicHomePage = lazy(() => import('../logged-out/pages/PublicHomePage'))

const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'var(--backgroundGradient)'
  }}>
    <Spinner size="large" variant="primary" />
  </div>
)

function PublicRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<PublicHomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default PublicRoutes


import { Routes, Route, Navigate } from 'react-router-dom'
import Spinner from '../core/ui/atoms/Spinner'

const LoginPage = lazy(() => import('../logged-out/pages/LoginPage'))
const PublicHomePage = lazy(() => import('../logged-out/pages/PublicHomePage'))

const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'var(--backgroundGradient)'
  }}>
    <Spinner size="large" variant="primary" />
  </div>
)

function PublicRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<PublicHomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default PublicRoutes



