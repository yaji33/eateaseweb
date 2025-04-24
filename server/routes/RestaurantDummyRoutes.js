const express = require("express");
const Menu = require("../models/Menu");
const Restaurant_Dummy = require("../models/Restaurant_Dummy"); // Added required model
const {
  authMiddleware,
  businessMiddleware,
} = require("../middleware/authMiddleware");
const cloudinary = require("../utility/cloudinary");
const streamifier = require("streamifier");

const router = express.Router();

router.put("/profile", authMiddleware, businessMiddleware, async (req, res) => {
  try {
    // Get user from middleware
    const user = req.user;

    if (!user.business_id) {
      return res
        .status(404)
        .json({ message: "No business associated with this account" });
    }

    // Find restaurant by business_id
    const restaurant = await Restaurant_Dummy.findById(user.business_id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Extract data from request body
    const {
      name,
      business_profile,
      contact,
      address,
      operating_hours,
      profileImageBase64,
      bannerImageBase64,
    } = req.body;

    // Update basic fields
    restaurant.name = name || restaurant.name;
    restaurant.business_profile =
      business_profile || restaurant.business_profile;
    restaurant.contact = contact || restaurant.contact;

    // Update address if provided
    if (address) {
      restaurant.address = {
        text: address.text || restaurant.address?.text,
        coordinates: {
          latitude:
            address.coordinates?.latitude ||
            restaurant.address?.coordinates?.latitude,
          longitude:
            address.coordinates?.longitude ||
            restaurant.address?.coordinates?.longitude,
        },
      };
    }

    // Update operating hours if provided
    if (operating_hours) {
      restaurant.operating_hours = {
        ...restaurant.operating_hours,
        ...operating_hours,
      };
    }

    // Handle profile image upload
    if (profileImageBase64) {
      try {
        // Convert base64 to buffer
        const buffer = Buffer.from(profileImageBase64, "base64");

        // Upload to cloudinary
        const uploadPromise = new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "restaurant_profiles" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );

          streamifier.createReadStream(buffer).pipe(uploadStream);
        });

        const result = await uploadPromise;
        restaurant.business_profile = result.secure_url;
      } catch (uploadError) {
        console.error("Profile image upload error:", uploadError);
        // Continue with other updates even if image upload fails
      }
    }

    // Handle banner image upload
    if (bannerImageBase64) {
      try {
        // Convert base64 to buffer
        const buffer = Buffer.from(bannerImageBase64, "base64");

        // Upload to cloudinary
        const uploadPromise = new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "restaurant_banners" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );

          streamifier.createReadStream(buffer).pipe(uploadStream);
        });

        const result = await uploadPromise;
        restaurant.business_banner = result.secure_url;
      } catch (uploadError) {
        console.error("Banner image upload error:", uploadError);
        // Continue with other updates even if image upload fails
      }
    }

    // Save updates to database
    await restaurant.save();

    // Return updated restaurant data
    res.json(restaurant);
  } catch (error) {
    console.error("Error updating restaurant profile:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all dummy restaurants (accessible by anyone - you might want to add admin restriction)
router.get("/", async (req, res) => {
  try {
    console.log("Fetching dummy restaurants...");
    const restaurants = await Restaurant_Dummy.find();
    console.log("Dummy restaurants found:", restaurants);
    res.json(restaurants);
  } catch (error) {
    console.error("Error fetching dummy restaurants:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get dummy restaurant data for the logged-in business user
router.get("/profile", authMiddleware, businessMiddleware, async (req, res) => {
  try {
    // Get the business_id from the authenticated user
    const user = req.user;

    if (!user.business_id) {
      return res
        .status(404)
        .json({ message: "No business associated with this account" });
    }

    // Find restaurant by business_id
    const restaurant = await Restaurant_Dummy.findById(user.business_id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json(restaurant);
  } catch (error) {
    console.error("Error fetching restaurant profile:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
