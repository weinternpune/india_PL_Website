import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { PublicLayout } from './components/layout/PublicLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Public Pages
import { PublicHomePage } from './pages/PublicHomePage';
import { AdminLoginPage } from './pages/AdminLoginPage';

// Admin Pages
import { AdminDashboardHome } from './pages/admin/AdminDashboardHome';
import { AdminBookingsPage } from './pages/admin/AdminBookingsPage';
import { AdminBookingDetailPage } from './pages/admin/AdminBookingDetailPage';
import { AdminWorkersPage } from './pages/admin/AdminWorkersPage';
import { AdminWorkerDetailPage } from './pages/admin/AdminWorkerDetailPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminCustomerDetailPage } from './pages/admin/AdminCustomerDetailPage';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminPayoutsPage } from './pages/admin/AdminPayoutsPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminNotificationsPage } from './pages/admin/AdminNotificationsPage';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<PublicHomePage />} />
          </Route>

          {/* Admin Login Route */}
          <Route path="/login" element={<AdminLoginPage />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardHome />} />
            <Route path="bookings" element={<AdminBookingsPage />} />
            <Route path="bookings/:id" element={<AdminBookingDetailPage />} />
            <Route path="workers" element={<AdminWorkersPage />} />
            <Route path="workers/:id" element={<AdminWorkerDetailPage />} />
            <Route path="customers" element={<AdminCustomersPage />} />
            <Route path="customers/:id" element={<AdminCustomerDetailPage />} />
            <Route path="services" element={<AdminServicesPage />} />
            <Route path="payouts" element={<AdminPayoutsPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="notifications" element={<AdminNotificationsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
