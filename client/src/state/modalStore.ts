/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";

interface EateryState {
  eateryId: string | null;
  eateryName: string | null;
  eateryOwner: string | null;
  open: boolean; 
  setEatery: (id: string, name: string, owner: string) => void;
  setEateryId: (id: string) => void;
  setOpen: (open: boolean) => void;
  closeModal: () => void;
  clearEatery: () => void;
}

interface ModalState {
  open: boolean;
  rowData: any | null;
  openModal: (data: any) => void;
  closeModal: () => void; 
}

export const useEateryStore = create<EateryState>((set) => ({
  eateryId: null,
  eateryName: null,
  eateryOwner: null,
  open: false,
  closeModal: () => set({ open: false }),
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
