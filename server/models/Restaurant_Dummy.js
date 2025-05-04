const mongoose = require("mongoose");

const RestaurantsDummySchema = new mongoose.Schema(
  {
    owner_name: { type: String, required: true },
    name: { type: String, required: true },
    status: { type: Number, default: 1 },

    business_profile: { type: String },
    business_banner: { type: String },

    address: {
      text: { type: String, required: true },
      coordinates: {
        latitude: { type: Number },
        longitude: { type: Number },
      },
    },

    //contact: { type: String, required: true },
    //email: { type: String, required: true, unique: true },
    //password: { type: String, required: true },

    operating_hours: {
      monday: { type: String, required: true },
      tuesday: { type: String, required: true },
      wednesday: { type: String, required: true },
      thursday: { type: String, required: true },
      friday: { type: String, required: true },
      saturday: { type: String, required: true },
      sunday: { type: String, required: true },
    },

    rating: { type: Number, default: 0 },
    rating_count: { type: Number, default: 0 },

    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  {
    collection: "restaurants_dummy", 
  }
);

module.exports = mongoose.model("Restaurants_Dummy", RestaurantsDummySchema);
