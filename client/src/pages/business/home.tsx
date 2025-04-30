import React, { useState, useEffect } from "react";
import Banner from "@/assets/home-bg-img.jpg";
import axios from "axios";
import { CheckCircle, Circle, ChevronRight } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Home() {
  const [businessName, setBusinessName] = useState<string | null>(null);
  const [bannerHovered, setBannerHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchBusinessName = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No authentication token found");
          return;
        }

        const response = await axios.get(
          "http://localhost:5001/api/restaurants/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBusinessName(response.data.name);
      } catch (error) {
        console.error("Failed to fetch business profile image:", error);
      }
    };

    fetchBusinessName();
  }, []); // Added empty dependency array to prevent continuous fetching

  const handleMouseMove = (e)  => {
    const banner = e.currentTarget;
    const rect = banner.getBoundingClientRect();

    // Calculate relative position within the banner
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setMousePosition({ x, y });
  };

  const checklist = [
    {
      id: 1,
      label: "Complete your profile",
      done: false,
      link: "/business-profile",
    },
    {
      id: 2,
      label: "Add your first menu item",
      done: false,
      link: "/business-menu",
    },
    {
      id: 3,
      label: "Verify your business",
      done: false,
      link: "/business-profile",
    },
  ];

  return (
    <div className="flex w-full max-w-5xl mx-auto flex-col min-h-screen font-poppins px-4 pt-20 gap-6">
      <div
        className="relative w-full h-72 rounded-xl bg-cover bg-center shadow-md overflow-hidden transition-all duration-300"
        style={{
          backgroundImage: `url(${Banner})`,
          backgroundPosition: bannerHovered
            ? `${50 + (mousePosition.x - 50) * 0.05}% ${
                50 + (mousePosition.y - 50) * 0.05
              }%`
            : "50% 50%",
          transform: bannerHovered ? "scale(1.02)" : "scale(1)",
          boxShadow: bannerHovered
            ? "0 10px 30px rgba(0, 0, 0, 0.2)"
            : "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
        onMouseEnter={() => setBannerHovered(true)}
        onMouseLeave={() => setBannerHovered(false)}
        onMouseMove={handleMouseMove}
      >
        <div className="absolute inset-0 bg-black opacity-40 rounded-xl"></div>
        {bannerHovered && (
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-white to-transparent opacity-10"></div>
              <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white to-transparent opacity-10"></div>
              <div className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-white to-transparent opacity-10"></div>
              <div className="absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-white to-transparent opacity-10"></div>
            </div>
          </div>
        )}
        <div
          className="relative z-10 text-white flex flex-col justify-center h-full p-6 gap-2 transition-all duration-300"
          style={{
            transform: bannerHovered ? "translateY(-4px)" : "translateY(0px)",
          }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold transition-all duration-300">
            Welcome back, {businessName || "..."}!
          </h1>
          <p className="text-sm sm:text-base transition-all duration-300 max-w-md">
            Let's make today delicious. Your customers are waiting.
          </p>
          {bannerHovered && (
            <button className="flex items-center gap-1 text-sm font-medium bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm mt-4 px-4 py-2 rounded-md w-fit transition-all duration-300">
              <span>Go to Dashboard</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Get Started
        </h2>
        <ul className="space-y-3">
          {checklist.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                {item.done ? (
                  <CheckCircle className="text-green-600 w-5 h-5" />
                ) : (
                  <Circle className="text-gray-400 w-5 h-5" />
                )}
                <span className="text-gray-800">{item.label}</span>
              </div>
              {!item.done && (
                <NavLink
                  to={item.link}
                  className="text-sm font-medium bg-gray-200 hover:bg-gray-300 px-5 py-2 rounded-md transition-colors duration-200"
                >
                  Complete
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-gray-50 p-6 rounded-lg border border-dashed border-gray-300 shadow-inner">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          What you'll see on your dashboard
        </h2>
        <p className="text-gray-500 text-sm mb-4">
          Once your business is live and customers start ordering, this is where
          you'll track your earnings and activity.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-40 pointer-events-none">
          <div className="bg-white rounded-md p-6 shadow-sm text-center">
            <p className="text-3xl font-semibold text-gray-700">₱ ---,---</p>
            <p className="text-gray-500">Revenue</p>
          </div>
          <div className="bg-white rounded-md p-6 shadow-sm text-center">
            <p className="text-3xl font-semibold text-gray-700">---</p>
            <p className="text-gray-500">Orders</p>
          </div>
        </div>
      </div>
    </div>
  );
}
