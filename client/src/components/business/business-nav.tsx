import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
//import { useChat } from "@/context/ChatContext";
import axios from "axios";
import Logo from "@/assets/logo.png";
//import ChatIcon from "@/assets/ep_chat-round.svg";
import ChatIcon1 from "@/assets/chat1.svg";
import NotificationIcon from "@/assets/ion_notifications-outline.svg";
import { logoutUser } from "@/services/authService";
import { useAuthStore } from "@/state/authStore";
import ProfileIcon from "@/assets/user1.svg";
import SignOut from "@/assets/log-out.svg";
import "@/index.css";

function Navbar() {
  const { user } = useAuthStore();
  //const { messages, setSelectedChat } = useChat();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const [businessProfile, setBusinessProfile] = useState(null);

  //if (loading) return null;
  if (!user || user.role !== "business") return null;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setIsNotifOpen(false);
      }
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setIsChatOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    const fetchBusinessProfile = async () => {
      try {
        // Get the auth token from localStorage
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No authentication token found");
          return;
        }

        // Make a direct API call to get the restaurant profile
        const response = await axios.get(
          "http://localhost:5001/api/restaurants/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Set the business profile image from the correct field
        setBusinessProfile(response.data.business_profile);
      } catch (error) {
        console.error("Failed to fetch business profile image:", error);
      }
    };

    fetchBusinessProfile();
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { to: "/business-dashboard", label: "Dashboard" },
    { to: "/business-orders", label: "Orders" },
    { to: "/business-menu", label: "Menu" },
    { to: "/business-transactions", label: "Transactions" },
  ];

  const handleChatClick = () => {
    //setSelectedChat(chat);
    navigate("/business-messages");
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setIsProfileOpen(false);
      setIsMobileMenuOpen(false);
      navigate("/login?logout=true");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleViewProfile = () => {
    navigate("/business-profile");
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 w-full flex p-2 bg-white shadow-sm px-2 sm:px-8 z-50 justify-between">
      <div className="w-full max-w-5xl mx-auto flex justify-between items-center">
        <NavLink to="/business-home" className="flex items-center gap-2">
          <img src={Logo} alt="logo" className="w-10" />
          <h1 className="font-bold text-2xl">
            <span className="text-brandPrimary">Eat</span>
            <span className="text-brandSecondary">Ease</span>
          </h1>
        </NavLink>

        {/* Desktop Navigation */}
        <ul className="text-left list-none hidden md:flex text-md">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 text-black mx-2 rounded-md transition duration-300 ${
                    isActive ? "text-text_active" : "hover:text-text_active"
                  }`
                }
              >
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex gap-4 items-center relative">
          {/* Hamburger Menu Button (Mobile Only) */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-6 h-6"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span
              className={`bg-gray-800 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                isMobileMenuOpen
                  ? "rotate-45 translate-y-1"
                  : "-translate-y-0.5"
              }`}
            ></span>
            <span
              className={`bg-gray-800 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
                isMobileMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            ></span>
            <span
              className={`bg-gray-800 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                isMobileMenuOpen
                  ? "-rotate-45 -translate-y-1"
                  : "translate-y-0.5"
              }`}
            ></span>
          </button>

          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative flex"
            >
              <img src={NotificationIcon} alt="notification" className="w-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            {isNotifOpen && (
              <div className="absolute right-0 w-72 bg-white shadow-lg rounded-lg p-4 z-50">
                <p className="text-gray-800 font-medium">Notifications</p>
                <div className="mt-2 space-y-2">
                  <div className="p-2 border-b">📢 New order received!</div>
                  <div className="p-2 border-b">⚡ Payment confirmed!</div>
                  <div className="p-2">✅ Order delivered successfully!</div>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="focus:outline-none"
            >
              {businessProfile ? (
                <img
                  src={businessProfile}
                  alt="Business Profile"
                  className="w-5 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-600 text-xs">BP</span>
                </div>
              )}
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-44 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <button
                  onClick={handleViewProfile}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex"
                >
                  <img
                    src={ProfileIcon}
                    alt="Profile"
                    className="w-4 inline-block mr-3"
                  />
                  Profile
                </button>
                <button
                  onClick={handleChatClick}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex"
                >
                  <img
                    src={ChatIcon1}
                    alt="Messages"
                    className="w-4 inline-block mr-3"
                  />
                  Messages
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex"
                >
                  <img
                    src={SignOut}
                    alt="Logout"
                    className="w-4 inline-block mr-3"
                  />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="absolute top-14 left-0 right-0 bg-white shadow-lg z-40 md:hidden"
        >
          <ul className="py-2">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-2 text-black transition duration-300 ${
                      isActive
                        ? "bg-gray-100 text-text_active"
                        : "hover:bg-gray-50 hover:text-text_active"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
