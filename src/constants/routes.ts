export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  doctors: '/doctors',
  appointments: '/appointments',
  pharmacy: '/pharmacy',
  emergency: '/emergency',
  aiAssistant: '/ai-assistant',
  profile: '/profile',
  settings: '/settings',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
