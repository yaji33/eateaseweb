const express = require("express");
const router = express.Router();
const Chat = require("../../models/Business/Chat");
const User = require("../../models/Business/User");
const mongoose = require("mongoose");
const {
  authMiddleware,
  businessMiddleware,
} = require("../../middleware/authMiddleware");

// Get all chats for the authenticated restaurant
router.get(
  "/conversations",
  authMiddleware,
  businessMiddleware,
  async (req, res) => {
    try {
      // The business_id is available from the authMiddleware
      const restaurantId = req.user.business_id;

      console.log(`🔍 Fetching chats for restaurant_id: ${restaurantId}`);

      // Find chats for this restaurant and populate customer information
      const chats = await Chat.find({
        restaurant_id: restaurantId,
      })
        .populate("customer_id")
        .populate("restaurant_id")
        .lean();

      console.log(
        `📊 Found ${chats.length} chats for restaurant_id: ${restaurantId}`
      );

      // Transform chats to ensure isRestaurant flag is set correctly
      const transformedChats = chats.map((chat) => {
        return {
          ...chat,
          messages: chat.messages.map((msg) => ({
            ...msg,
            // Set isRestaurant flag explicitly by comparing sender_id with restaurant_id
            isRestaurant: msg.sender_id.toString() === restaurantId.toString(),
          })),
        };
      });

      res.status(200).json({ success: true, chats: transformedChats });
    } catch (err) {
      console.error("Error fetching conversations:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Add this endpoint to the existing router in paste.txt

// Send a message from restaurant to customer
router.post("/send", authMiddleware, businessMiddleware, async (req, res) => {
  try {
    const { customer_id, message } = req.body;
    const restaurantId = req.user.business_id;

    console.log(
      `📤 Restaurant ${restaurantId} sending message to customer ${customer_id}`
    );

    if (!message || !customer_id) {
      return res
        .status(400)
        .json({ error: "Message text and customer ID are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(customer_id)) {
      return res.status(400).json({ error: "Invalid customer ID" });
    }

    // Check if customer exists
    const customer = await User.findById(customer_id);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Find existing chat between this restaurant and customer
    let chat = await Chat.findOne({
      restaurant_id: restaurantId,
      customer_id: customer_id,
    });

    // If no chat exists, create a new one
    if (!chat) {
      console.log(
        `🆕 Creating new chat between restaurant ${restaurantId} and customer ${customer_id}`
      );
      chat = new Chat({
        restaurant_id: restaurantId,
        customer_id: customer_id,
        messages: [],
        last_updated: new Date(),
      });
    }

    // Add the new message
    const newMessage = {
      sender_id: restaurantId, // Restaurant is the sender
      message: message,
      timestamp: new Date(),
      seen: false, // Messages sent by restaurant start as unseen by customer
    };

    chat.messages.push(newMessage);
    chat.last_updated = new Date();

    await chat.save();
    console.log(`✅ Message saved to chat ${chat._id}`);

    // Emit socket event about new message if socket.io is set up
    const io = req.app.get("io");
    if (io) {
      io.to(`user_${customer_id}`).emit("newMessage", {
        chat_id: chat._id,
        message: {
          ...newMessage,
          isRestaurant: true,
        },
      });
    }

    res.status(200).json({
      success: true,
      chat_id: chat._id,
      message: newMessage,
    });
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get messages for a specific chat (with authorization check)
router.get("/:chatId", authMiddleware, businessMiddleware, async (req, res) => {
  const { chatId } = req.params;
  const restaurantId = req.user.business_id;

  console.log(
    `🔹 Fetching chat ID: ${chatId} for restaurant_id: ${restaurantId}`
  );

  try {
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({ error: "Invalid chat ID" });
    }

    // Only return chat if it belongs to this restaurant
    const chat = await Chat.findOne({
      _id: chatId,
      restaurant_id: restaurantId,
    }).populate("customer_id restaurant_id");

    console.log(
      `✅ Chat fetch result - Found: ${
        chat ? "Yes" : "No"
      }, Restaurant_id: ${restaurantId}, Chat_id: ${chatId}`
    );

    if (!chat) {
      return res.status(404).json({ error: "Chat not found or unauthorized" });
    }

    // Transform the chat to add isRestaurant property for each message
    const transformedChat = {
      ...chat.toObject(),
      messages: chat.messages.map((msg) => ({
        ...msg,
        isRestaurant: msg.sender_id.toString() === restaurantId.toString(),
      })),
    };

    res.status(200).json({ success: true, chat: transformedChat });
  } catch (err) {
    console.error("Error retrieving chat:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Mark messages as seen (with authorization check)
router.put(
  "/seen/:chatId",
  authMiddleware,
  businessMiddleware,
  async (req, res) => {
    const { chatId } = req.params;
    const restaurantId = req.user.business_id;

    console.log(
      `🔹 Marking messages as seen for chat ID: ${chatId}, restaurant_id: ${restaurantId}`
    );

    try {
      if (!mongoose.Types.ObjectId.isValid(chatId)) {
        return res.status(400).json({ error: "Invalid chat ID" });
      }

      // Only update chat if it belongs to this restaurant
      const chat = await Chat.findOne({
        _id: chatId,
        restaurant_id: restaurantId,
      });

      console.log(
        `✅ Found chat for marking messages as seen: ${
          chat ? "Yes" : "No"
        }, Chat_id: ${chatId}`
      );

      if (!chat) {
        return res
          .status(404)
          .json({ error: "Chat not found or unauthorized" });
      }

      let updated = false;

      // Mark messages as seen if they weren't sent by the restaurant
      chat.messages.forEach((msg) => {
        if (!msg.seen && !msg.sender_id.equals(restaurantId)) {
          msg.seen = true;
          updated = true;
        }
      });

      if (updated) {
        await chat.save();
        console.log(
          `📝 Updated seen status for messages in chat ID: ${chatId}`
        );

        // Emit socket event about seen messages if socket.io is set up
        const io = req.app.get("io");
        if (io) {
          io.to(`chat_${chatId}`).emit("messagesSeen", {
            chat_id: chatId,
            user_id: restaurantId,
          });
        }
      } else {
        console.log(
          `ℹ️ No messages needed to be marked as seen in chat ID: ${chatId}`
        );
      }

      res.status(200).json({ success: true });
    } catch (err) {
      console.error("Error updating seen status:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;
