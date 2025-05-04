import React, { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";

export default function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleClickOutside = (event: { target: any }) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 relative">
        <Bell className="w-6 h-6 text-gray-700 hover:text-black" />
        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>

      {isOpen && (
        <div
          ref={modalRef}
          className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg p-4 z-50"
        >
          <p className="text-gray-800 font-medium">Notifications</p>
          <div className="mt-2 space-y-2">
            <div className="p-2 border-b">📢 New order received!</div>
            <div className="p-2 border-b">⚡ Payment confirmed!</div>
            <div className="p-2">✅ Order delivered successfully!</div>
          </div>
        </div>
      )}
    </div>
  );
}
