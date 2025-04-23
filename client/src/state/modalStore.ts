import { create } from "zustand";

interface EateryState {
  eateryId: string | null;
  eateryName: string | null;
  eateryOwner: string | null;
  setEatery: (id: string, name: string, owner: string) => void;
  clearEatery: () => void;
}

interface ModalState {
  open: boolean;
  rowData: any | null;
  openModal: () => void;
  closeModal: () => void;
}

export const useEateryStore = create<EateryState>((set) => ({
  eateryId: null,
  eateryName: null,
  eateryOwner: null,
  setEatery: (id, name, owner) =>
    set({ eateryId: id, eateryName: name, eateryOwner: owner }),
  clearEatery: () =>
    set({ eateryId: null, eateryName: null, eateryOwner: null }),
}));

export const useModalStore = create<ModalState>((set) => ({
  open: false,
  rowData: null,
  openModal: (data) => set({ open: true, rowData: data }),
  closeModal: () => set({ open: false, rowData: null }),
}));
