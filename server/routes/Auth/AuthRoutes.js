const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/Business/User");
const Restaurant = require("../../models/Business/Restaurant");
const Chat = require("../../models/Business/Chat");
const mongoose = require("mongoose");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("🔹 Received login request for:", email);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res
        .status(400)
        .json({ message: "Email or password is incorrect" });
    }

    console.log("User found:", user);
    console.log("🔑 User role_id:", user.role_id);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔍 Password match status:", isMatch);

    if (!isMatch) {
      console.log("Password does not match for:", email);
      return res
        .status(400)
        .json({ message: "Email or password is incorrect" });
    }

    // First check if the user is admin - admins should never be treated as business accounts
    if (user.role_id === 1) {
      console.log("👑 Admin user login successful:", email);
      // Admin authentication continues normally
    }
    // Then separately check if it's a business user
    else if (user.role_id === 3 && user.business_id) {
      // Find the associated restaurant
      const restaurant = await Restaurant.findById(user.business_id);
      console.log(
        `🏢 Restaurant info: ${
          restaurant ? restaurant.name || "Found" : "Not found"
        }, Status: ${restaurant?.status}, ID: ${user.business_id}`
      );

      // Check restaurant status - now with updated status codes
      if (!restaurant) {
        console.log("Restaurant not found for business account:", email);
        return res.status(403).json({
          message: "Restaurant account not found. Please contact support.",
        });
      }

      // Status-based access control
      switch (restaurant.status) {
        case 0:
          console.log("Restaurant account pending approval:", email);
          return res.status(403).json({
            message:
              "Your restaurant account is pending approval. Please wait for administrator approval.",
          });
        case 3:
          console.log("Banned restaurant account attempted login:", email);
          return res.status(403).json({
            message:
              "Your restaurant account has been suspended. Please contact support for assistance.",
          });
        case 1:
        case 2:
          console.log(
            `Restaurant account login successful (Status: ${restaurant.status})`,
            email
          );
          // Continue with authentication for active or launched restaurants
          break;
        default:
          console.log(`Unknown restaurant status: ${restaurant.status}`);
          return res.status(403).json({
            message:
              "Your account has an invalid status. Please contact support.",
          });
      }

      // Access granted for status 1 (Active) or 2 (Launched) - proceed with chat fetching
      try {
        if (mongoose.Types.ObjectId.isValid(user.business_id)) {
          console.log(
            `🔍 Attempting to fetch chats for restaurant_id: ${user.business_id}`
          );
          // Chat fetching logic (omitted for brevity)
        }
      } catch (chatError) {
        console.error("❌ Error fetching chats:", chatError);
      }
    }

    // Generate token with correct user role data
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

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    // For business accounts, include restaurant status in response
    let responseData = {
      token: accessToken,
      id: user._id,
      name: user.name || user.email,
      email: user.email,
      role_id: user.role_id,
      business_id: user.business_id || null,
    };

    // Add restaurant status if it's a business account
    if (user.role_id === 3 && user.business_id) {
      const restaurant = await Restaurant.findById(user.business_id);
      if (restaurant) {
        responseData.restaurant_status = restaurant.status;
        responseData.restaurant_name = restaurant.name;
      }
    }

    res.json(responseData);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
