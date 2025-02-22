import { create } from "zustand";

interface ModalState {
  open: boolean;
  ownerId: string | null;
  ownerName: string | null;
  openModal: (id: string, name: string) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  open: false,
  ownerId: null,
  ownerName: null,
  openModal: (id, name) => {
    set({ open: true, ownerId: id, ownerName: name });
  },
  closeModal: () => {
    set({ open: false, ownerId: null, ownerName: null });
  },
}));
