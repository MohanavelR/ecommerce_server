const transporter = require("../config/emailSender");
const authModel = require("../models/authModel");
const { generateOtp } = require("../utils/generateOtp");

const sendOtpforVerification = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await authModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        // Improved Message
        message: "Email is not registered. Please sign up to create an account.",
      });
    }
    const otp = String(generateOtp());
    user.verificationToken = otp;
    user.verificationExpire = Date.now() + 5 * 60 * 1000;
    await user.save();
    const message = {
      from: process.env.NODE_EMAIL,
      to: user.email,
      subject: "Your OTP for Account Verification",
      text: `Your OTP for verification your account password is ${otp}. Do not share this code with anyone.`,
    };
    await transporter.sendMail(message);
    res.json({
      success: true,
      // Improved Message
      message: "A verification OTP has been successfully sent to your email.",
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: error.message,
      success: false,
    });
  }
};

const verifyAccount = async (req, res, next) => {
  const { email, otp } = req.body;
  try {
    const user = await authModel.findOne({ email });
    if (!user) {
      return res.json({
        is_success: false,
        // Improved Message
        message: "User account not found for verification.",
      });
    }
    if (user.verificationToken === "") {
      return res.json({
        success: false,
        // Improved Message
        message: "OTP is invalid or has already been used. Please request a new code.",
      });
    }
    
    if (user.verificationExpire < Date.now()) {
      return res.json({
        success: false,
        // Improved Message
        message: "The OTP has expired. Please request a new verification code.",
      });
    }
    if (user.verificationToken !== otp) {
      return res.json({
        success: false,
        // Improved Message
        message: "The verification OTP is incorrect. Please check the code and try again.",
      });
    }
     user.isVerified=true
    user.verificationToken = "";
    user.verificationExpire = "";
    await user.save();
    res.json({
      // Improved Message
      message: "Account successfully verified!",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: error.message,
      success: false,
    });
  }
};

module.exports = {
    sendOtpforVerification,
    verifyAccount
};