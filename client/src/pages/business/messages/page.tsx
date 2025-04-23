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
    <div className="flex flex-col w-full max-w-5xl mx-auto min-h-screen px-4 pt-20 font-poppins ">
      <h1 className="text-xl font-semibold mb-4">Chats</h1>
      <div className="flex flex-1 w-full rounded-md shadow-lg border overflow-hidden my-5 bg-white min-h-[500px] h-[calc(100vh-8rem)]">
        <div className="flex flex-col w-full max-w-xs border-r">
          <div className="flex items-center gap-2 bg-background_1 p-3 m-3 rounded-md">
            <img src={Search} alt="search icon" />
            <input
              type="text"
              placeholder="Search"
              className="flex-1 text-sm bg-transparent border-none outline-none"
            />
          </div>
          <div className="flex-1 p-3 space-y-3 overflow-y-auto">
            {messages.map((chat: Chat) => (
              <div
                key={chat.id}
                className={`flex items-center p-3 rounded-md cursor-pointer ${
                  selectedChat?.id === chat.id
                    ? "bg-gray-100"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => setSelectedChat(chat)}
              >
                <img
                  src={Profile}
                  alt="Profile"
                  className="w-10 h-10 mr-3 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm">{chat.sender}</span>
                    <span className="text-xs text-gray-400">{chat.time}</span>
                  </div>
                  <span className="text-xs text-gray-600 truncate">
                    {chat.messages[chat.messages.length - 1].text}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col relative">
          {selectedChat ? (
            <>
              <div className="flex items-center gap-3 p-3 border-b text-sm font-semibold">
                <img src={Profile} alt="" className="w-8 h-8 rounded-full" />
                <span>{selectedChat.sender}</span>
              </div>
              <div className="flex-1 p-4 overflow-y-auto space-y-2">
                {selectedChat.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.sender === "Me" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className="max-w-[80%] md:max-w-md">
                      <div
                        className={`p-3 rounded-lg text-sm shadow-md ${
                          msg.sender === "Me"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-800"
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
              <div className="border-t p-3 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1 p-3 rounded-lg bg-background_1 text-sm outline-none"
                />
                <button onClick={handleSendMessage}>
                  <img src={Send} alt="Send" className="w-6 h-6" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
