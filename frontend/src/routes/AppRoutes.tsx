import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';
import { RootLayout } from '../layouts/RootLayout';

// Public Pages
import { HomePage } from '../pages/public/HomePage';
import { ExplorePage } from '../pages/public/ExplorePage';
import { ArtworkDetailPage } from '../pages/public/ArtworkDetailPage';
import { ArtistsPage } from '../pages/public/ArtistsPage';
import { ArtistProfilePage } from '../pages/public/ArtistProfilePage';
import { ExhibitionsPage } from '../pages/public/ExhibitionsPage';
import { ExhibitionDetailPage } from '../pages/public/ExhibitionDetailPage';
import { AboutPage } from '../pages/public/AboutPage';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';

// Artist Dashboard
import { ArtistOverview } from '../pages/artist/ArtistOverview';
import { MyArtwork } from '../pages/artist/MyArtwork';
import { UploadArtwork } from '../pages/artist/UploadArtwork';
import { ArtistCollections } from '../pages/artist/ArtistCollections';
import { ArtistEnquiries } from '../pages/artist/ArtistEnquiries';
import { ArtistAnalytics } from '../pages/artist/ArtistAnalytics';
import { ArtistProfileEdit } from '../pages/artist/ArtistProfileEdit';

// Visitor Dashboard
import { VisitorOverview } from '../pages/visitor/VisitorOverview';
import { SavedGallery } from '../pages/visitor/SavedGallery';
import { FollowedArtists } from '../pages/visitor/FollowedArtists';
import { VisitorEnquiries } from '../pages/visitor/VisitorEnquiries';
import { VisitorSettings } from '../pages/visitor/VisitorSettings';

// Admin Dashboard
import { AdminOverview } from '../pages/admin/AdminOverview';
import { ArtistManagement } from '../pages/admin/ArtistManagement';
import { ArtworkModeration } from '../pages/admin/ArtworkModeration';
import { ExhibitionManagement } from '../pages/admin/ExhibitionManagement';
import { CategoryManagement } from '../pages/admin/CategoryManagement';
import { ReportsPage } from '../pages/admin/ReportsPage';

/**
 * Route guard requiring authentication and optional specific role
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: Role[] }> = ({
  children,
  allowedRoles,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F0E8]">
        <div className="w-8 h-8 border-2 border-[#B49A65] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on actual role
    if (user.role === 'ADMIN') return <Navigate to="/admin/overview" replace />;
    if (user.role === 'ARTIST') return <Navigate to="/artist/overview" replace />;
    return <Navigate to="/visitor/overview" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages with Standard Header/Footer */}
      <Route element={<RootLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/artworks/:id" element={<ArtworkDetailPage />} />
        <Route path="/artists" element={<ArtistsPage />} />
        <Route path="/artists/:slug" element={<ArtistProfilePage />} />
        <Route path="/exhibitions" element={<ExhibitionsPage />} />
        <Route path="/exhibitions/:slug" element={<ExhibitionDetailPage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* Authentication */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Artist Dedicated Dashboard */}
      <Route
        path="/artist/overview"
        element={
          <ProtectedRoute allowedRoles={['ARTIST']}>
            <ArtistOverview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/artist/artwork"
        element={
          <ProtectedRoute allowedRoles={['ARTIST']}>
            <MyArtwork />
          </ProtectedRoute>
        }
      />
      <Route
        path="/artist/upload"
        element={
          <ProtectedRoute allowedRoles={['ARTIST']}>
            <UploadArtwork />
          </ProtectedRoute>
        }
      />
      <Route
        path="/artist/collections"
        element={
          <ProtectedRoute allowedRoles={['ARTIST']}>
            <ArtistCollections />
          </ProtectedRoute>
        }
      />
      <Route
        path="/artist/enquiries"
        element={
          <ProtectedRoute allowedRoles={['ARTIST']}>
            <ArtistEnquiries />
          </ProtectedRoute>
        }
      />
      <Route
        path="/artist/analytics"
        element={
          <ProtectedRoute allowedRoles={['ARTIST']}>
            <ArtistAnalytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/artist/profile"
        element={
          <ProtectedRoute allowedRoles={['ARTIST']}>
            <ArtistProfileEdit />
          </ProtectedRoute>
        }
      />

      {/* Visitor Dedicated Dashboard */}
      <Route
        path="/visitor/overview"
        element={
          <ProtectedRoute allowedRoles={['VISITOR']}>
            <VisitorOverview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/visitor/saved"
        element={
          <ProtectedRoute allowedRoles={['VISITOR']}>
            <SavedGallery />
          </ProtectedRoute>
        }
      />
      <Route
        path="/visitor/following"
        element={
          <ProtectedRoute allowedRoles={['VISITOR']}>
            <FollowedArtists />
          </ProtectedRoute>
        }
      />
      <Route
        path="/visitor/enquiries"
        element={
          <ProtectedRoute allowedRoles={['VISITOR']}>
            <VisitorEnquiries />
          </ProtectedRoute>
        }
      />
      <Route
        path="/visitor/settings"
        element={
          <ProtectedRoute allowedRoles={['VISITOR']}>
            <VisitorSettings />
          </ProtectedRoute>
        }
      />

      {/* Administrator Dedicated Dashboard */}
      <Route
        path="/admin/overview"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminOverview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/artists"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ArtistManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/artworks"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ArtworkModeration />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/exhibitions"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ExhibitionManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <CategoryManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ReportsPage />
          </ProtectedRoute>
        }
      />

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

