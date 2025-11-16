import { create } from "zustand";

interface ModalState {
  isHabitModalOpen: boolean;
  openHabitModal: () => void;
  closeHabitModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isHabitModalOpen: false,
  openHabitModal: () => set({ isHabitModalOpen: true }),
  closeHabitModal: () => set({ isHabitModalOpen: false }),
}));
