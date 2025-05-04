import { create } from "zustand";

interface User {
  id: string;
  name: string;
  role: "admin" | "business" | "unknown" | null;
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
    set({ user });
    localStorage.setItem("authToken", user.token);
    if (user.role === "admin") {
      console.log("Redirecting admin user to /dashboard");
      navigate("/dashboard");
    } else if (user.role === "business") {
      console.log("Redirecting business user to /business-home");
      navigate("/business-home");
    } else {
      console.warn(`Unrecognized role: ${user.role}. Redirecting to login.`);
      navigate("/login");
    }
  },

  logout: () => {
    set({ user: null });
    localStorage.removeItem("authToken");
  },
}));
