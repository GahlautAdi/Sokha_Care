import { ROUTES } from '@/constants/routes';

export type NavigationItem = {
  label: string;
  to: string;
  description?: string;
};

export const publicNavigation: NavigationItem[] = [
  { label: 'Home', to: ROUTES.home },
  { label: 'Login', to: ROUTES.login },
  { label: 'Register', to: ROUTES.register },
];

export const dashboardNavigation: NavigationItem[] = [
  { label: 'Dashboard', to: ROUTES.dashboard },
  { label: 'Doctors', to: ROUTES.doctors, description: 'Clinical network' },
  { label: 'Appointments', to: ROUTES.appointments, description: 'Care scheduling' },
  { label: 'Pharmacy', to: ROUTES.pharmacy, description: 'Medication services' },
  { label: 'Emergency', to: ROUTES.emergency, description: 'Rapid response' },
  { label: 'AI Assistant', to: ROUTES.aiAssistant, description: 'Care guidance' },
  { label: 'Profile', to: ROUTES.profile, description: 'Personal details' },
  { label: 'Settings', to: ROUTES.settings, description: 'Preferences' },
];
