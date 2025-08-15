const express = require("express");
const Restaurant = require("../../models/Admin/Restaurants");
const {
  authMiddleware,
  adminMiddleware,
} = require("../../middleware/authMiddleware");
const sendEmail = require("../../utility/sendEmail");

const router = express.Router();

// Get all restaurants (admin only)
router.get(
  "/restaurants",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const restaurants = await Restaurant.find(
        {},
        {
          name: 1,
          owner_name: 1,
          address: 1,
          contact: 1,
          email: 1,
          operating_hours: 1,
          status: 1,
          created_at: 1,
        }
      ).sort({ created_at: -1 });

      res.json(restaurants);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Update restaurant status (admin only)
router.put(
  "/restaurants/:id/status",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (status === undefined) {
        return res.status(400).json({ error: "Status is required" });
      }

      const restaurantCheck = await Restaurant.findById(id);
      if (!restaurantCheck) {
        return res.status(404).json({ error: "Restaurant not found" });
      }

      const restaurant = await Restaurant.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      // Notify via Socket.IO
      const io = req.app.get("io");
      io.emit("restaurantStatusUpdated", {
        id: restaurant._id,
        status: restaurant.status,
      });

      // Prepare status info
      const statusMap = {
        0: "Pending",
        1: "Active",
        2: "Launched",
        3: "Banned",
      };
      const statusMessage = statusMap[status] ?? String(status);

      const statusDescriptions = {
        1: "Your restaurant registration is currently under review. We'll notify you once it's approved.",
        2: "Congratulations! Your restaurant has been approved and is now active on our platform.",
        3: "We regret to inform you that your restaurant registration has been banned due to policy violations. Please contact support for more information.",
      };
      const statusDescription = statusDescriptions[status] || "";

      // Send email if all required fields are present
      if (restaurant.name && restaurant.owner_name && restaurant.email) {
        await sendEmail({
          to: restaurant.email,
          subject: `Your Restaurant's Status Update - ${statusMessage}`,
          text:
            `Hi ${restaurant.owner_name},\n\n` +
            `We wanted to inform you that the status of your restaurant registration for ${restaurant.name} has been updated to ${statusMessage}.\n\n` +
            `${statusDescription}\n\n` +
            `Best regards,\nThe EatEase Team`,
          html:
            `<p>Hi ${restaurant.owner_name},</p>` +
            `<p>The status of your restaurant registration for <strong>${restaurant.name}</strong> has been updated to <strong>${statusMessage}</strong>.</p>` +
            `<p>${statusDescription}</p>` +
            `<p>Best regards,<br>The EatEase Team</p>`,
        });
      }

      res.json(restaurant);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get single restaurant by ID (admin only)
router.get(
  "/restaurants/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      const restaurant = await Restaurant.findById(id);

      if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
      }

      res.json(restaurant);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
