require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const restaurantRoutes = require("./routes/RestaurantRoutes");
const authRoutes = require("./routes/AuthRoutes");


const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));


app.use("/api/restaurants", restaurantRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
  
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

