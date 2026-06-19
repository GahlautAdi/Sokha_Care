export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export type ConsultationMode = 'ONLINE' | 'OFFLINE' | 'BOTH';

export type DoctorAvailability = {
  id: string;
  doctorId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  consultationMode: ConsultationMode;
  active: boolean;
  createdAt: string;
  updatedAt: string | null;
};

export type DoctorAvailabilityFormValues = {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  consultationMode: ConsultationMode;
};
