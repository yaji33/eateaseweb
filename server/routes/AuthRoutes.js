const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("🔹 Received login request for:", email);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("User found:", user);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔍 Password match status:", isMatch);

    if (!isMatch) {
      console.log("Password does not match for:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role_id: user.role_id, business_id: user.business_id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    ); 

    res.json({ token, role_id: user.role_id });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
