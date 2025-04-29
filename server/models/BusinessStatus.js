const mongoose = require("mongoose");

const BusinessStatusSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ["pending", "active"],
    unique: true,
  },
});

module.exports = mongoose.model("BusinessStatus", BusinessStatusSchema);
