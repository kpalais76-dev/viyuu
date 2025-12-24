
import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AuthService from './core/auth';
import { MobileLayout, AdminLayout } from './layouts';
import { LoginPage } from './features/auth/LoginPage';

// Feature Pages
import RecordPage from './features/client/RecordPage';
import MuseumPage from './features/client/MuseumPage';
import InboxPage from './features/client/InboxPage';
import AnalysisPage from './features/client/AnalysisPage';
import { ProfilePage } from './features/client/profile/index';
import { SettingsPage } from './features/client/profile/pages/SettingsPage';
import { GearManagerPage } from './features/client/profile/pages/GearManagerPage';
import { SpotManagerPage } from './features/client/profile/pages/SpotManagerPage';

import DashboardPage from './features/admin/DashboardPage';
import UsersPage from './features/admin/UsersPage';
import MessagesPage from './features/admin/MessagesPage';

// Auth Guard Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactElement; role?: string }> = ({ children, role }) => {
  const user = AuthService.getCurrentUser();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/app/record'} replace />;
  }

  return children;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* User Mobile App Routes */}
        <Route path="/app" element={
          <ProtectedRoute role="user">
            <MobileLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/app/record" replace />} />
          <Route path="record" element={<RecordPage />} />
          <Route path="museum" element={<MuseumPage />} />
          <Route path="analysis" element={<AnalysisPage />} />
          <Route path="inbox" element={<InboxPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/settings" element={<SettingsPage />} />
          <Route path="profile/gear" element={<GearManagerPage />} />
          <Route path="profile/spots" element={<SpotManagerPage />} />
        </Route>

        {/* Admin Dashboard Routes */}
        <Route path="/admin" element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="messages" element={<MessagesPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
