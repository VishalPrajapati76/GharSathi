const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const User = require("../models/UserSchema");

dotenv.config();

async function seedAdmin() {
  try {
    if (!process.env.MONGO_DB) {
      console.log("❌ MONGO_DB missing in .env");
      process.exit(1);
    }

    const adminEmail = process.env.ADMIN_EMAIL || "admin@gharsathi.com";
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.log("❌ ADMIN_PASSWORD missing in .env");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_DB);
    console.log("✅ MongoDB connected");

    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      console.log("⚠️ Admin already exists:", adminEmail);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(adminPassword, salt);

    const admin = new User({
      name: "Admin",
      email: adminEmail,
      password: hashed,
      type: "Admin",
      granted: "granted",
    });

    await admin.save();
    console.log("✅ Admin created:", adminEmail);

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err.message);
    process.exit(1);
  }
}

seedAdmin();