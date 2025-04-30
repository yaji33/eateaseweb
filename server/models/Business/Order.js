const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
  order_id: { type: String, required: true },
  items: [
    {
      menu_id: { type: mongoose.Schema.Types.ObjectId, ref: "Menu", required: true },
      name: { type: String, required: true },
      image: String,
      price: Number,
      quantity: Number,
    },
  ],
  total_amount: Number,
  order_status: Number, // 1: Pending, 2: Ongoing, 4: Completed, 0: Denied
  pickup_time: String,
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
