const express = require("express");
const router = express.Router();
const Payment = require("../../models/Business/Payment");
const User = require("../../models/Business/User");
const { authMiddleware, businessMiddleware } = require("../../middleware/authMiddleware");

router.get("/", authMiddleware, businessMiddleware, async (req, res) => {
  try {
    const payments = await Payment.find({ restaurant_id: req.user.business_id }).lean({ virtuals: true });

    const populated = await Promise.all(
        payments.map(async (tx) => {
            const user = await User.findById(tx.customer_id).select("fullName");
          
            return {
                customerName: user?.fullName || "Unknown",
                transactionId: tx.transaction_id,
                totalPayment: tx.amount,
                modeOfPayment: tx.payment_method,
                createdAt: tx.createdAt,
              };              
          })          
    );

    res.json(populated);
  } catch (err) {
    console.error("❌ Failed to fetch payments:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
