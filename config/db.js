const mongoose = require("mongoose");
const Auth = require("../models/authModel");

let isConnected = false;

const setConnection = async () => {
  if (isConnected) {
    console.log("✅ Using existing MongoDB connection");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 60000,
    });

    isConnected = db.connections[0].readyState;
    console.log("✅ MongoDB connected successfully");

    let user = await Auth.findOne({
      $or: [
        { email: process.env.ADMIN_EMAIL },
        { phoneNumber: process.env.ADMIN_PHONE },
      ],
    });

    if (!user) {
      user = new Auth({
        email: process.env.ADMIN_EMAIL,
        phoneNumber: process.env.ADMIN_PHONE,
        firstName: process.env.ADMIN_NAME,
        password: process.env.ADMIN_PASSWORD,
        role: "admin",
      });
      await user.save();
      console.log("👑 Admin user created");
    } else {
      console.log("👑 Admin already exists");
    }

  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
  }
};

module.exports = setConnection;
