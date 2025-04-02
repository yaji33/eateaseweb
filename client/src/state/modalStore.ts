import { create } from "zustand";

interface UserState {
  userId: string | null;
  userName: string | null;
  setUser: (id: string, name: string) => void;
  clearUser: () => void;
}

interface EateryState {
  eateryId: string | null;
  eateryName: string | null;
  setEatery: (id: string, name: string) => void;
  clearEatery: () => void;
}

interface ModalState {
  open: boolean;
  rowData: any | null;
  openModal: () => void;
  closeModal: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  userId: null,
  userName: null,
  setUser: (id, name) => set({ userId: id, userName: name }),
  clearUser: () => set({ userId: null, userName: null }),
}));

export const useEateryStore = create<EateryState>((set) => ({
  eateryId: null,
  eateryName: null,
  setEatery: (id, name) => set({ eateryId: id, eateryName: name }),
  clearEatery: () => set({ eateryId: null, eateryName: null }),
}));

export const useModalStore = create<ModalState>((set) => ({
  open: false,
  rowData: null,
  openModal: (data) => set({ open: true, rowData: data }), 
  closeModal: () => set({ open: false, rowData: null }), 
}));
