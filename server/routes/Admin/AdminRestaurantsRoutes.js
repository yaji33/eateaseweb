const express = require("express");
const Restaurant = require("../../models/Admin/Restaurants");
const {
  authMiddleware,
  adminMiddleware,
} = require("../../middleware/authMiddleware");
const router = express.Router();

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

      const restaurant = await Restaurant.findByIdAndUpdate(
        id,
        { status },
        { new: true, select: "name owner_name email status" }
      );

      if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
      }

      const io = req.app.get("io"); 
      io.emit("restaurantStatusUpdated", {
        id: restaurant._id,
        status: restaurant.status,
      });

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
