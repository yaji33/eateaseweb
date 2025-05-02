const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
  transaction_id: { type: String, required: true },
  payment_method: { type: String, required: true },
  amount: { type: Number, required: true },
  transaction_date: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
