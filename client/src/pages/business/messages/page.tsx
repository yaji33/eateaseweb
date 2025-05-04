import React, { useState, useEffect, useRef } from "react";
import { useChat } from "@/context/ChatContext";
import Search from "@/assets/search.svg";
import Send from "@/assets/send.svg";
import Profile from "@/assets/user1.svg";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Simple component for truncating text with ellipsis
const TruncatedText = ({
  text,
  maxLength,
}: {
  text: string;
  maxLength: number;
}) => {
  if (!text) return null;
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

export default function ChatPage(): React.ReactElement {
  const {
    messages,
    selectedChat,
    setSelectedChat,
    sendMessage,
    loading,
    error,
    refreshChats,
  } = useChat();

  const [messageInput, setMessageInput] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [businessProfile, setBusinessProfile] = useState<string | null>(null);

  useEffect(() => {
    // Fetch business profile data
    const fetchBusinessProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No authentication token found");
          return;
        }

        const response = await axios.get(
          `${API_URL}/api/restaurants/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBusinessProfile(response.data.business_profile);
      } catch (error) {
        console.error("Failed to fetch business profile:", error);
      }
    };

    fetchBusinessProfile();
  }, []);

  useEffect(() => {
    // Auto-select first chat if none selected
    if (!selectedChat && messages.length > 0) {
      setSelectedChat(messages[0]);
    }
  }, [messages, setSelectedChat, selectedChat]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChat?.messages]);

  const handleSendMessage = async (): Promise<void> => {
    if (!messageInput.trim() || !selectedChat) return;

    await sendMessage(messageInput);
    setMessageInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Filter chats based on search term
  const filteredChats = messages.filter(
    (chat) =>
      chat.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.messages.some((msg) =>
        msg.text.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto h-screen px-4 pt-20 font-poppins">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Customer Conversations</h1>
        <button
          onClick={refreshChats}
          className="text-sm text-blue-500 hover:text-blue-700"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex flex-1 w-full rounded-md shadow-lg border overflow-hidden my-5 bg-white">
        {/* Conversation List */}
        <div className="flex flex-col w-full max-w-xs border-r">
          <div className="flex items-center gap-2 bg-gray-100 p-3 m-3 rounded-md">
            <img src={Search} alt="search icon" className="w-5 h-5" />
            <input
              type="text"
              placeholder="Search conversations"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 text-sm bg-transparent border-none outline-none"
            />
          </div>

          <div className="h-[calc(100%-60px)] p-3 space-y-3 overflow-y-auto">
            {loading && filteredChats.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                Loading conversations...
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                {searchTerm
                  ? "No conversations match your search"
                  : "No conversations yet"}
              </div>
            ) : (
              filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`flex items-center p-3 rounded-md cursor-pointer transition-colors ${
                    selectedChat?.id === chat.id
                      ? "bg-blue-100"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedChat(chat)}
                >
                  <img
                    src={Profile}
                    alt="Customer"
                    className="w-10 h-10 mr-3 rounded-full"
                  />
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-sm truncate max-w-[70%]">
                        <TruncatedText text={chat.sender} maxLength={25} />
                      </span>
                      <span className="text-xs text-gray-400">{chat.time}</span>
                    </div>
                    <div className="text-xs text-gray-600 truncate">
                      {chat.messages.length > 0 ? (
                        <TruncatedText
                          text={chat.messages[chat.messages.length - 1].text}
                          maxLength={30}
                        />
                      ) : (
                        "No messages"
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {selectedChat ? (
            <>
              <div className="flex items-center gap-3 p-4 border-b">
                <img
                  src={Profile}
                  alt="Customer"
                  className="w-8 h-8 rounded-full"
                />
                <span className="font-medium">{selectedChat.sender}</span>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {selectedChat.messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  selectedChat.messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.isRestaurant ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!msg.isRestaurant && (
                        <img
                          src={Profile}
                          alt="Customer"
                          className="w-8 h-8 rounded-full mr-2 self-end "
                        />
                      )}

                      <div className="max-w-[70%]">
                        <div
                          className={`p-3 rounded-lg text-sm ${
                            msg.isRestaurant
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {msg.text}
                        </div>
                        <div
                          className={`text-xs text-gray-400 mt-1 ${
                            msg.isRestaurant ? "text-right" : "text-left"
                          }`}
                        >
                          {msg.time}
                        </div>
                      </div>

                      {msg.isRestaurant && (
                        <img
                          src={businessProfile || Profile}
                          alt="Restaurant"
                          className="w-8 h-8 rounded-full ml-2 self-end object-cover bg-gray-200"
                        />
                      )}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t p-3 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 p-3 rounded-lg bg-gray-100 text-sm outline-none"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || loading}
                  className={`rounded-full p-2 ${
                    !messageInput.trim() || loading
                      ? " cursor-not-allowed"
                      : "hover:bg-blue-700"
                  }`}
                >
                  <img src={Send} alt="Send" className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-center p-4">
              {messages.length > 0
                ? "Select a conversation to start messaging"
                : "No conversations available. When customers message you, they will appear here."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
