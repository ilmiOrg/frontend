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
import DashboardLayout from "./logged-in/shared/DashboardLayout";
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

const FullPageLoader = () => (
  <div className="full-page-loader">Loading…</div>
);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <FullPageLoader />;
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <FullPageLoader />;
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

          {/* All /dashboard/* routes share DashboardLayout (sidebar + topbar) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="dream-university" element={<DreamUniversityPage />} />
            <Route
              path="search/universities/favorites"
              element={<FavoriteUniversitiesPage />}
            />
            <Route
              path="search/universities/:slug"
              element={<UniversityDetailPage />}
            />
            <Route
              path="search/universities"
              element={<SearchUniversitiesPage />}
            />
            <Route path="search/fields/:slug" element={<FieldSlugRouter />} />
            <Route path="search/fields" element={<SearchFieldsPage />} />
            <Route
              path="search/programs/favorites"
              element={<FavoriteProgramsPage />}
            />
            <Route
              path="search/programs/:id"
              element={<ProgramDetailPage />}
            />
            <Route path="search/programs" element={<SearchProgramsPage />} />
            <Route
              path="search/scholarships"
              element={<SearchScholarshipsPage />}
            />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="send-info" element={<SendInfoPage />} />
            <Route
              path="ai/match-universities"
              element={<MatchUniversitiesPage />}
            />
            <Route
              path="ai/match-scholarships"
              element={<MatchScholarshipsPage />}
            />
            <Route
              path="ai/similar-students"
              element={<SimilarStudentsPage />}
            />
            <Route
              path="community/friends"
              element={<ConnectFriendsPage />}
            />
            <Route
              path="community/mentors"
              element={<AlumniMentorsPage />}
            />
            <Route path="contact-premium" element={<ContactPremiumPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
