import React from "react";
import "../index.css";
import { NavLink } from "react-router-dom";
import Logo from "../assets/logo.png";
import Dashboard_logo from "../assets/dashboard.svg";
import Users_logo from "../assets/user.svg";
import Eateries_logo from "../assets/eatery.svg";


const SideNav = () => {
  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: Dashboard_logo },
    { to: "/users", label: "Users", icon: Users_logo },
    { to: "/eateries", label: "Eateries", icon: Eateries_logo },
  ];

  return (
    <nav className="bg-white min-h-screen w-72 flex flex-col shadow-md z-10 font-poppins">
      <div className="flex items-center mx-2 my-3">
        <img src={Logo} alt="logo" className="w-12" />
        <h1 className="font-bold text-2xl ">
          <span className="text-color_eat">Eat</span>
          <span className="text-color_ease">Ease</span>
        </h1>
      </div>

      <ul className="text-left list-none flex flex-col space-y-2 text-md mt-8 w-full">
        {navItems.map((item) => (
          <li key={item.to} className="">
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 text-black mx-2 rounded-md transition duration-300  ${
                  isActive
                    ? "bg-active_bg text-text_active"
                    : "hover:bg-active_bg hover:text-black"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <img
                    src={item.icon}
                    alt={item.label}
                    className={`w-5 h-5 mx-1 ${isActive ? "icon-active" : ""}`}
                  />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SideNav;
