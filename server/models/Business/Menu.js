const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema({
  restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image_url: { type: String },
  availability_id: { type: Number, default: 1 },
  category_id: { type: Number, required: true },
  rating: { type: Number, default: 0 },
});

module.exports = mongoose.model("Menu", MenuSchema);
