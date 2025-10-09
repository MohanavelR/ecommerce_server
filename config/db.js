const mongoose=require('mongoose')
const Auth=require("../models/authModel")

const setConnection = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Database Connected..");

    let user = await Auth.findOne({
      $or: [
        { email: process.env.ADMIN_EMAIL },
        { phoneNumber: process.env.ADMIN_PHONE }
      ]
    });

    if (!user) {
      user = new Auth({
        email: process.env.ADMIN_EMAIL,
        phoneNumber: process.env.ADMIN_PHONE,
        firstName: process.env.ADMIN_NAME,
        password: process.env.ADMIN_PASSWORD,
        role:"admin"
      });
      await user.save();
      console.log("Admin user created");
    }
    else{
         console.log("Admin Already created");
    }

  } catch (err) {
    console.log("Error Occurred:", err.message);
  }
};


module.exports= setConnection

