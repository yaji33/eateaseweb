import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../state/authStore";

const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const { user } = useAuthStore();
  return user ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
