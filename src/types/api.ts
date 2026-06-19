export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type ValidationErrors = Record<string, string>;

export type ApiErrorResponse = {
  success?: boolean;
  message?: string;
  error?: string;
  data?: unknown;
};

export type ApiErrorKind = 'validation' | 'unauthorized' | 'network' | 'server' | 'unknown';

export type ApiError = {
  message: string;
  kind: ApiErrorKind;
  status?: number;
  code?: string;
  fieldErrors?: ValidationErrors;
  details?: unknown;
};
