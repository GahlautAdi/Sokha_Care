import type { User } from '@/types/auth';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
export type BloodGroup =
  | 'A_POSITIVE'
  | 'A_NEGATIVE'
  | 'B_POSITIVE'
  | 'B_NEGATIVE'
  | 'AB_POSITIVE'
  | 'AB_NEGATIVE'
  | 'O_POSITIVE'
  | 'O_NEGATIVE'
  | 'UNKNOWN';
export type ConsultationMode = 'IN_PERSON' | 'ONLINE' | 'BOTH';

export type PatientProfile = {
  id: string;
  userId: string;
  dateOfBirth: string;
  gender: Gender;
  phoneNumber: string;
  bloodGroup: BloodGroup;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  allergySummary: string;
  createdAt: string;
  updatedAt: string | null;
};

export type DoctorProfile = {
  id: string;
  userId: string;
  specialty: string;
  consultationFee: number;
  bio: string;
  consultationMode: ConsultationMode;
  profilePhotoUrl: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string | null;
};

export type ProfileOverview = {
  user: User;
  patient: PatientProfile | null;
  doctor: DoctorProfile | null;
};

export type PatientProfileFormValues = {
  dateOfBirth: string;
  gender: Gender;
  phoneNumber: string;
  bloodGroup: BloodGroup;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  allergySummary: string;
};

export type DoctorProfileFormValues = {
  specialty: string;
  consultationFee: string;
  bio: string;
  consultationMode: ConsultationMode;
  profilePhotoUrl: string;
  active: boolean;
};
