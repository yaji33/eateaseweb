import React from "react";

export default function Page() {
  return (
    <div className="flex w-full max-w-5xl mx-auto flex-col min-h-screen bg-background font-poppins px-4 pt-20 gap-4">
      <h1 className="text-xl font-semibold">Chats</h1>
      <div className="flex w-full gap-4 h-[calc(100vh-9rem)]">
        <div className="w-1/3 bg-gray-200 p-4 rounded-lg h-full">List</div>
        <div className="w-2/3 bg-gray-200 p-4 rounded-lg h-full">Messages</div>
      </div>
    </div>
  );
}
