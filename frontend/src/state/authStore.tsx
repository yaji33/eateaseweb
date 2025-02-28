import { create } from "zustand";

interface User {
  id: string;
  name: string;
  role: "admin" | "business" | null;
  token: string;
}

interface AuthStore {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null, // Initially no user is logged in

  login: (user) => set({ user }), // Save user details on login

  logout: () => set({ user: null }), // Clear user on logout
}));
