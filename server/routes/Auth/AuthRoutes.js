const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/Business/User");
const Restaurant = require("../../models/Business/Restaurant");
const mongoose = require("mongoose");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email or password is incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Email or password is incorrect" });
    }

    // Role-based checks
    if (user.role_id === 3 && user.business_id) {
      const restaurant = await Restaurant.findById(user.business_id);

      if (!restaurant) {
        return res.status(403).json({
          message: "Restaurant account not found. Please contact support.",
        });
      }

      // Status-based access control
      switch (restaurant.status) {
        case 0:
          return res.status(403).json({
            message:
              "Your restaurant account is pending approval. Please wait for administrator approval.",
          });
        case 3:
          return res.status(403).json({
            message:
              "Your restaurant account has been suspended. Please contact support for assistance.",
          });
        case 1:
        case 2:
          break;
        default:
          return res.status(403).json({
            message:
              "Your account has an invalid status. Please contact support.",
          });
      }

      
      if (mongoose.Types.ObjectId.isValid(user.business_id)) {
        // Chat fetching logic can go here
      }
    }

    // Generate JWT tokens
    const payload = {
      id: user._id,
      role_id: user.role_id,
      business_id: user.business_id || null,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24m",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // Set refresh token as secure HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    // Prepare response
    const responseData = {
      token: accessToken,
      id: user._id,
      name: user.name || user.email,
      email: user.email,
      role_id: user.role_id,
      business_id: user.business_id || null,
    };

    // Add restaurant info for business accounts
    if (user.role_id === 3 && user.business_id) {
      const restaurant = await Restaurant.findById(user.business_id);
      if (restaurant) {
        responseData.restaurant_status = restaurant.status;
        responseData.restaurant_name = restaurant.name;
      }
    }

    res.json(responseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
