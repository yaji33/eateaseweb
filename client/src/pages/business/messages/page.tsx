import React, { useState, useEffect } from "react";
import { useChat } from "@/context/ChatContext";
import Search from "@/assets/search 1.svg";
import Send from "@/assets/send.svg";
import Profile from "@/assets/profile.svg";

interface Message {
  sender: string;
  text: string;
  time: string;
}

interface Chat {
  id: number;
  sender: string;
  messages: Message[];
  time: string;
}

export default function Page(): React.ReactElement {
  const { messages, selectedChat, setSelectedChat, sendMessage } = useChat();
  const [messageInput, setMessageInput] = useState<string>("");

  useEffect(() => {
    if (!selectedChat && messages.length > 0) {
      setSelectedChat(messages[0]);
    }
  }, [selectedChat, messages, setSelectedChat]);

  

  const handleSendMessage = (): void => {
  if (!messageInput.trim() || !selectedChat) return;

  const newMessage: Message = {
    sender: "Me",
    text: messageInput,
    time: "Now",
  };
  sendMessage(newMessage);
  setSelectedChat({
    ...selectedChat,
    messages: [...selectedChat.messages, newMessage],
  });
  setMessageInput("");
};


  return (
    <div className="flex w-full max-w-5xl mx-auto flex-col min-h-screen font-poppins px-4 pt-20 gap-4">
      <h1 className="text-xl font-semibold">Chats</h1>
      <div className="flex w-full h-[36rem] border rounded-md bg-white shadow-lg">
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
            {messages.map((chat: Chat) => (
              <div
                key={chat.id}
                className={`flex items-center p-3 rounded-md cursor-pointer transition-all duration-300 ${
                  selectedChat?.id === chat.id
                    ? "bg-gray-100"
                    : "bg-white hover:bg-gray-200"
                }`}
                onClick={() => setSelectedChat(chat)}
              >
                <img
                  src={Profile}
                  alt="Profile"
                  className="rounded-full w-10 h-10 mr-3"
                />
                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">{chat.sender}</span>
                    <span className="text-xs text-gray-400">{chat.time}</span>
                  </div>
                  <span className="text-xs text-gray-600">
                    {chat.messages[chat.messages.length - 1].text}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 relative flex flex-col">
          {selectedChat ? (
            <>
              <div className="flex p-3 border-b items-center gap-3 text-sm font-semibold">
                <img src={Profile} alt="" className="w-8 h-8 rounded-full" />
                <span>{selectedChat.sender}</span>
              </div>
              <div className="flex-1 p-3 overflow-y-auto space-y-2">
                {selectedChat.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.sender === "Me" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className="max-w-xs md:max-w-sm">
                      <div
                        className={`p-3 rounded-lg text-sm shadow-md ${
                          msg.sender === "Me"
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-800"
                        }`}
                      >
                        {msg.text}
                      </div>
                      <div
                        className={`text-xs text-gray-400 mt-1 ${
                          msg.sender === "Me" ? "text-right" : "text-left"
                        }`}
                      >
                        {msg.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-0 w-full p-3 border-t flex items-center">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1 p-3 rounded-lg outline-none bg-background_1 text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  className="ml-3 p-2 rounded-full transition"
                >
                  <img src={Send} alt="Send" className="w-6 h-6" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
