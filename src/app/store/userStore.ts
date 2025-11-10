import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IUserClient } from '@/interfaces/IUserClient';

interface UserState {
  user: IUserClient | null;
  setUser: (user: IUserClient) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
    }
  )
);
