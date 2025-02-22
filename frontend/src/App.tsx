import React from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SideNav from './components/sidenav.tsx';
import './App.css'
import Dashboard from './pages/dashboard.tsx';
import Users from './pages/users/page.tsx';
import Eateries from './pages/eateries/page.tsx';

function App() {
  const showSideNav = true;
  return (
    <>
      <Router>
        <div className="antialiased flex bg-background">
          
          {showSideNav && <SideNav show={showSideNav} />}
          <main className="min-h-screen w-full bg-background">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/eateries" element={<Eateries />} />
            </Routes>
          </main>
        </div>
      </Router>
    </>
  );
}

export default App
