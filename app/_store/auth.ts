'use client';

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { setAuthToken } from '../_lib/api/client';

interface AuthState {
  user: {
    user_id: number;
    email: string;
    username: string;
    bio: string;
    created_at: string;
    follower_count: number;
    following_count: number;
  } | null;
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
        isAuthenticated: false,
        login: (user, token) => {
          setAuthToken(token);
          return set({ user, isAuthenticated: true });
        },
        logout: () => {
          Cookies.remove('access_token');
          setAuthToken(null);
          localStorage.removeItem('auth-storage'); // Clear persisted state
          return set({ user: null, isAuthenticated: false });
        },
        updateProfile: (user) => set({ user }),
      }),
      {
        name: 'auth-storage', // unique name for localStorage
      }
    )
  )
);