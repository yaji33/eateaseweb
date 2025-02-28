import { create } from "zustand";

interface OwnerState {
  ownerId: string | null;
  ownerName: string | null;
  setOwner: (id: string, name: string) => void;
  clearOwner: () => void;
}

interface EateryState {
  eateryId: string | null;
  eateryName: string | null;
  setEatery: (id: string, name: string) => void;
  clearEatery: () => void;
}

interface ModalState {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useOwnerStore = create<OwnerState>((set) => ({
  ownerId: null,
  ownerName: null,
  setOwner: (id, name) => set({ ownerId: id, ownerName: name }),
  clearOwner: () => set({ ownerId: null, ownerName: null }),
}));

export const useEateryStore = create<EateryState>((set) => ({
  eateryId: null,
  eateryName: null,
  setEatery: (id, name) => set({ eateryId: id, eateryName: name }),
  clearEatery: () => set({ eateryId: null, eateryName: null }),
}));

export const useModalStore = create<ModalState>((set) => ({
  open: false,
  openModal: () => set({ open: true }),
  closeModal: () => set({ open: false }),
}));
