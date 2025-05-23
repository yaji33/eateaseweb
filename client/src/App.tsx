//import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useAuthStore } from "./state/authStore";
import SideNav from "./components/admin/sidenav";
import Navbar from "./components/business/business-nav";
//import PublicNav from "./components/public/public-nav";
import "./App.css";
import AppRoutes from "./routes";
import { ChatProvider } from "./context/ChatContext";
import { ToastProvider } from "./context/ToastContext";

function App() {
  const { user } = useAuthStore();

  return (
    <ChatProvider>
      <Router>
        <ToastProvider />

        <div className="antialiased flex bg-background">
          {user?.role === "admin" && <SideNav />}
          {user?.role === "business" && <Navbar />}
          <main
            className={`min-h-screen w-full bg-background_1 transition-all ${
              user?.role === "admin" ? "ml-60" : ""
            }`}
          >
            <AppRoutes />
          </main>
        </div>
      </Router>
    </ChatProvider>
  );
}

export default App;
