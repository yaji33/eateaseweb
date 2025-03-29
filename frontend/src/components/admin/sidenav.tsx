import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/state/authStore";
import Logo from "@/assets/logo.png";
import DashboardIcon from "@/assets/layout-dashboard.svg";
import UsersIcon from "@/assets/users-round.svg";
import EateriesIcon from "@/assets/utensils-crossed.svg";
import LogoutIcon from "@/assets/log-out.svg";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const SideNav = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: DashboardIcon },
    { to: "/users", label: "Users", icon: UsersIcon },
    { to: "/eateries", label: "Eateries", icon: EateriesIcon },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white h-screen w-60 flex flex-col shadow-sm z-10 font-poppins overflow-hidden fixed">
      <div className="flex items-center mx-2 my-3">
        <img src={Logo} alt="logo" className="w-12" />
        <h1 className="font-bold text-2xl">
          <span className="text-brandPrimary">Eat</span>
          <span className="text-brandSecondary">Ease</span>
        </h1>
      </div>
      <ul className="text-left list-none flex flex-col space-y-2 text-md mt-8 flex-grow">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 text-black mx-2 rounded-md transition duration-300 ${
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

      <div className="mb-4 mx-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="flex items-center gap-3 px-3 py-2 w-full hover:bg-red-100 rounded-md transition duration-300 ">
              <img src={LogoutIcon} alt="Logout" className="w-5 h-5 mx-1" />
              <span>Logout</span>
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to logout?
              </AlertDialogTitle>
              <AlertDialogDescription>
                You will be logged out of your account and redirected to the
                login page.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLogout}
                className="bg-activeBackgroundDark"
              >
                Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </nav>
  );
};

export default SideNav;
