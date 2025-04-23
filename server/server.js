require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const restaurantRoutes = require("./routes/RestaurantRoutes");
const authRoutes = require("./routes/AuthRoutes");
const menuRoutes = require("./routes/MenuRoutes");


const app = express();
app.use(express.json({ limit: "10mb" })); // or even higher like "20mb"
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use("/api/menu", menuRoutes);

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

