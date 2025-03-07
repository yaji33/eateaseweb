require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Role = require("../models/Role");

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const adminRole = await Role.findOne({ id: 1 });
    if (!adminRole) {
      return console.log("Admin role not found");
    }

    const hashedPassword = await bcrypt.hash("adminpasswords", 10);

    const adminUser = new User({
      
      email: "adminexample1@gmail.com",
      password: hashedPassword,
      role_id: adminRole.id,
    });

    await adminUser.save();
    console.log("Admin user created");
  } catch (error) {
    console.log(error);
  } finally {
    mongoose.disconnect();
  }
}

seedAdmin();
