const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  owner_name: { type: String, required:  function() { return this.role_id !== 1; } },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role_id: { type: Number, required: true },
  business_id: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
  created_at: { type: Date, default: Date.now },
});



module.exports = mongoose.model("User", UserSchema);
