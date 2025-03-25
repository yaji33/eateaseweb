import React from "react";
import Logo from "@/assets/logo.png";
import { NavLink } from "react-router-dom";
import ChatIcon from "@/assets/ep_chat-round.svg";
import NotificationIcon from "@/assets/ion_notifications-outline.svg";
import ShopIcon from "@/assets/mac&gab.svg";
import "@/index.css";

function navbar() {
  const navItems = [
    { to: "/business-dashboard", label: "Dashboard" },
    { to: "/business-orders", label: "Orders" },
    { to: "/business-menu", label: "Menu" },
    { to: "/business-transactions", label: "Transactions" },
  ];

  return (
    <nav className="fixed top-0 w-full flex p-1 bg-white shadow-sm px-2 sm:px-8 z-50 justify-between">
      <div className="w-full max-w-5xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img src={Logo} alt="logo" className="w-10" />
          <h1 className="font-bold text-2xl">
            <span className="text-brandPrimary">Eat</span>
            <span className="text-brandSecondary">Ease</span>
          </h1>
        </div>
        <ul className="text-left list-none flex text-md">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 text-black mx-2 rounded-md transition duration-300  ${
                    isActive ? " text-text_active" : "hover:text-text_active "
                  }`
                }
              >
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <button>
            <img src={ChatIcon} alt="chat" className="w-4" />
          </button>
          <button>
            <img src={NotificationIcon} alt="notification" className="w-4" />
          </button>
          <button>
            <img src={ShopIcon} alt="shop" className="w-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default navbar;
