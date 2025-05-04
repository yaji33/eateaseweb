const express = require("express");
const Restaurant = require("../../models/Admin/Restaurants");
const {
  authMiddleware,
  adminMiddleware,
} = require("../../middleware/authMiddleware");
const router = express.Router();
const sendEmail = require("../../utility/sendEmail");

router.get(
  "/restaurants",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      // Fixed projection - either include all fields we want or exclude unwanted fields
      // Option 1: Include specific fields (FIXED)
      const restaurants = await Restaurant.find(
        {},
        {
          name: 1,
          owner_name: 1,
          address: 1,
          contact: 1,
          email: 1,
          operating_hours: 1,
          status: 1, // Changed from 0 to 1 to include this field
          created_at: 1,
        }
      ).sort({ created_at: -1 });

      // Option 2: Alternative approach - exclude fields you don't want
      // const restaurants = await Restaurant.find({}).select("-field_to_exclude").sort({ created_at: -1 });

      res.json(restaurants);
    } catch (error) {
      console.error("Error fetching restaurants for admin:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

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

      console.log("Restaurant data:", {
        id: restaurant._id,
        name: restaurant.name,
        owner_name: restaurant.owner_name,
        email: restaurant.email,
        status: restaurant.status,
      });

      const io = req.app.get("io");
      io.emit("restaurantStatusUpdated", {
        id: restaurant._id,
        status: restaurant.status,
      });

      const statusMessage =
        status === 0
          ? "Pending"
          : status === 1
          ? "Active"
          : status === 2
          ? "Launched"
          : status === 3
          ? "Banned"
          : `${status}`;

      let statusDescription = "";
      if (status === 1) {
        statusDescription =
          "Your restaurant registration is currently under review. We'll notify you once it's approved.";
      } else if (status === 2) {
        statusDescription =
          "Congratulations! Your restaurant has been approved and is now active on our platform.";
      } else if (status === 3) {
        statusDescription =
          "We regret to inform you that your restaurant registration has been banned due to policy violations. Please contact support for more information.";
      }

      if (restaurant.name && restaurant.owner_name && restaurant.email) {
        await sendEmail({
          to: restaurant.email,
          subject: `Your Restaurant's Status Update - ${statusMessage}`,
          text:
            `Hi ${restaurant.owner_name},\n\n` +
            `We wanted to inform you that the status of your restaurant registration for ${restaurant.name} has been updated to ${statusMessage}.\n\n` +
            `${statusDescription}\n\n` +
            `Thank you for your patience, and please let us know if you have any questions.\n\n` +
            `Best regards,\nThe EatEase Team`,
          html:
            `<p>Hi ${restaurant.owner_name},</p>` +
            `<p>We wanted to inform you that the status of your restaurant registration for <strong>${restaurant.name}</strong> has been updated to <strong>${statusMessage}</strong>.</p>` +
            `<p>${statusDescription}</p>` +
            `<p>Thank you for your patience, and please let us know if you have any questions.</p>` +
            `<p>Best regards,<br>The EatEase Team</p>`,
        });
        console.log("Email sent successfully to:", restaurant.email);
      } else {
        console.warn("Skipping email — missing name, owner_name, or email:", {
          name: restaurant.name,
          owner_name: restaurant.owner_name,
          email: restaurant.email,
        });
      }

      res.json(restaurant);
    } catch (error) {
      console.error("Error updating restaurant status:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

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
      console.error("Error fetching restaurant by ID:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
