import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Server response types
interface ServerMessage {
  sender_id: string;
  message: string;
  timestamp: string;
  seen: boolean;
  isRestaurant?: boolean; // Flag can be added by the server
}

interface ServerChat {
  _id: string;
  customer_id: {
    _id: string;
    fullName?: string;
    email?: string;
    // other customer fields
  };
  restaurant_id: {
    _id: string;
    // other restaurant fields
  };
  messages: ServerMessage[];
  last_updated: string;
}

// Client types
interface Message {
  sender: string;
  text: string;
  time: string;
  isRestaurant: boolean;
}

interface Chat {
  id: string;
  sender: string;
  messages: Message[];
  time: string;
  customerId: string;
  restaurantId: string;
  customerFullName?: string;
}

interface ChatContextType {
  messages: Chat[];
  sendMessage: (text: string) => Promise<void>;
  selectedChat: Chat | null;
  setSelectedChat: (chat: Chat | null) => void;
  loading: boolean;
  error: string | null;
  refreshChats: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMins / 60);
  const diffDays = Math.round(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";

  return date.toLocaleDateString();
};

// Convert server data to client format
const convertServerChatToClientFormat = (serverChat: ServerChat): Chat => {
  // Extract customer data properly
  let customerName, customerId, customerFullName;

  if (
    typeof serverChat.customer_id === "object" &&
    serverChat.customer_id !== null
  ) {
    customerId = serverChat.customer_id._id;
    customerFullName = serverChat.customer_id.fullName;
    customerName =
      customerFullName ||
      serverChat.customer_id.email ||
      `Customer ${customerId.substring(0, 6)}`;
  } else {
    customerId = String(serverChat.customer_id || "");
    customerName = `Customer ${customerId.substring(0, 6)}`;
  }

  // Extract restaurant ID
  const restaurantId =
    typeof serverChat.restaurant_id === "object" &&
    serverChat.restaurant_id !== null
      ? serverChat.restaurant_id._id
      : String(serverChat.restaurant_id || "");

  // Map messages
  const messages: Message[] = Array.isArray(serverChat.messages)
    ? serverChat.messages.map((msg) => {
        return {
          sender: msg.isRestaurant ? "Me" : customerName,
          text: msg.message || "",
          time: formatDate(msg.timestamp),
          isRestaurant: !!msg.isRestaurant, // Use the flag set by the server
        };
      })
    : [];

  return {
    id: serverChat._id,
    sender: customerName,
    messages: messages,
    time: formatDate(serverChat.last_updated),
    customerId: customerId,
    restaurantId: restaurantId,
    customerFullName: customerFullName,
  };
};

export function ChatProvider({ children }: ChatProviderProps) {
  const [messages, setMessages] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChats = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Fetching chats for authenticated restaurant");

      // Get authentication token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      // Note: Our backend now handles auth through middleware
      // and extracts restaurant_id from the JWT token
      const response = await axios.get(`${API_URL}/api/chat/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.success) {
        console.log(
          "Successfully fetched chats. Total chats:",
          response.data.chats?.length || 0
        );

        if (Array.isArray(response.data.chats)) {
          // Convert each chat safely with error handling
          const convertedChats = response.data.chats
            .map((serverChat: ServerChat) => {
              try {
                return convertServerChatToClientFormat(serverChat);
              } catch (convErr) {
                console.error("Error converting chat:", convErr);
                return null;
              }
            })
            .filter(Boolean); // Remove any null entries from conversion errors

          setMessages(convertedChats);

          // If there's a selectedChat, update it with fresh data
          if (selectedChat) {
            const updatedSelectedChat = convertedChats.find(
              (chat: { id: string }) => chat.id === selectedChat.id
            );
            if (updatedSelectedChat) {
              setSelectedChat(updatedSelectedChat);
            }
          }
        } else {
          console.error("Chats data is not an array:", response.data.chats);
          setError("Invalid chat data format");
        }
      } else {
        console.error("Failed to fetch chats:", response.data);
        setError("Failed to fetch chats");
      }
    } catch (err) {
      console.error("Error fetching chats:", err);
      setError("An error occurred while fetching chats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();

    // Set up polling every minute to refresh chats
    const interval = setInterval(fetchChats, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const sendMessage = async (text: string) => {
    if (!selectedChat || !text.trim()) {
      console.log("Cannot send message: Missing required data", {
        hasSelectedChat: !!selectedChat,
        hasText: !!text.trim(),
      });
      return;
    }

    try {
      // Get authentication token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required");
        return;
      }

      const messageData = {
        customer_id: selectedChat.customerId,
        message: text,
      };

      // Restaurant ID comes from auth token, not needed in request body
      const response = await axios.post(
        `${API_URL}/api/chat/send`,
        messageData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data && response.data.success) {
        console.log("Message sent successfully");
        // Refresh chats to get the updated conversation
        await fetchChats();
      } else {
        console.error("Failed to send message");
        setError("Failed to send message");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError("An error occurred while sending message");
    }
  };

  // Mark messages as seen when a chat is selected
  useEffect(() => {
    const markMessagesAsSeen = async () => {
      if (!selectedChat) return;

      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        await axios.put(
          `${API_URL}/api/chat/seen/${selectedChat.id}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Marked messages as seen for chat:", selectedChat.id);
      } catch (err) {
        console.error("Error marking messages as seen:", err);
      }
    };

    if (selectedChat) {
      markMessagesAsSeen();
    }
  }, [selectedChat]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        sendMessage,
        selectedChat,
        setSelectedChat,
        loading,
        error,
        refreshChats: fetchChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
