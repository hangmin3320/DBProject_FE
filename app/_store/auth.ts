'use client';

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface AuthState {
  user: {
    id: number;
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

// SSR 안전한 스토어 생성
const createStore = () =>
  create<AuthState>()(
    devtools(
      persist(
        (set) => ({
          user: null,
          token: null,
          isAuthenticated: false,
          login: (user, token) => set({ user, token, isAuthenticated: true }),
          logout: () => set({ user: null, token: null, isAuthenticated: false }),
          updateProfile: (user) => set({ user }),
        }),
        {
          name: 'auth-storage', // unique name for localStorage
        }
      )
    )
  );

export const useAuthStore = createStore();