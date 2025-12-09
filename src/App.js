import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import PublicHomePage from './logged-out/pages/PublicHomePage'
import DashboardPage from './logged-in/pages/MainPages/DashboardPage'

// Main Pages
import DreamUniversityPage from './logged-in/pages/MainPages/DreamUniversityPage'
import SearchUniversitiesPage from './logged-in/pages/MainPages/SearchUniversitiesPage'
import SearchScholarshipsPage from './logged-in/pages/MainPages/SearchScholarshipsPage'
import StudyTogetherPage from './logged-in/pages/MainPages/StudyTogetherPage'
import UniversityReelsPage from './logged-in/pages/MainPages/UniversityReelsPage'
import ProfilePage from './logged-in/pages/MainPages/ProfilePage'
import SendInfoPage from './logged-in/pages/MainPages/SendInfoPage'

// Application Pages
import ApplicationTimelinePage from './logged-in/pages/ApplicationPages/ApplicationTimelinePage'
import MyDocumentsPage from './logged-in/pages/ApplicationPages/MyDocumentsPage'

// AI Matching Pages
import MatchUniversitiesPage from './logged-in/pages/AIMatchingPages/MatchUniversitiesPage'
import MatchScholarshipsPage from './logged-in/pages/AIMatchingPages/MatchScholarshipsPage'
import SimilarStudentsPage from './logged-in/pages/AIMatchingPages/SimilarStudentsPage'

// Community Pages
import ConnectFriendsPage from './logged-in/pages/CommunityPages/ConnectFriendsPage'
import AlumniMentorsPage from './logged-in/pages/CommunityPages/AlumniMentorsPage'

// Career Pages
import InternshipsPage from './logged-in/pages/CareerPages/InternshipsPage'
import MastersPage from './logged-in/pages/CareerPages/MastersPage'
import CareerAnalysisPage from './logged-in/pages/CareerPages/CareerAnalysisPage'

// Premium Pages
import EssayReviewsPage from './logged-in/pages/PremiumPages/EssayReviewsPage'
import MockInterviewsPage from './logged-in/pages/PremiumPages/MockInterviewsPage'
import ConciergeSupportPage from './logged-in/pages/PremiumPages/ConciergeSupportPage'

// Learning Pages
import GetCoursesPage from './logged-in/pages/LearningPages/GetCoursesPage'
import MathPage from './logged-in/pages/LearningPages/MathPage'
import EnglishPage from './logged-in/pages/LearningPages/EnglishPage'
import EssayWritingPage from './logged-in/pages/LearningPages/EssayWritingPage'
import AILiteracyPage from './logged-in/pages/LearningPages/AILiteracyPage'

// Privacy & Contact Pages
import PrivacyDashboardPage from './logged-in/pages/PrivacyPages/PrivacyDashboardPage'
import ContactPremiumPage from './logged-in/pages/ContactPages/ContactPremiumPage'

import './styles/variables.css'
import './styles/core.css'
import './styles/animations.css'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) {
    return <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      color: 'white',
      fontSize: '1.2rem'
    }}>
      Loading...
    </div>
  }
  
  return isAuthenticated ? children : <Navigate to="/" replace />
}

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) {
    return <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      color: 'white',
      fontSize: '1.2rem'
    }}>
      Loading...
    </div>
  }
  
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children
}

function App() {
  return (
    <AuthProvider>
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
          
          {/* Protected Main Dashboard */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Main Pages - under /dashboard */}
          <Route 
            path="/dashboard/dream-university" 
            element={
              <ProtectedRoute>
                <DreamUniversityPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dashboard/search/universities" 
            element={
              <ProtectedRoute>
                <SearchUniversitiesPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dashboard/search/scholarships" 
            element={
              <ProtectedRoute>
                <SearchScholarshipsPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dashboard/study-together" 
            element={
              <ProtectedRoute>
                <StudyTogetherPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dashboard/university-reels" 
            element={
              <ProtectedRoute>
                <UniversityReelsPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dashboard/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dashboard/send-info" 
            element={
              <ProtectedRoute>
                <SendInfoPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Application Management Routes */}
          <Route 
            path="/dashboard/applications/timeline" 
            element={
              <ProtectedRoute>
                <ApplicationTimelinePage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dashboard/applications/documents" 
            element={
              <ProtectedRoute>
                <MyDocumentsPage />
              </ProtectedRoute>
            } 
          />
          
          {/* AI Matching Routes */}
          <Route 
            path="/dashboard/ai/match-universities" 
            element={
              <ProtectedRoute>
                <MatchUniversitiesPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dashboard/ai/match-scholarships" 
            element={
              <ProtectedRoute>
                <MatchScholarshipsPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dashboard/ai/similar-students" 
            element={
              <ProtectedRoute>
                <SimilarStudentsPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Community Routes */}
          <Route 
            path="/dashboard/community/friends" 
            element={
              <ProtectedRoute>
                <ConnectFriendsPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dashboard/community/mentors" 
            element={
              <ProtectedRoute>
                <AlumniMentorsPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Career Routes */}
          <Route 
            path="/dashboard/career/internships" 
            element={
              <ProtectedRoute>
                <InternshipsPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dashboard/career/masters" 
            element={
              <ProtectedRoute>
                <MastersPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dashboard/career/analysis" 
            element={
              <ProtectedRoute>
                <CareerAnalysisPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Premium Services Routes */}
          <Route 
            path="/dashboard/premium/essay-reviews" 
            element={
              <ProtectedRoute>
                <EssayReviewsPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dashboard/premium/mock-interviews" 
            element={
              <ProtectedRoute>
                <MockInterviewsPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dashboard/premium/concierge" 
            element={
              <ProtectedRoute>
                <ConciergeSupportPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Learning & Courses Routes */}
          <Route 
            path="/dashboard/courses" 
            element={
              <ProtectedRoute>
                <GetCoursesPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dashboard/courses/math" 
            element={
              <ProtectedRoute>
                <MathPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dashboard/courses/english" 
            element={
              <ProtectedRoute>
                <EnglishPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dashboard/courses/essay-writing" 
            element={
              <ProtectedRoute>
                <EssayWritingPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dashboard/courses/ai-literacy" 
            element={
              <ProtectedRoute>
                <AILiteracyPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Privacy & Contact Routes */}
          <Route 
            path="/dashboard/privacy" 
            element={
              <ProtectedRoute>
                <PrivacyDashboardPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dashboard/contact-premium" 
            element={
              <ProtectedRoute>
                <ContactPremiumPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
