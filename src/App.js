import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import PublicHomePage from "./logged-out/pages/PublicHomePage";
import LoginPage from "./logged-out/pages/LoginPage";
import RegisterPage from "./logged-out/pages/RegisterPage";
import DashboardPage from "./logged-in/pages/MainPages/DashboardPage";

// Main Pages
import DreamUniversityPage from "./logged-in/pages/MainPages/DreamUniversityPage";
import SearchUniversitiesPage from "./logged-in/pages/MainPages/SearchUniversitiesPage";
import UniversityDetailPage from "./logged-in/pages/MainPages/SearchUniversitiesPage/UniversityDetailPage";
import FavoriteUniversitiesPage from "./logged-in/pages/MainPages/SearchUniversitiesPage/FavoriteUniversitiesPage";
import SearchFieldsPage from "./logged-in/pages/MainPages/SearchFieldsPage";
import FieldSlugRouter from "./logged-in/pages/MainPages/FieldDetailPage/FieldSlugRouter";
import SearchProgramsPage from "./logged-in/pages/MainPages/SearchProgramsPage";
import ProgramDetailPage from "./logged-in/pages/MainPages/ProgramDetailPage";
import FavoriteProgramsPage from "./logged-in/pages/MainPages/FavoriteProgramsPage";
import SearchScholarshipsPage from "./logged-in/pages/MainPages/SearchScholarshipsPage";

import ProfilePage from "./logged-in/pages/MainPages/ProfilePage";
import SendInfoPage from "./logged-in/pages/MainPages/SendInfoPage";



// AI Matching Pages
import MatchUniversitiesPage from "./logged-in/pages/AIMatchingPages/MatchUniversitiesPage";
import MatchScholarshipsPage from "./logged-in/pages/AIMatchingPages/MatchScholarshipsPage";
import SimilarStudentsPage from "./logged-in/pages/AIMatchingPages/SimilarStudentsPage";
import ConnectFriendsPage from "./logged-in/pages/CommunityPages/ConnectFriendsPage";
import AlumniMentorsPage from "./logged-in/pages/CommunityPages/AlumniMentorsPage";

// Contact Pages
import ContactPremiumPage from "./logged-in/pages/ContactPages/ContactPremiumPage";

import "./styles/variables.css";
import "./styles/core.css";
import "./styles/animations.css";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
          color: "white",
          fontSize: "1.2rem",
        }}
      >
        Loading...
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
          color: "white",
          fontSize: "1.2rem",
        }}
      >
        Loading...
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

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
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
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
            path="/dashboard/search/universities/:slug"
            element={
              <ProtectedRoute>
                <UniversityDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/search/universities/favorites"
            element={
              <ProtectedRoute>
                <FavoriteUniversitiesPage />
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
            path="/dashboard/search/fields/:slug"
            element={
              <ProtectedRoute>
                <FieldSlugRouter />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/search/fields"
            element={
              <ProtectedRoute>
                <SearchFieldsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/search/programs/favorites"
            element={
              <ProtectedRoute>
                <FavoriteProgramsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/search/programs/:id"
            element={
              <ProtectedRoute>
                <ProgramDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/search/programs"
            element={
              <ProtectedRoute>
                <SearchProgramsPage />
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

          {/* Contact Routes */}
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
  );
}

export default App;
