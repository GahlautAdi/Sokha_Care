import { api } from '@/services/api';
import type { ApiResponse } from '@/types/api';
import type { DoctorAvailability, DoctorAvailabilityFormValues } from '@/types/doctorAvailability';

export async function fetchMyDoctorAvailability(): Promise<DoctorAvailability[]> {
  const response = await api.get<ApiResponse<DoctorAvailability[]>>('/doctor-availability/me');
  return response.data;
}

export async function fetchDoctorAvailability(doctorId: string): Promise<DoctorAvailability[]> {
  const response = await api.get<ApiResponse<DoctorAvailability[]>>(`/doctors/${doctorId}/availability`);
  return response.data;
}

export async function createDoctorAvailability(request: DoctorAvailabilityFormValues): Promise<DoctorAvailability> {
  const response = await api.post<ApiResponse<DoctorAvailability>, DoctorAvailabilityFormValues>('/doctor-availability', request);
  return response.data;
}

export async function updateDoctorAvailability(id: string, request: DoctorAvailabilityFormValues): Promise<DoctorAvailability> {
  const response = await api.put<ApiResponse<DoctorAvailability>, DoctorAvailabilityFormValues>(`/doctor-availability/${id}`, request);
  return response.data;
}

export async function deleteDoctorAvailability(id: string): Promise<DoctorAvailability> {
  const response = await api.delete<ApiResponse<DoctorAvailability>>(`/doctor-availability/${id}`);
  return response.data;
}
