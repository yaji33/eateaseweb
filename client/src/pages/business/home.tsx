import React from "react";
import Banner from "@/assets/home-bg-img.jpg";
import { CheckCircle, Circle } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Home() {
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
        className="relative w-full h-72 rounded-xl bg-cover bg-center shadow-md"
        style={{ backgroundImage: `url(${Banner})` }}
      >
        <div className="absolute inset-0 bg-black opacity-40 rounded-xl"></div>
        <div className="relative z-10 text-white flex flex-col justify-center h-full p-6 gap-2">
          <h1 className="text-3xl sm:text-4xl font-bold">
            Welcome back, Mac & Gab Food Hub!
          </h1>
          <p className="text-sm sm:text-base">
            Let’s make today delicious. Your customers are waiting.
          </p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Get Started
        </h2>
        <ul className="space-y-3">
          {checklist.map((item) => (
            <li key={item.id} className="flex items-center justify-between">
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
                  className="text-sm font-medium bg-gray-200 px-5 py-2 rounded-md"
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
          you’ll track your earnings and activity.
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
