const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner_name: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    zip: { type: String, required: true },
    coordinates: {
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
    },
  },
  business_profile: { type: String, default: "" },
  restaurant_photo: { type: String, default: "" },
  restaurant_description: { type: String, default: "" },
  contact: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  operating_hours: {
    open: { type: String, required: true },
    close: { type: String, required: true },
  },
  rating: { type: Number, default: 0 },
  rating_count: { type: Number, default: 0 },
  status: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
});

const Restaurant =
  mongoose.models.Restaurant || mongoose.model("Restaurant", RestaurantSchema);

module.exports = Restaurant;
