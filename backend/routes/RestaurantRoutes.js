const express = require("express");
const bcrypt = require("bcryptjs");
const Restaurant = require("../models/Restaurant");

const router = express.Router();

router.post("/", async (req, res) => {
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
    } = req.body;
    if (
      !address ||
      !address.street ||
      !address.city ||
      !address.province ||
      !address.zip
    ) {
      return res
        .status(400)
        .json({
          error: "Address must include street, city, province, and zip.",
        });
    }

    if (!operating_hours || !operating_hours.open || !operating_hours.close) {
      return res
        .status(400)
        .json({ error: "Operating hours must include open and close times." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newRestaurant = new Restaurant({
      owner_name,
      name,
      address,
      contact,
      email,
      password : hashedPassword,
      status: 1,
      restaurant_photo: "",
      operating_hours: {
        open: operating_hours.open,
        close: operating_hours.close,
      },
    });

    const savedRestaurant = await newRestaurant.save();
    res.status(201).json(savedRestaurant);
  } catch (error) {
    console.error("Error saving restaurant:", error);
    res.status(500).json({ error: error.message });
  }
});


router.get("/", async (req, res) => {
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



module.exports = router;

