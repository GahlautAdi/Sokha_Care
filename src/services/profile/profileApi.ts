import { api } from '@/services/api';
import type { ApiResponse } from '@/types/api';
import type {
  DoctorProfile,
  DoctorProfileFormValues,
  PatientProfile,
  PatientProfileFormValues,
  ProfileOverview,
} from '@/types/profile';

export async function fetchProfileOverview(): Promise<ProfileOverview> {
  const response = await api.get<ApiResponse<ProfileOverview>>('/profile/me');
  return response.data;
}

export async function fetchPatientProfile(): Promise<PatientProfile> {
  const response = await api.get<ApiResponse<PatientProfile>>('/profile/patient');
  return response.data;
}

export async function updatePatientProfile(request: PatientProfileFormValues): Promise<PatientProfile> {
  const response = await api.put<ApiResponse<PatientProfile>, PatientProfileFormValues>('/profile/patient', request);
  return response.data;
}

export async function fetchDoctorProfile(): Promise<DoctorProfile> {
  const response = await api.get<ApiResponse<DoctorProfile>>('/profile/doctor');
  return response.data;
}

export async function updateDoctorProfile(request: DoctorProfileFormValues): Promise<DoctorProfile> {
  const response = await api.put<ApiResponse<DoctorProfile>, DoctorProfileFormValues>('/profile/doctor', request);
  return response.data;
}
