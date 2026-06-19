import axios, { AxiosError, AxiosHeaders, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';

import { env } from '@/config/env';
import { REQUEST_TIMEOUT_MS } from '@/constants/app';
import { useAuthStore } from '@/store/authStore';
import type { ApiResponse } from '@/types/api';
import type { AuthResponse } from '@/types/auth';

import { normalizeApiError } from './error';

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuthHeader?: boolean;
    skipAuthRefresh?: boolean;
    _retry?: boolean;
  }
}

export type AuthRequestConfig = AxiosRequestConfig & {
  skipAuthHeader?: boolean;
  skipAuthRefresh?: boolean;
  _retry?: boolean;
};

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.requestTimeoutMs || REQUEST_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

let refreshPromise: Promise<string> | null = null;

function isAuthEndpoint(url?: string) {
  return Boolean(url && url.includes('/auth/'));
}

function getRefreshToken() {
  return useAuthStore.getState().refreshToken;
}

async function refreshAccessToken(refreshToken: string) {
  if (!refreshPromise) {
    refreshPromise = apiClient
      .post<ApiResponse<AuthResponse>>(
        '/auth/refresh',
        { refreshToken },
        {
          skipAuthHeader: true,
          skipAuthRefresh: true,
        }
      )
      .then((response) => {
        const session = response.data.data;

        useAuthStore.getState().setSession(session);
        return session.accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const requestConfig = config as InternalAxiosRequestConfig & AuthRequestConfig;
  const accessToken = useAuthStore.getState().accessToken;

  if (accessToken && !requestConfig.skipAuthHeader) {
    const headers = AxiosHeaders.from(requestConfig.headers as never);
    headers.set('Authorization', `Bearer ${accessToken}`);
    requestConfig.headers = headers;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const requestConfig = error.config as AuthRequestConfig | undefined;
    const status = error.response?.status;

    if (
      status === 401 &&
      requestConfig &&
      !requestConfig._retry &&
      !requestConfig.skipAuthRefresh &&
      !isAuthEndpoint(requestConfig.url)
    ) {
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        useAuthStore.getState().logout();
        return Promise.reject(normalizeApiError(error));
      }

      try {
        requestConfig._retry = true;
        const nextAccessToken = await refreshAccessToken(refreshToken);
        const headers = AxiosHeaders.from(requestConfig.headers as never);
        headers.set('Authorization', `Bearer ${nextAccessToken}`);
        requestConfig.headers = headers as InternalAxiosRequestConfig['headers'];
        return apiClient.request(requestConfig);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        return Promise.reject(normalizeApiError(refreshError));
      }
    }

    if (status === 401 && requestConfig && !requestConfig.skipAuthRefresh && !isAuthEndpoint(requestConfig.url)) {
      useAuthStore.getState().logout();
    }

    return Promise.reject(normalizeApiError(error));
  }
);
