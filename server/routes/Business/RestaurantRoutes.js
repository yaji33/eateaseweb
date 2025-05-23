const express = require("express");
const bcrypt = require("bcryptjs");
const Restaurant = require("../../models/Business/Restaurant");
const User = require("../../models/Business/User");
const Role = require("../../models/Role");
const registerLimiter = require("../../middleware/registerLimiter");
const router = express.Router();
const sendEmail = require("../../utility/sendEmail");

const {
  authMiddleware,
  businessMiddleware,
} = require("../../middleware/authMiddleware");
const cloudinary = require("../../utility/cloudinary");
const streamifier = require("streamifier");

router.post("/", registerLimiter, async (req, res) => {
  try {
    const {
      owner_name,
      name,
      address,
      contact,
      email,
      password,
      operating_hours,
      restaurant_photo,
      business_profile,
      restaurant_description,
    } = req.body;
    if (
      !address ||
      !address.street ||
      !address.city ||
      !address.province ||
      !address.zip
    ) {
      return res.status(400).json({
        error: "Address must include street, city, province, and zip.",
      });
    }

    if (!operating_hours || !operating_hours.open || !operating_hours.close) {
      return res
        .status(400)
        .json({ error: "Operating hours must include open and close times." });
    }

    const existingRestaurantAccount = await Restaurant.findOne({ email });
    if (existingRestaurantAccount) {
      return res.status(400).json({
        error: "Restaurant account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newRestaurant = new Restaurant({
      owner_name,
      name,
      address,
      contact,
      email,
      password: hashedPassword,
      status: 0,
      restaurant_photo: "",
      business_profile: "",
      restaurant_description: "",
      operating_hours: {
        open: operating_hours.open,
        close: operating_hours.close,
      },
      rating: 0,
      rating_count: 0,
      address: {
        ...address,
        coordinates: {
          latitude: null,
          longitude: null,
        },
      },
    });

    const savedRestaurant = await newRestaurant.save();

    const businessRole = await Role.findOne({ id: 3 });
    if (!businessRole)
      return res.status(500).json({ error: "Business role not found" });

    const newUser = new User({
      owner_name,
      email,
      password: hashedPassword,
      role_id: businessRole.id,
      business_id: savedRestaurant._id,
    });

    await sendEmail({
      to: email,
      subject: "Registration Received",
      text: `Hi ${owner_name}, we've received your restaurant registration.`,
      html: `<p>Hi ${owner_name},</p>
             <p>Thanks for registering <strong>${name}</strong>. We'll review your information and notify you once approved.</p>`,
    });

    await newUser.save();

    res.status(201).json(savedRestaurant);
  } catch (error) {
    console.error("Error saving restaurant:", error);
    res.status(500).json({ error: error.message });
  }
});

router.put("/launch", authMiddleware, businessMiddleware, async (req, res) => {
  try {
    // Find the restaurant associated with the logged-in business user
    const restaurant = await Restaurant.findById(req.user.business_id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Check if restaurant is in approved state (status = 1)
    if (restaurant.status !== 1) {
      return res.status(400).json({
        message:
          "Restaurant cannot be launched. It must be approved by admin first.",
      });
    }

    // Verify required fields are filled
    const requiredFields = [
      "name",
      "contact",
      "address.street",
      "address.city",
      "operating_hours.open",
      "operating_hours.close",
    ];

    const missingFields = [];

    for (const field of requiredFields) {
      // Handle nested fields
      if (field.includes(".")) {
        const [parent, child] = field.split(".");
        if (!restaurant[parent] || !restaurant[parent][child]) {
          missingFields.push(field);
        }
      } else if (!restaurant[field]) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Cannot launch restaurant. Please complete these fields first: ${missingFields.join(
          ", "
        )}`,
      });
    }

    // Update restaurant status to 'Live' (status = 2)
    restaurant.status = 2;
    await restaurant.save();

    res.json(restaurant);
  } catch (err) {
    console.error("❌ Failed to launch restaurant:", err.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

router.get("/", authMiddleware, businessMiddleware, async (req, res) => {
  try {
    console.log("Fetching restaurants...");
    const restaurants = await Restaurant.find();
    console.log("Restaurants found:", restaurants);
    res.json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ error: error.message });
  }
});

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
    const restaurant = await Restaurant.findById(user.business_id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Extract data from request body
    const {
      name,
      owner_name,
      business_profile,
      restaurant_photo,
      restaurant_description,
      contact,
      address,
      operating_hours,
      profileImageBase64,
      bannerImageBase64,
    } = req.body;

    // Update basic fields if provided
    if (name) restaurant.name = name;
    if (owner_name) restaurant.owner_name = owner_name;
    if (restaurant_description)
      restaurant.restaurant_description = restaurant_description;
    if (restaurant_photo) restaurant.restaurant_photo = restaurant_photo;
    if (business_profile) restaurant.business_profile = business_profile;
    if (contact) restaurant.contact = contact;

    // Update address if provided
    if (address) {
      // Only update fields that are provided
      if (address.street) restaurant.address.street = address.street;
      if (address.city) restaurant.address.city = address.city;
      if (address.province) restaurant.address.province = address.province;
      if (address.zip) restaurant.address.zip = address.zip;

      // Update coordinates if provided
      if (address.coordinates) {
        restaurant.address.coordinates = {
          latitude:
            address.coordinates.latitude ||
            restaurant.address.coordinates?.latitude,
          longitude:
            address.coordinates.longitude ||
            restaurant.address.coordinates?.longitude,
        };
      }
    }

    // Update operating hours if provided
    if (operating_hours) {
      restaurant.operating_hours = {
        open: operating_hours.open || restaurant.operating_hours.open,
        close: operating_hours.close || restaurant.operating_hours.close,
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
        restaurant.restaurant_photo = result.secure_url;
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

router.get("/profile", authMiddleware, businessMiddleware, async (req, res) => {
  try {
    const user = req.user;

    if (!user.business_id) {
      return res
        .status(404)
        .json({ message: "No business associated with this account" });
    }
    const restaurant = await Restaurant.findById(user.business_id);

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
