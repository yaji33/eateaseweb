const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const RestaurantsDummy = require("../models/Restaurant_Dummy");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");

    const dummyData = {
      owner_name: "New Owner",
      name: "Dave",
      status: 1,
      business_profile: "https://example.com/profile/janedoe.jpg",
      business_banner: "https://example.com/profile/janedoe.jpg",
      address: {
        text: "123 Sample Street, Legazpi City, Albay, Philippines",
        coordinates: {
          latitude: 13.1445,
          longitude: 123.7453,
        },
      },
      operating_hours: {
        monday: "9:00 AM - 9:00 PM",
        tuesday: "9:00 AM - 9:00 PM",
        wednesday: "9:00 AM - 9:00 PM",
        thursday: "9:00 AM - 9:00 PM",
        friday: "9:00 AM - 10:00 PM",
        saturday: "10:00 AM - 10:00 PM",
        sunday: "Closed",
      },
      rating: 3.8,
      rating_count: 2,
      created_at: new Date("2024-02-13T14:00:00.000Z"),
      updated_at: new Date("2025-04-24T00:00:00.000Z"),
    };

    await RestaurantsDummy.deleteMany(); // Optional: clear the collection first

    try {
      const result = await RestaurantsDummy.create(dummyData);
      console.log("Dummy restaurant seeded:", result);
    } catch (err) {
      console.error("Error seeding dummy restaurant:", err);
    }

    process.exit();
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });
