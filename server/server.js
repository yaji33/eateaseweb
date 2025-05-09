require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const restaurantRoutes = require("./routes/Business/RestaurantRoutes");
const authRoutes = require("./routes/Auth/AuthRoutes");
const menuRoutes = require("./routes/Business/MenuRoutes");
const adminRestaurantRoutes = require("./routes/Admin/AdminRestaurantsRoutes");
const resetPasswordRoutes = require("./routes/Auth/ResetPassword");
const orderRoutes = require("./routes/Business/OrderRoutes");
const paymentRoutes = require("./routes/Business/PaymentRoutes");
const chatRoutes = require("./routes/Business/ChatRoutes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

const configureSocketIO = require("./socket/socketManager");
configureSocketIO(io);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/chat", chatRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/restaurants", restaurantRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auth", resetPasswordRoutes);
app.use("/api/admin", adminRestaurantRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.set("io", io);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
