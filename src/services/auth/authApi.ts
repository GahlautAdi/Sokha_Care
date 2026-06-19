import { apiClient } from '@/services/api/client';
import { type ApiResponse } from '@/types/api';
import type { AuthResponse, AuthSession, LoginRequest, RegisterRequest } from '@/types/auth';
import { useAuthStore } from '@/store/authStore';

function toAuthSession(response: ApiResponse<AuthResponse>): AuthSession {
  return {
    accessToken: response.data.accessToken,
    refreshToken: response.data.refreshToken,
    user: response.data.user,
  };
}

export async function login(request: LoginRequest): Promise<AuthSession> {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', request, {
    skipAuthHeader: true,
    skipAuthRefresh: true,
  });

  return toAuthSession(response.data);
}

export async function register(request: RegisterRequest): Promise<AuthSession> {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', request, {
    skipAuthHeader: true,
    skipAuthRefresh: true,
  });

  return toAuthSession(response.data);
}

export async function refresh(refreshToken: string): Promise<AuthSession> {
  const response = await apiClient.post<ApiResponse<AuthResponse>>(
    '/auth/refresh',
    { refreshToken },
    {
      skipAuthHeader: true,
      skipAuthRefresh: true,
    }
  );

  return toAuthSession(response.data);
}

export async function logout(): Promise<void> {
  useAuthStore.getState().logout();
}
