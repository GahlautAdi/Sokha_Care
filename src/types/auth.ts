export type Role =
  | 'PATIENT'
  | 'DOCTOR'
  | 'PHARMACY'
  | 'SUPPORT'
  | 'MODERATOR'
  | 'ADMIN'
  | 'SUPER_ADMIN';

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type AuthResponse = {
  tokenType: string;
  accessToken: string;
  refreshToken: string;
  user: User;
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export type AuthApiResponse = {
  success: boolean;
  message: string;
  data: AuthResponse;
};
