import type { AxiosRequestConfig } from 'axios';

import { apiClient } from './client';

export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<T>(url, config).then((response) => response.data),
  post: <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>) =>
    apiClient.post<T>(url, data, config).then((response) => response.data),
  put: <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>) =>
    apiClient.put<T>(url, data, config).then((response) => response.data),
  patch: <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>) =>
    apiClient.patch<T>(url, data, config).then((response) => response.data),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<T>(url, config).then((response) => response.data),
};
