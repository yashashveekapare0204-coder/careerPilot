import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

// Guards
import ProtectedRoute from './components/ProtectedRoute';
import PublicOnlyRoute from './components/PublicOnlyRoute';
import AppLayout from './components/AppLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import ResumeCorrectorPage from './pages/ResumeCorrectorPage';
import MockInterviewPage from './pages/MockInterviewPage';
import InterviewResultsPage from './pages/InterviewResultsPage';
import PlacementReadinessPage from './pages/PlacementReadinessPage';
import SkillGapPage from './pages/SkillGapPage';
import CareerRoadmapPage from './pages/CareerRoadmapPage';
import ProgressPage from './pages/ProgressPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Authentication Pages (Redirect to /home if already logged in) */}
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <LoginPage />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicOnlyRoute>
                  <SignUpPage />
                </PublicOnlyRoute>
              }
            />

            {/* Protected Application Routes under Left Sidebar AppLayout */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              {/* Note: Strictly labeled "Home", NEVER "Dashboard" */}
              <Route path="/home" element={<HomePage />} />
              <Route path="/resume" element={<ResumeCorrectorPage />} />
              <Route path="/interview" element={<MockInterviewPage />} />
              <Route path="/interview-results" element={<InterviewResultsPage />} />
              <Route path="/readiness" element={<PlacementReadinessPage />} />
              <Route path="/skills" element={<SkillGapPage />} />
              <Route path="/roadmap" element={<CareerRoadmapPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Handle Unknown Routes with Friendly 404 Page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
