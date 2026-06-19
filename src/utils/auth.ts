import type { User } from '@/types/auth';

export function getUserDisplayName(user: User | null | undefined) {
  if (!user) {
    return 'Sokha Care User';
  }

  return `${user.firstName} ${user.lastName}`.trim();
}

export function getUserInitials(user: User | null | undefined) {
  if (!user) {
    return 'SC';
  }

  const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.trim();
  return initials.length > 0 ? initials.toUpperCase() : 'SC';
}

export function getPrimaryRole(user: User | null | undefined) {
  return user?.roles[0] ?? null;
}

export function formatRoleLabel(role: string | null | undefined) {
  if (!role) {
    return null;
  }

  return role
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
