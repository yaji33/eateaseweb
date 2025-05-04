import { useAuthStore } from "@/state/authStore";
const API_URL = import.meta.env.VITE_API_URL;

interface User {
  id: string;
  email: string;
  role_id: number;
}

interface LoginResponse {
  role_id: undefined;
  id: string;
  name: string;
  email: string;
  restaurant_status: number;
  restaurant_name: string;
  token: string;
  user: User;
}

{
  /*interface ErrorResponse {
  message?: string;
} */
}

export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    console.log("Sending login request:", { email, password });

    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    console.log("Raw response:", response);

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data && data.message ? data.message : "Login failed";
      throw new Error(errorMessage);
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logoutUser = () => {
  // Clear all authentication data from local storage
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
  useAuthStore.getState().logout();
};
