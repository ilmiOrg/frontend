import React from 'react'
import { Routes, Route } from 'react-router-dom'
import DashboardPage from '../pages/MainPages/DashboardPage'

const PrivateRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/universities" element={<div>Universities Page - Coming Soon</div>} />
      <Route path="/scholarships" element={<div>Scholarships Page - Coming Soon</div>} />
      <Route path="/applications" element={<div>Applications Page - Coming Soon</div>} />
      <Route path="/documents" element={<div>Documents Page - Coming Soon</div>} />
      <Route path="/ai-matching" element={<div>AI Matching Page - Coming Soon</div>} />
      <Route path="/social" element={<div>Social Page - Coming Soon</div>} />
      <Route path="/notifications" element={<div>Notifications Page - Coming Soon</div>} />
      <Route path="/profile" element={<div>Profile Page - Coming Soon</div>} />
      <Route path="*" element={<DashboardPage />} />
    </Routes>
  )
}

export default PrivateRoutes


