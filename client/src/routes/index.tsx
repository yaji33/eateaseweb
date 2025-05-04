//import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./protectedRoutes";

import Dashboard from "@/pages/dashboard";
import Eateries from "@/pages/admin/eateries/page";
import Login from "@/pages/auth/login";
import LandingPage from "@/pages/public/landing-page/page";
import ResetPassword from "@/pages/auth/reset-password";
import Terms from "@/pages/public/Terms";
import Privacy from "@/pages/public/Privacy";
import Registration from "@/pages/auth/registration";
import BusinessHome from "@/pages/business/home";
import BusinessDashboard from "@/pages/business/dashboard/page";
import BusinessOrders from "@/pages/business/orders/page";
import BusinessMenu from "@/pages/business/menu/page";
import BusinessTransactions from "@/pages/business/transactions/page";
import NotFound from "@/pages/notFound";
import BusinessProfile from "@/pages/business/profile/page";
import BusinessMessages from "@/pages/business/messages/page";
import ResetPasswordForm from "@/pages/auth/reset-password-form";
import AuthenticatedNotFound from "@/pages/auth/authenticated-not-found";
import { useAuthStore } from "@/state/authStore";

const AppRoutes = () => {
  const { user } = useAuthStore();

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Define public routes that should be accessible without authentication
  const publicRoutes = (
    <>
      <Route path="/landing-page" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/reset-password/:userId/:token" element={<ResetPasswordForm />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy-policy" element={<Privacy />} />
      <Route path="/not-found" element={<NotFound />} />
    </>
  );

  // Define routes that require authentication
  const authenticatedRoutes = (
    <>
      <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
      <Route path="/eateries" element={<ProtectedRoute element={<Eateries />} />} />
      <Route path="/business-home" element={<ProtectedRoute element={<BusinessHome />} />} />
      <Route path="/business-dashboard" element={<ProtectedRoute element={<BusinessDashboard />} />} />
      <Route path="/business-orders" element={<ProtectedRoute element={<BusinessOrders />} />} />
      <Route path="/business-menu" element={<ProtectedRoute element={<BusinessMenu />} />} />
      <Route path="/business-transactions" element={<ProtectedRoute element={<BusinessTransactions />} />} />
      <Route path="/business-messages" element={<ProtectedRoute element={<BusinessMessages />} />} />
      <Route path="/business-profile" element={<ProtectedRoute element={<BusinessProfile />} />} />
      <Route path="/authenticated-not-found" element={<ProtectedRoute element={<AuthenticatedNotFound />} />} />
    </>
  );

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/landing-page" replace />} />
      
      {/* Public routes */}
      {publicRoutes}
      
      {/* Authenticated routes */}
      {authenticatedRoutes}
      
      {/* Catch-all route - redirect to appropriate not found page based on authentication status */}
      <Route 
        path="*" 
        element={
          isAuthenticated 
            ? <Navigate to="/authenticated-not-found" replace /> 
            : <Navigate to="/not-found" replace />
        } 
      />
    </Routes>
  );
};

export default AppRoutes;