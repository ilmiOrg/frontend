import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import CoreLayout from '../layouts/CoreLayout'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import Spinner from '../components/ui-components/ui-elements/Spinner'

// Lazy load components for better performance
const Dashboard = lazy(() => import('../components/Dashboard'))
const Search = lazy(() => import('../components/Search'))
const Hero = lazy(() => import('../components/Hero'))
const FeaturedUniversities = lazy(() => import('../components/FeaturedUniversities'))
const TopScholarships = lazy(() => import('../components/TopScholarships'))

function App() {
  return (
    <Router>
      <CoreLayout>
        <Header />
        <Suspense fallback={
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '50vh' 
          }}>
            <Spinner size="large" variant="primary" />
          </div>
        }>
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <FeaturedUniversities />
                <TopScholarships />
              </>
            } />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </Suspense>
        <BottomNav />
      </CoreLayout>
    </Router>
  )
}

export default App
