import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./protectedRoutes";

import Dashboard from "@/pages/dashboard";
import Users from "@/pages/admin/users/page";
import Eateries from "@/pages/admin/eateries/page";
import Login from "@/pages/auth/login";
import Registration from "@/pages/auth/registration";
import BusinessHome from "@/pages/business/home";
import BusinessDashboard from "@/pages/business/dashboard/page";
import BusinessOrders from "@/pages/business/orders/page";
import BusinessMenu from "@/pages/business/menu/page";
import BusinessTransactions from "@/pages/business/transactions/page";
import BusinessProfile from "@/pages/business/profile/page";
import BusinessMessages from "@/pages/business/messages/page";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registration" element={<Registration />} />
      <Route
        path="/dashboard"
        element={<ProtectedRoute element={<Dashboard />} />}
      />
      <Route path="/users" element={<ProtectedRoute element={<Users />} />} />
      <Route
        path="/eateries"
        element={<ProtectedRoute element={<Eateries />} />}
      />
      <Route
        path="/business-home"
        element={<ProtectedRoute element={<BusinessHome />} />}
      />
      <Route
        path="/business-dashboard"
        element={<ProtectedRoute element={<BusinessDashboard />} />}
      />
      <Route
        path="/business-orders"
        element={<ProtectedRoute element={<BusinessOrders />} />}
      />
      <Route
        path="/business-menu"
        element={<ProtectedRoute element={<BusinessMenu />} />}
      />
      <Route
        path="/business-transactions"
        element={<ProtectedRoute element={<BusinessTransactions />} />}
      />
      <Route
        path="/business-profile"
        element={<ProtectedRoute element={<BusinessProfile />} />}
      />
      <Route
        path="/business-messages"
        element={<ProtectedRoute element={<BusinessMessages />} />}
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
