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
        message: "Email is not registered",
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
      message: "Reset password OTP sent on Your Email",
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: error.message,
      success: false,
    });
  }
};
const verifyAccount= async (req, res, next) => {
  const { email, otp } = req.body;
  try {
    const user = await authModel.findOne({ email });
    if (!user) {
      return res.json({
        is_success: false,
        message: "user not found",
      });
    }
    if (user.verificationToken === "") {
      return res.json({
        success: false,
        message: "OTP is Invaild",
      });
    }
    
    if (user.verificationExpire < Date.now()) {
      return res.json({
        success: false,
        message: "OTP is Expired",
      });
    }
    if (user.verificationToken !== otp) {
      return res.json({
        success: false,
        message: "OTP is Incorrect",
      });
    }
     user.isVerified=true
    user.verificationToken = "";
    user.verificationExpire = "";
    await user.save();
    res.json({
      message: "Successfully verify Your Account",
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

module.exports={
    sendOtpforVerification,verifyAccount
}