import React, { useState } from "react";
import Search from "@/assets/search 1.svg";
import Send from "@/assets/send.svg";
import Profile from "@/assets/profile.svg";

const chats = [
  {
    id: 1,
    name: "Karel Jhona Cestina",
    message: "Hey, I need help with my order.",
    timestamp: "10:30 AM",
  },
  {
    id: 2,
    name: "John Doe",
    message: "Hey, I need help with my order.",
    timestamp: "10:30 AM",
  },
  {
    id: 3,
    name: "John Doe",
    message: "Hey, I need help with my order.",
    timestamp: "10:30 AM",
  },
];

export default function Page() {
  const [selectedChatId, setSelectedChatId] = useState(null);

  const handleChatClick = (id) => {
    setSelectedChatId(id);
  };

  return (
    <div className="flex w-full max-w-5xl mx-auto flex-col min-h-screen bg-background_1 font-poppins px-4 pt-20 gap-4">
      <h1 className="text-xl font-semibold">Chats</h1>
      <div className="flex w-full h-[36rem] border rounded-md bg-white">
        <div className="flex flex-col w-1/3 border-r">
          <div className="flex items-center gap-2 bg-background_1 p-3 m-3 rounded-md">
            <img src={Search} alt="search icon" />
            <input
              type="text"
              placeholder="Search"
              className="border-none text-sm outline-none focus:ring-0 focus:border-transparent shadow-none bg-transparent flex-1"
            />
          </div>

          <div className="flex flex-col p-3 space-y-3 overflow-y-auto flex-grow">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${
                  selectedChatId === chat.id
                    ? "bg-background_1"
                    : "bg-white hover:bg-gray-200"
                }`}
                onClick={() => handleChatClick(chat.id)}
              >
                <img
                  src={Profile}
                  alt="Profile"
                  className="rounded-full mr-3"
                />
                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">{chat.name}</span>
                    <span className="text-xs text-gray-400">
                      {chat.timestamp}
                    </span>
                  </div>
                  <span className="text-xs text-gray-600">{chat.message}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 relative flex flex-col">
          <div className="flex p-2 px-4 border-b items-center gap-3 text-sm font-semibold">
            <img src={Profile} alt="" />
            <span>Karel Jhona Cestina</span>
          </div>
          <div className="flex-1 p-3 overflow-y-auto">
            <div>Chat messages go here...</div>
          </div>
          <div className="absolute bottom-0 w-full p-3 border-t flex items-center">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 p-3 rounded-md outline-none bg-background_1 text-xs"
            />
            <button className="px-4 py-2 text-white rounded-md">
              <img src={Send} alt="" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
