import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthStore } from "./state/authStore";

import Login from "@/pages/auth/login";
import Registration from "@/pages/auth/registration";


function Routes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} /> 
      </Routes>
    </Router>
  );
}

export default Routes
