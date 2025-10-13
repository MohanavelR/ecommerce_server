require("dotenv").config();
const mongoose = require("mongoose");
const Auth = require("./models/authModel");

(async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("✅ DB connected");

    const existing = await Auth.findOne({
      $or: [
        { email: process.env.ADMIN_EMAIL },
        { phoneNumber: process.env.ADMIN_PHONE },
      ],
    });

    if (!existing) {
      await Auth.create({
        email: process.env.ADMIN_EMAIL,
        phoneNumber: process.env.ADMIN_PHONE,
        firstName: process.env.ADMIN_NAME,
        password: process.env.ADMIN_PASSWORD,
        role: "admin",
      });
      console.log("👑 Admin created successfully");
    } else {
      console.log("👑 Admin already exists");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
})();
