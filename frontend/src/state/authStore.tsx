import { create } from "zustand";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  name: string;
  role: "admin" | "business" | null;
  token: string;
}

interface AuthStore {
  user: User | null;
  login: (user: User, navigate: (path: string) => void) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null, 
  login: (user, navigate) => {
    set({ user});

    if (user.role === "admin") {
      navigate("/dashboard");
    } else if (user.role === "business") {
      navigate("/business-home"); 
    } else {
      navigate("/login"); 
    }
  },

  logout: () => set({ user: null }), 
}));
