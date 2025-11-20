import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IUserClient } from '@/interfaces/IUserClient';

interface UserState {
  user: IUserClient | null;
  setUser: (user: IUserClient) => void;
  clearUser: () => void;

  tempEmail: string;
  setTempEmail: (email: string) => void;

  tempPassword: string;
  setTempPassword: (password: string) => void;
}


export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),

      tempEmail: "",
      setTempEmail: (email) => set({ tempEmail: email }),

      tempPassword: "",
      setTempPassword: (password) => set({ tempPassword: password }),
    }),
    {
      name: 'user-storage',
    }
  )
);
