import { create } from "zustand";

interface EateryState {
  eateryId: string | null;
  eateryName: string | null;
  eateryOwner: string | null;
  open: boolean; // Added open state for modal
  setEatery: (id: string, name: string, owner: string) => void;
  setEateryId: (id: string) => void; // Added method to set just the ID
  setOpen: (open: boolean) => void; // Added method to control modal visibility
  clearEatery: () => void;
}

interface ModalState {
  open: boolean;
  rowData: any | null;
  openModal: (data: any) => void; 
  closeModal: () => void; // Added method to close modal
}

export const useEateryStore = create<EateryState>((set) => ({
  eateryId: null,
  eateryName: null,
  eateryOwner: null,
  open: false,
  setEatery: (id, name, owner) =>
    set({ eateryId: id, eateryName: name, eateryOwner: owner }),
  setEateryId: (id) => set({ eateryId: id }),
  setOpen: (open) => set({ open }),
  clearEatery: () =>
    set({ eateryId: null, eateryName: null, eateryOwner: null }),
}));

export const useModalStore = create<ModalState>((set) => ({
  open: false,
  rowData: null,
  openModal: (data) => set({ open: true, rowData: data }),
  closeModal: () => set({ open: false, rowData: null }),
}));
