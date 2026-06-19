import { api } from '@/services/api';
import type { ApiResponse } from '@/types/api';
import type {
  DoctorVerification,
  DoctorVerificationReviewValues,
  DoctorVerificationStatusResponse,
  DoctorVerificationSubmitValues,
} from '@/types/doctorVerification';

export async function fetchDoctorVerificationStatus(): Promise<DoctorVerificationStatusResponse> {
  const response = await api.get<ApiResponse<DoctorVerificationStatusResponse>>('/doctor-verification/status');
  return response.data;
}

export async function submitDoctorVerification(request: DoctorVerificationSubmitValues): Promise<DoctorVerification> {
  const response = await api.post<ApiResponse<DoctorVerification>, DoctorVerificationSubmitValues>(
    '/doctor-verification/submit',
    request
  );
  return response.data;
}

export async function fetchDoctorVerificationRequests(): Promise<DoctorVerification[]> {
  const response = await api.get<ApiResponse<DoctorVerification[]>>('/admin/doctor-verifications');
  return response.data;
}

export async function fetchDoctorVerificationRequest(id: string): Promise<DoctorVerification> {
  const response = await api.get<ApiResponse<DoctorVerification>>(`/admin/doctor-verifications/${id}`);
  return response.data;
}

export async function approveDoctorVerification(id: string, request?: DoctorVerificationReviewValues): Promise<DoctorVerification> {
  const response = await api.put<ApiResponse<DoctorVerification>, DoctorVerificationReviewValues | undefined>(
    `/admin/doctor-verifications/${id}/approve`,
    request
  );
  return response.data;
}

export async function rejectDoctorVerification(id: string, request: DoctorVerificationReviewValues): Promise<DoctorVerification> {
  const response = await api.put<ApiResponse<DoctorVerification>, DoctorVerificationReviewValues>(
    `/admin/doctor-verifications/${id}/reject`,
    request
  );
  return response.data;
}
