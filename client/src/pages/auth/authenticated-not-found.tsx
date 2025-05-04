import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/state/authStore";

const AuthenticatedNotFound = () => {
  const { user } = useAuthStore();

  const getDashboardLink = () => {
    if (!user) return "/dashboard";

    switch (user.role) {
      case "admin":
        return "/dashboard";
      case "business":
        return "/business-home";
      default:
        return "/dashboard";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="text-center max-w-lg">
          <h1 className="text-9xl font-bold text-red-600">404</h1>
          <h2 className="text-3xl font-semibold text-gray-900 mt-4 mb-6">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <div className="space-y-4">
            <Link
              to={getDashboardLink()}
              className="inline-block px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthenticatedNotFound;
