import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

import { AuthLayout } from '@/layouts/AuthLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PublicLayout } from '@/layouts/PublicLayout';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { PublicRoute } from '@/routes/PublicRoute';

const HomePage = lazy(() => import('@/pages/HomePage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const DoctorsPage = lazy(() => import('@/pages/DoctorsPage'));
const AppointmentsPage = lazy(() => import('@/pages/AppointmentsPage'));
const PharmacyPage = lazy(() => import('@/pages/PharmacyPage'));
const EmergencyPage = lazy(() => import('@/pages/EmergencyPage'));
const AIAssistantPage = lazy(() => import('@/pages/AIAssistantPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const DoctorVerificationPage = lazy(() => import('@/pages/DoctorVerificationPage'));
const DoctorAvailabilityPage = lazy(() => import('@/pages/DoctorAvailabilityPage'));
const AdminDoctorVerificationPage = lazy(() => import('@/pages/AdminDoctorVerificationPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
      </Route>

      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route element={<ProtectedRoute allowedRoles={['DOCTOR']} />}>
            <Route path="/doctor-verification" element={<DoctorVerificationPage />} />
            <Route path="/doctor-availability" element={<DoctorAvailabilityPage />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']} />}>
            <Route path="/admin/doctor-verifications" element={<AdminDoctorVerificationPage />} />
          </Route>
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/pharmacy" element={<PharmacyPage />} />
          <Route path="/emergency" element={<EmergencyPage />} />
          <Route path="/ai-assistant" element={<AIAssistantPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
