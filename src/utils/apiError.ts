import type { ApiError } from '@/types/api';

import { normalizeApiError } from '@/services/api/error';

export function isApiError(value: unknown): value is ApiError {
  return Boolean(value && typeof value === 'object' && 'message' in value && 'kind' in value);
}

export function toApiError(error: unknown): ApiError {
  return isApiError(error) ? error : normalizeApiError(error);
}
