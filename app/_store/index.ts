'use client';

import { create } from 'zustand';

interface GeneralState {
  // Add general state properties here as needed
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const useGeneralStore = create<GeneralState>()((set, get) => ({
  theme: 'light',
  toggleTheme: () => {
    const currentTheme = get().theme;
    set({ theme: currentTheme === 'light' ? 'dark' : 'light' });
  },
}));