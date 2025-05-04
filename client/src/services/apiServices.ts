// services/apiService.ts
import axios, { AxiosError, AxiosResponse } from "axios";
import { useAuthStore } from "@/state/authStore";

// Types for better type safety
interface LoginCredentials {
  email: string;
  password: string;
}

interface UserData {
  name?: string;
  email: string;
  password: string;
  // Add other fields as needed
}

interface EateryData {
  name: string;
  location: string;
  owner: string;
  status: string;
  email?: string;
  contact?: string;
  operating_hours?: string;
  // Add other fields as needed
}

// Determine the correct API URL based on environment
const API_URL = import.meta.env.DEV
  ? import.meta.env.VITE_API_URL // Use localhost URL for development
  : `https://${import.meta.env.VITE_API_BASE_URL}`; // Use HTTPS for production

// Create axios instance with proper base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for adding auth tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized errors (token expired)
    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem("auth_token");
      // Use the Zustand store's action to update state
      if (useAuthStore.getState().logout) {
        useAuthStore.getState().logout();
      }
    }

    return Promise.reject(error);
  }
);

// Helper function to handle API errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleApiError = (error: any, defaultMessage: string) => {
  const errorMessage = error.response?.data?.message || defaultMessage;
  console.error(defaultMessage, error);
  throw new Error(errorMessage);
};

// API functions with improved error handling
export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    try {
      return await api.post("/auth/login", credentials);
    } catch (error) {
      return handleApiError(error, "Login failed");
    }
  },

  register: async (userData: UserData) => {
    try {
      return await api.post("/auth/register", userData);
    } catch (error) {
      return handleApiError(error, "Registration failed");
    }
  },

  getCurrentUser: async () => {
    try {
      return await api.get("/auth/me");
    } catch (error) {
      return handleApiError(error, "Failed to fetch user data");
    }
  },

  resetPassword: async (email: string) => {
    try {
      return await api.post("/auth/reset-password", { email });
    } catch (error) {
      return handleApiError(error, "Password reset request failed");
    }
  },

  confirmResetPassword: async (
    userId: string,
    token: string,
    newPassword: string
  ) => {
    try {
      return await api.post(`/auth/reset-password/${userId}/${token}`, {
        newPassword,
      });
    } catch (error) {
      return handleApiError(error, "Password reset failed");
    }
  },
};

export const eateriesAPI = {
  getAll: async () => {
    try {
      return await api.get("/eateries");
    } catch (error) {
      return handleApiError(error, "Failed to fetch eateries");
    }
  },

  getById: async (id: string) => {
    try {
      return await api.get(`/eateries/${id}`);
    } catch (error) {
      return handleApiError(error, `Failed to fetch eatery with ID ${id}`);
    }
  },

  create: async (data: EateryData) => {
    try {
      return await api.post("/eateries", data);
    } catch (error) {
      return handleApiError(error, "Failed to create eatery");
    }
  },

  update: async (id: string, data: Partial<EateryData>) => {
    try {
      return await api.put(`/eateries/${id}`, data);
    } catch (error) {
      return handleApiError(error, `Failed to update eatery with ID ${id}`);
    }
  },

  delete: async (id: string) => {
    try {
      return await api.delete(`/eateries/${id}`);
    } catch (error) {
      return handleApiError(error, `Failed to delete eatery with ID ${id}`);
    }
  },
};

// Add more API modules as needed for your other routes
export const businessAPI = {
  getMenu: async () => {
    try {
      return await api.get("/business/menu");
    } catch (error) {
      return handleApiError(error, "Failed to fetch business menu");
    }
  },

  getOrders: async () => {
    try {
      return await api.get("/business/orders");
    } catch (error) {
      return handleApiError(error, "Failed to fetch business orders");
    }
  },

  // Add other business routes as needed
};

export default api;
