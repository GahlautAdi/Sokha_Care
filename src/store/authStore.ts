import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { queryClient } from '@/config/queryClient';
import { STORAGE_KEYS } from '@/constants/storage';
import type { AuthSession, User } from '@/types/auth';
import { safeStorage } from '@/utils/storage';

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  hasHydrated: boolean;
  setSession: (session: AuthSession) => void;
  setHydrated: (value: boolean) => void;
  logout: () => void;
};

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  hasHydrated: false,
} as const;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,
      setSession: ({ accessToken, refreshToken, user }) =>
        set({
          user,
          accessToken,
          refreshToken,
        }),
      setHydrated: (value) => set({ hasHydrated: value }),
      logout: () => {
        queryClient.clear();
        set({
          ...initialState,
          hasHydrated: true,
        });
      },
    }),
    {
      name: STORAGE_KEYS.auth,
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
