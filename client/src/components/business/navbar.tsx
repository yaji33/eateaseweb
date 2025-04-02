import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "@/assets/logo.png";
import ChatIcon from "@/assets/ep_chat-round.svg";
import NotificationIcon from "@/assets/ion_notifications-outline.svg";
import ShopIcon from "@/assets/mac&gab.svg";
import "@/index.css";

function Navbar() {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const notifRef = useRef(null);
  const chatRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setIsChatOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { to: "/business-dashboard", label: "Dashboard" },
    { to: "/business-orders", label: "Orders" },
    { to: "/business-menu", label: "Menu" },
    { to: "/business-transactions", label: "Transactions" },
  ];

  const handleChatClick = (conversationId) => {
    navigate("/business-messages");
  };

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
          <div className="relative flex" ref={chatRef}>
            <button onClick={() => setIsChatOpen(!isChatOpen)}>
              <img src={ChatIcon} alt="chat" className="w-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            {isChatOpen && (
              <div className="absolute right-0 w-72 bg-white shadow-lg rounded-lg p-4 z-50 mt-5">
                <p className="text-gray-800 font-medium">Messages</p>
                <div className="mt-2 space-y-2">
                  <button
                    className="block w-full text-left p-2 border-b hover:bg-gray-100"
                    onClick={() => handleChatClick(1)}
                  >
                    John Doe
                  </button>
                  <button
                    className="block w-full text-left p-2 border-b hover:bg-gray-100"
                    onClick={() => handleChatClick(2)}
                  >
                    Jane Smith
                  </button>
                </div>
              </div>
            )}
          </div>
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

          <NavLink to="/business-profile">
            <img src={ShopIcon} alt="shop" className="w-5" />
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
