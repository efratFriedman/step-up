import { create } from "zustand";

interface ModalPostState {
  isPostModalOpen: boolean;
  openPostModal: () => void;
  closePostModal: () => void;
}

export const useModalPostStore = create<ModalPostState>((set) => ({
  isPostModalOpen: false,
  openPostModal: () => set({ isPostModalOpen: true }),
  closePostModal: () => set({ isPostModalOpen: false }),
}));
