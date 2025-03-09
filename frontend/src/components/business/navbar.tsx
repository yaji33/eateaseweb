import React from "react";
import Logo from "@/assets/logo.png";
import { NavLink } from "react-router-dom";
import "@/index.css";

function navbar() {
  const navItems = [
    { to: "/business-dashboard", label: "Dashboard" },
    { to: "/business-orders", label: "Users" },
    { to: "/business-menu", label: "Eateries" },
    { to: "/business-transactions", label: "Transactions" },
  ];

  return (
    <nav className="fixed top-0 w-full flex p-3 bg-white shadow-sm px-2 sm:px-8 z-50 justify-between">
      <div className="w-full max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img src={Logo} alt="logo" className="w-10" />
          <h1 className="font-bold text-2xl">
            <span className="text-color_eat">Eat</span>
            <span className="text-color_ease">Ease</span>
          </h1>
        </div>
        <ul className="text-left list-none flex">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 text-black mx-2 rounded-md transition duration-300  ${
                    isActive
                      ? " text-text_active"
                      : "hover:text-text_active "
                  }`
                }
              >
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <button>1</button>
          <button>2</button>
          <button>3</button>
        </div>
      </div>
    </nav>
  );
}

export default navbar;
