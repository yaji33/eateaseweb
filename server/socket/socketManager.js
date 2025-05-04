const Chat = require("../models/Business/Chat");

const configureSocketIO = (io) => {
  // Keep track of online users
  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // User comes online - store their socket id
    socket.on("userOnline", ({ userId }) => {
      onlineUsers.set(userId, socket.id);
      console.log(`User ${userId} is now online with socket ${socket.id}`);

      // Inform others that this user is online
      socket.broadcast.emit("userStatusChange", { userId, status: "online" });
    });

    // Join user to their specific rooms
    socket.on("joinRooms", ({ userId, rooms }) => {
      console.log(`User ${userId} joining rooms:`, rooms);
      if (Array.isArray(rooms)) {
        rooms.forEach((room) => {
          socket.join(room);
        });
      }
    });

    // Handle new chat message
    socket.on("sendMessage", async (messageData) => {
      try {
        const { chat_id, customer_id, restaurant_id, sender_id, message } =
          messageData;

        // Generate a room ID for this chat
        const roomId = chat_id || `chat_${customer_id}_${restaurant_id}`;

        // Create or update the message in database
        const newMessage = {
          sender_id,
          message,
          timestamp: new Date(),
          seen: false,
        };

        let chat;
        if (chat_id) {
          // Update existing chat
          chat = await Chat.findById(chat_id);
          if (chat) {
            chat.messages.push(newMessage);
            chat.last_updated = new Date();
            await chat.save();
          }
        } else {
          // Create new chat
          chat = new Chat({
            customer_id,
            restaurant_id,
            messages: [newMessage],
            last_updated: new Date(),
          });
          await chat.save();
        }

        if (!chat) {
          console.error("Failed to save message to database");
          return;
        }

        // Emit to all users in this chat room
        io.to(roomId).emit("newMessage", {
          chat_id: chat._id,
          message: newMessage,
          customer_id,
          restaurant_id,
        });

        // Also send notification to the recipient if they're not in the room
        const recipientId =
          sender_id === customer_id ? restaurant_id : customer_id;
        const recipientSocketId = onlineUsers.get(recipientId.toString());

        if (recipientSocketId) {
          io.to(recipientSocketId).emit("messageNotification", {
            chat_id: chat._id,
            sender_id,
            preview:
              message.substring(0, 50) + (message.length > 50 ? "..." : ""),
          });
        }
      } catch (error) {
        console.error("Error handling message:", error);
        socket.emit("errorEvent", { message: "Failed to send message" });
      }
    });

    // Handle typing indicator
    socket.on("typing", ({ chat_id, user_id, isTyping }) => {
      socket.to(chat_id).emit("userTyping", { chat_id, user_id, isTyping });
    });

    // Mark messages as seen
    socket.on("markSeen", async ({ chat_id, user_id }) => {
      try {
        const chat = await Chat.findById(chat_id);
        if (chat) {
          let updated = false;

          chat.messages.forEach((msg) => {
            if (!msg.seen && msg.sender_id.toString() !== user_id) {
              msg.seen = true;
              updated = true;
            }
          });

          if (updated) {
            await chat.save();
            // Notify others that messages have been seen
            socket.to(chat_id).emit("messagesSeen", { chat_id, user_id });
          }
        }
      } catch (error) {
        console.error("Error marking messages as seen:", error);
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);

      // Find and remove the disconnected user
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          io.emit("userStatusChange", { userId, status: "offline" });
          console.log(`User ${userId} is now offline`);
          break;
        }
      }
    });
  });
};

// Export the function
module.exports = configureSocketIO;
