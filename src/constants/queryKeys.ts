export const QUERY_KEYS = {
  doctorVerification: {
    status: ['doctor-verification', 'status'] as const,
    requests: ['doctor-verification', 'requests'] as const,
    request: (id: string) => ['doctor-verification', 'requests', id] as const,
  },
  doctorAvailability: {
    me: ['doctor-availability', 'me'] as const,
    doctor: (doctorId: string) => ['doctor-availability', 'doctors', doctorId] as const,
  },
  profile: {
    me: ['profile', 'me'] as const,
    patient: ['profile', 'patient'] as const,
    doctor: ['profile', 'doctor'] as const,
  },
  doctors: ['doctors'] as const,
  appointments: ['appointments'] as const,
  pharmacy: ['pharmacy'] as const,
} as const;
