const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner_name: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    zip: { type: String, required: true },
  },
  contact: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  operating_hours: {
    open: { type: String, required: true },
    close: { type: String, required: true },
  },
  status: { type: Number, default: 1 },
  created_at: { type: Date, default: Date.now },
});

const Restaurant =
  mongoose.models.Restaurant || mongoose.model("Restaurant", RestaurantSchema);

module.exports = Restaurant;
