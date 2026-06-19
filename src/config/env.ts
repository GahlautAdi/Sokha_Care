import { APP_NAME, REQUEST_TIMEOUT_MS } from '@/constants/app';

function parseNumberEnv(value: string | undefined, fallback: number) {
  if (value === undefined) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const env = {
  appName: import.meta.env.VITE_APP_NAME ?? APP_NAME,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1',
  requestTimeoutMs: parseNumberEnv(import.meta.env.VITE_REQUEST_TIMEOUT_MS, REQUEST_TIMEOUT_MS),
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;
