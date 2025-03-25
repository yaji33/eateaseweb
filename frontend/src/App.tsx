import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useAuthStore } from "./state/authStore";
import SideNav from "./components/admin/sidenav";
import Navbar from "./components/business/navbar";
import "./App.css";
import AppRoutes from "./routes";

function App() {
  const { user } = useAuthStore();

  return (
    <Router>
      <div className="antialiased flex bg-background">
        {user?.role === "admin" && <SideNav />}
        {user?.role === "business" && <Navbar />}
        <main
          className={`min-h-screen w-full bg-background transition-all ${
            user?.role === "admin" ? "ml-56" : ""
          }`}
        >
          <AppRoutes />
        </main>
      </div>
    </Router>
  );
}

export default App;
