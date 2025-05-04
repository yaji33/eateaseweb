const express = require("express");
const router = express.Router();
const Order = require("../../models/Business/Order");
const User = require("../../models/Business/User");
const {
  authMiddleware,
  businessMiddleware,
} = require("../../middleware/authMiddleware");

// GET /api/orders
router.get("/", authMiddleware, businessMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ restaurant_id: req.user.business_id });

    const populatedOrders = await Promise.all(
      orders.map(async (order) => {
        const user = await User.findById(order.customer_id).select("fullName");

        return {
          order_id: order.order_id,
          timestamp: order.createdAt,
          customerName: user ? user.fullName : "Unknown",
          orderItems: order.items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount: order.items.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
          ),
          order_status: order.order_status,
        };
      })
    );

    res.json(populatedOrders);
  } catch (error) {
    console.error("❌ Failed to fetch orders:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/orders/:id/status
router.patch(
  "/:orderId/status",
  authMiddleware,
  businessMiddleware,
  async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;

      // Updated to include 4 as a valid status (completed)
      const validStatuses = [0, 1, 2, 3, 4];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid order status" });
      }

      const updatedOrder = await Order.findOneAndUpdate(
        { order_id: orderId, restaurant_id: req.user.business_id },
        {
          order_status: status,
          updatedAt: new Date(),
        },
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({ error: "Order not found" });
      }

      res.json({ message: "Order status updated", updatedOrder });
    } catch (err) {
      console.error("❌ Error updating order status:", err.message);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;
