const { ZapIcon } = require("lucide-react");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    zip: { type: String, required: true },
  },
  restaurant_photo: { type: String },
  contact: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  operating_hours: {
    open: { type: String, required: true },
    close: { type: String, required: true },
  },
  rating: { type: Number, default: 0 },
  rating_count: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
});

// Hash password before saving
RestaurantSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);
