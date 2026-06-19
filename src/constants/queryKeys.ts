export const QUERY_KEYS = {
  profile: {
    me: ['profile', 'me'] as const,
    patient: ['profile', 'patient'] as const,
    doctor: ['profile', 'doctor'] as const,
  },
  doctors: ['doctors'] as const,
  appointments: ['appointments'] as const,
  pharmacy: ['pharmacy'] as const,
} as const;
