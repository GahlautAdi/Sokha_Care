import axios from 'axios';

import type { ApiError, ApiErrorResponse, ValidationErrors } from '@/types/api';

function isValidationErrors(value: unknown): value is ValidationErrors {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

export function normalizeApiError(error: unknown): ApiError {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const status = error.response?.status;
    const payload = error.response?.data;
    const message =
      payload?.message ??
      payload?.error ??
      (error.code === 'ECONNABORTED'
        ? 'Request timed out'
        : error.message === 'Network Error'
          ? 'Network error. Check your connection and try again.'
          : error.message);

    const normalized: ApiError = {
      message,
      kind: 'unknown',
    };

    if (status !== undefined) {
      normalized.status = status;
    }

    if (error.code !== undefined) {
      normalized.code = error.code;
    }

    if (status === 401) {
      normalized.kind = 'unauthorized';
    } else if (status !== undefined && status >= 500) {
      normalized.kind = 'server';
    } else if (status === 400 && isValidationErrors(payload?.data)) {
      normalized.kind = 'validation';
      normalized.fieldErrors = payload.data;
    } else if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      normalized.kind = 'network';
    }

    if (payload?.data !== undefined && normalized.fieldErrors === undefined) {
      normalized.details = payload.data;
    }

    return normalized;
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      kind: 'unknown',
    };
  }

  return {
    message: 'An unexpected error occurred',
    kind: 'unknown',
  };
}
