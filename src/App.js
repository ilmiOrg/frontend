import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFoundPage from "./logged-in/shared/NotFoundPage";

import "./styles/variables.css";
import "./styles/core.css";
import "./styles/animations.css";

// Route components are code-split: each loads on first navigation rather than in the
// initial bundle (matters for the mobile-first audience on slow networks).
const PublicHomePage = lazy(() => import("./logged-out/pages/PublicHomePage"));
const LoginPage = lazy(() => import("./logged-out/pages/LoginPage"));
const RegisterPage = lazy(() => import("./logged-out/pages/RegisterPage"));
const DashboardLayout = lazy(() => import("./logged-in/shared/DashboardLayout"));
const DashboardPage = lazy(() => import("./logged-in/pages/MainPages/DashboardPage"));

const SearchUniversitiesPage = lazy(() => import("./logged-in/pages/MainPages/SearchUniversitiesPage"));
const UniversityDetailPage = lazy(() => import("./logged-in/pages/MainPages/SearchUniversitiesPage/UniversityDetailPage"));
const FavoriteUniversitiesPage = lazy(() => import("./logged-in/pages/MainPages/SearchUniversitiesPage/FavoriteUniversitiesPage"));
const SearchFieldsPage = lazy(() => import("./logged-in/pages/MainPages/SearchFieldsPage"));
const FieldSlugRouter = lazy(() => import("./logged-in/pages/MainPages/FieldDetailPage/FieldSlugRouter"));
const SearchProgramsPage = lazy(() => import("./logged-in/pages/MainPages/SearchProgramsPage"));
const ProgramDetailPage = lazy(() => import("./logged-in/pages/MainPages/ProgramDetailPage"));
const FavoriteProgramsPage = lazy(() => import("./logged-in/pages/MainPages/FavoriteProgramsPage"));
const SearchScholarshipsPage = lazy(() => import("./logged-in/pages/MainPages/SearchScholarshipsPage"));
const JobsPage = lazy(() => import("./logged-in/pages/MainPages/JobsPage"));
const CoursesPage = lazy(() => import("./logged-in/pages/MainPages/CoursesPage"));
const ProfilePage = lazy(() => import("./logged-in/pages/MainPages/ProfilePage"));
const MyAcademicsPage = lazy(() => import("./logged-in/pages/MainPages/MyAcademicsPage"));
const SendInfoPage = lazy(() => import("./logged-in/pages/MainPages/SendInfoPage"));
const MyApplicationsPage = lazy(() => import("./logged-in/pages/ApplicationPages/MyApplicationsPage"));
const EssayReviewPage = lazy(() => import("./logged-in/pages/LearningPages/EssayReviewPage"));

const MatchUniversitiesPage = lazy(() => import("./logged-in/pages/AIMatchingPages/MatchUniversitiesPage"));
const MatchScholarshipsPage = lazy(() => import("./logged-in/pages/AIMatchingPages/MatchScholarshipsPage"));
const AdminReviewPage = lazy(() => import("./logged-in/pages/AdminPages/AdminReviewPage"));

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

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  if (isLoading) return <FullPageLoader />;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return isAdmin ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      <Router>
        <Suspense fallback={<FullPageLoader />}>
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
            <Route path="opportunities/jobs" element={<JobsPage />} />
            <Route path="opportunities/courses" element={<CoursesPage />} />
            <Route path="applications" element={<MyApplicationsPage />} />
            <Route path="academics" element={<MyAcademicsPage />} />
            <Route path="learning/essay-review" element={<EssayReviewPage />} />
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
              path="admin"
              element={
                <AdminRoute>
                  <AdminReviewPage />
                </AdminRoute>
              }
            />
            {/* Unknown /dashboard/* path: real 404 inside the layout */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Catch-all: a real 404 instead of a silent redirect */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </Suspense>
      </Router>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
