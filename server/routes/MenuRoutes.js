const express = require("express");
const Menu = require("../models/Menu");
const {
  authMiddleware,
  businessMiddleware,
} = require("../middleware/authMiddleware");
const cloudinary = require("../utility/cloudinary");
const streamifier = require("streamifier");

const router = express.Router();

router.post("/", authMiddleware, businessMiddleware, async (req, res) => {
  try {
    console.log("🔹 POST /api/menu called");
    console.log("Body:", req.body);

    const { title, price, category_id, imageBase64 } = req.body;

    if (!title || !price || !category_id || !imageBase64) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Upload image to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "eatease/menu" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      streamifier
        .createReadStream(Buffer.from(imageBase64, "base64"))
        .pipe(uploadStream);
    });

    const newItem = new Menu({
      restaurant_id: req.user.business_id,
      name: title,
      description: "",
      price,
      image_url: uploadResult.secure_url,
      category_id,
      availability_id: 1,
    });

    const savedItem = await newItem.save();
    console.log("✅ Menu item saved:", savedItem);
    res.status(201).json(savedItem);
  } catch (err) {
    console.error("❌ Error saving menu item:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get("/", authMiddleware, businessMiddleware, async (req, res) => {
  try {
    const items = await Menu.find({ restaurant_id: req.user.business_id });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post(
  "/delete-multiple",
  authMiddleware,
  businessMiddleware,
  async (req, res) => {
    try {
      const { ids } = req.body;

      if (!ids || !Array.isArray(ids)) {
        return res.status(400).json({ error: "Invalid request body" });
      }

      await Menu.deleteMany({
        _id: { $in: ids },
        restaurant_id: req.user.business_id,
      });

      res.json({ message: "Menu items deleted successfully" });
    } catch (err) {
      console.error("❌ Error deleting menu items:", err.message);
      res.status(500).json({ error: "Server error while deleting menu items" });
    }
  }
);

router.patch("/:id", authMiddleware, businessMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, price, category_id, imageBase64 } = req.body;

    const menuItem = await Menu.findOne({
      _id: id,
      restaurant_id: req.user.business_id,
    });

    if (!menuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    if (title) menuItem.name = title;
    if (price) menuItem.price = price;
    if (category_id) menuItem.category_id = category_id;

    if (imageBase64) {
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "eatease/menu" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        const streamifier = require("streamifier");
        streamifier.createReadStream(Buffer.from(imageBase64, "base64")).pipe(uploadStream);
      });

      menuItem.image_url = uploadResult.secure_url;
    }

    const updatedItem = await menuItem.save();

    res.json(updatedItem);
  } catch (err) {
    console.error("❌ Error updating menu item:", err.message);
    res.status(500).json({ error: "Server error while updating menu item" });
  }
});

module.exports = router;
