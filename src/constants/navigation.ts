import { ROUTES } from '@/constants/routes';
import type { Role } from '@/types/auth';

export type NavigationItem = {
  label: string;
  to: string;
  description?: string;
  roles?: readonly Role[];
};

export const publicNavigation: NavigationItem[] = [
  { label: 'Home', to: ROUTES.home },
  { label: 'Login', to: ROUTES.login },
  { label: 'Register', to: ROUTES.register },
];

export const dashboardNavigation: NavigationItem[] = [
  { label: 'Dashboard', to: ROUTES.dashboard },
  { label: 'Doctors', to: ROUTES.doctors, description: 'Clinical network' },
  { label: 'Doctor Verification', to: ROUTES.doctorVerification, description: 'Submit credentials', roles: ['DOCTOR'] },
  { label: 'Availability', to: ROUTES.doctorAvailability, description: 'Manage weekly slots', roles: ['DOCTOR'] },
  {
    label: 'Verification Review',
    to: ROUTES.adminDoctorVerifications,
    description: 'Review submissions',
    roles: ['ADMIN', 'SUPER_ADMIN'],
  },
  { label: 'Appointments', to: ROUTES.appointments, description: 'Care scheduling' },
  { label: 'Pharmacy', to: ROUTES.pharmacy, description: 'Medication services' },
  { label: 'Emergency', to: ROUTES.emergency, description: 'Rapid response' },
  { label: 'AI Assistant', to: ROUTES.aiAssistant, description: 'Care guidance' },
  { label: 'Profile', to: ROUTES.profile, description: 'Personal details' },
  { label: 'Settings', to: ROUTES.settings, description: 'Preferences' },
];
