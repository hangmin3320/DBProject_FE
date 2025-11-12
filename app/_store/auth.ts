'use client';

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { setAuthToken } from '../_lib/api/client';

interface AuthState {
  user: {
    user_id: number;
    email: string;
    username: string;
    bio: string;
    follower_count: number;
    following_count: number;
  } | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (userData: AuthState['user'], token: string) => void;
  logout: () => void;
  updateProfile: (userData: AuthState['user']) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        login: (user, token) => {
          setAuthToken(token);
          return set({ user, token, isAuthenticated: true });
        },
        logout: () => {
          setAuthToken(null);
          return set({ user: null, token: null, isAuthenticated: false });
        },
        updateProfile: (user) => set({ user }),
      }),
      {
        name: 'auth-storage', // unique name for localStorage
      }
    )
  )
);