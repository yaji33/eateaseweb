import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useAuthStore } from "./state/authStore.tsx";  
import SideNav from "./components/admin/sidenav.tsx";
import "./App.css";
import Dashboard from "./pages/dashboard.tsx";
import Users from "./pages/admin/users/page.tsx";
import Eateries from "./pages/admin/eateries/page.tsx";
import Login from "./pages/auth/login.tsx"; 
import Registration from "./pages/auth/registration.tsx";

// Protected Route Component
const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
    const { user } = useAuthStore();
    
    if (!user) {
        return <Navigate to="/login" replace />; 
    }

    return element;
};

function App() {
  const { user } = useAuthStore();  

  return (
    <Router>
      <div className="antialiased flex bg-background">
       
        {user && <SideNav show={true} />}

        <main className="min-h-screen w-full bg-background">
          <Routes>
      
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Public Route (Login) */}
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />

            {/* Protected Admin Routes */}
            <Route path="/dashboard"
              element={<ProtectedRoute element={<Dashboard />} />}/>
            <Route
              path="/users"
              element={<ProtectedRoute element={<Users />} />}
            />
            <Route
              path="/eateries"
              element={<ProtectedRoute element={<Eateries />} />}
            />

          
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
