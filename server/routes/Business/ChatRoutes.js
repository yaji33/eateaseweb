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
      const restaurantId = req.user.business_id;

      const chats = await Chat.find({
        restaurant_id: restaurantId,
      })
        .populate("customer_id")
        .populate("restaurant_id")
        .lean();

      const transformedChats = chats.map((chat) => ({
        ...chat,
        messages: chat.messages.map((msg) => ({
          ...msg,
          isRestaurant: msg.sender_id.toString() === restaurantId.toString(),
        })),
      }));

      res.status(200).json({ success: true, chats: transformedChats });
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Send a message from restaurant to customer
router.post("/send", authMiddleware, businessMiddleware, async (req, res) => {
  try {
    const { customer_id, message } = req.body;
    const restaurantId = req.user.business_id;

    if (!message || !customer_id) {
      return res
        .status(400)
        .json({ error: "Message text and customer ID are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(customer_id)) {
      return res.status(400).json({ error: "Invalid customer ID" });
    }

    const customer = await User.findById(customer_id);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    let chat = await Chat.findOne({
      restaurant_id: restaurantId,
      customer_id: customer_id,
    });

    if (!chat) {
      chat = new Chat({
        restaurant_id: restaurantId,
        customer_id: customer_id,
        messages: [],
        last_updated: new Date(),
      });
    }

    const newMessage = {
      sender_id: restaurantId,
      message: message,
      timestamp: new Date(),
      seen: false,
    };

    chat.messages.push(newMessage);
    chat.last_updated = new Date();
    await chat.save();

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
    res.status(500).json({ error: "Server error" });
  }
});

// Get messages for a specific chat (with authorization check)
router.get("/:chatId", authMiddleware, businessMiddleware, async (req, res) => {
  const { chatId } = req.params;
  const restaurantId = req.user.business_id;

  try {
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({ error: "Invalid chat ID" });
    }

    const chat = await Chat.findOne({
      _id: chatId,
      restaurant_id: restaurantId,
    }).populate("customer_id restaurant_id");

    if (!chat) {
      return res.status(404).json({ error: "Chat not found or unauthorized" });
    }

    const transformedChat = {
      ...chat.toObject(),
      messages: chat.messages.map((msg) => ({
        ...msg,
        isRestaurant: msg.sender_id.toString() === restaurantId.toString(),
      })),
    };

    res.status(200).json({ success: true, chat: transformedChat });
  } catch (err) {
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

    try {
      if (!mongoose.Types.ObjectId.isValid(chatId)) {
        return res.status(400).json({ error: "Invalid chat ID" });
      }

      const chat = await Chat.findOne({
        _id: chatId,
        restaurant_id: restaurantId,
      });

      if (!chat) {
        return res
          .status(404)
          .json({ error: "Chat not found or unauthorized" });
      }

      let updated = false;

      chat.messages.forEach((msg) => {
        if (!msg.seen && !msg.sender_id.equals(restaurantId)) {
          msg.seen = true;
          updated = true;
        }
      });

      if (updated) {
        await chat.save();
        const io = req.app.get("io");
        if (io) {
          io.to(`chat_${chatId}`).emit("messagesSeen", {
            chat_id: chatId,
            user_id: restaurantId,
          });
        }
      }

      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;
