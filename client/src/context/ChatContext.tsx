import { createContext, useContext, useState, ReactNode } from "react";

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

interface ChatContextType {
  messages: Chat[];
  sendMessage: (newMessage: Message) => void;
  selectedChat: Chat | null;
  setSelectedChat: (chat: Chat | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [messages, setMessages] = useState<Chat[]>([
    {
      id: 1,
      sender: "John Doe",
      messages: [
        { sender: "John Doe", text: "Hey, I need help!", time: "10m ago" },
      ],
      time: "10m ago",
    },
    {
      id: 2,
      sender: "Jane Smith",
      messages: [
        {
          sender: "Jane Smith",
          text: "Thanks for your service!",
          time: "1h ago",
        },
      ],
      time: "1h ago",
    },
    {
      id: 3,
      sender: "Karel Jhona Cestina",
      messages: [
        {
          sender: "Karel Jhona Cestina",
          text: "Thanks for your service!",
          time: "1h ago",
        },
      ],
      time: "1h ago",
    },
  ]);

  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  const sendMessage = (newMessage: Message) => {
    if (selectedChat) {
      const updatedChat = {
        ...selectedChat,
        messages: [...selectedChat.messages, newMessage], 
        time: "Now", 
      };

      setMessages((prev) =>
        prev.map((chat) => (chat.id === selectedChat.id ? updatedChat : chat))
      );
    }
  };


  return (
    <ChatContext.Provider
      value={{ messages, sendMessage, selectedChat, setSelectedChat }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
