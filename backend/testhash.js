const bcrypt = require("bcryptjs");

async function hashPassword() {
  const hashed = await bcrypt.hash("password123", 10);
  console.log("🔹 Hashed password:", hashed);
}

hashPassword();
