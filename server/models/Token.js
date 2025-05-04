const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["password-reset", "email-verification"], 
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "7d", 
  },
});

tokenSchema.index({ userId: 1, type: 1 });
tokenSchema.index({ expiresAt: 1 });

module.exports = mongoose.model("Token", tokenSchema);
