const transporter = require("../config/emailSender");
const authModel = require("../models/authModel");
const { generateOtp } = require("../utils/generateOtp");
const { createToken } = require("../utils/jwt");
const createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const user = await authModel.findOne({ email });
    if (user) {
      return res.json({
        message: "Email is already registered",
        success: false,
      });
    }
    const newUser = await new authModel({
      firstName,
      lastName,
      password,
      email,
    });
    await newUser.save();
    const message = {
      from: process.env.NODE_EMAIL,
      to: newUser.email,
      subject: "Welcome to EcomShop",
      text: `This Email created EcomShop Account`,
    };
    await transporter.sendMail(message);
    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.json({
      message: error.message,
      success: false,
    });
  }
};
const login = async (req, res, next) => {

  try {
    const { email, password } = req.body;
    const user = await authModel.findOne({ email }).select("+password");
    if (!user) {
      return res.json({
        message:
          "No account found with this email address. Please sign up to continue",
        success: false,
      });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid password. Please try again",
      });
    }
    const token = await createToken(user._id);
    await res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({
      success: true,
      message: "You have Logged in successfully",
      data: {
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        role: user?.role,
        isVerified: user?.isVerified,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: error.message,
      success: false,
    });
  }
};
const logout = async (req, res, next) => {
  try {
    res.clearCookie("token").json({
      success: true,
      message: "You have Logged out successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: error.message,
      success: false,
    });
  }
};
const getCurrentUser = async (req, res, next) => {
  try {
    const user = req.user;

    res.json({
      success: true,
      message: "You are autheticated.",
      data: {
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        role: user?.role,
        isVerified: user?.isVerified,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: error.message,
      success: false,
    });
  }
};

const sendOtpforResetPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await authModel.findOne({ email });
    if (!user) {
      return res.json({
        is_success: false,
        message: "Email is not registered",
      });
    }
    const otp = String(generateOtp());
    user.resetPasswordToken = otp;
    user.resetPasswordExpire = Date.now() + 5 * 60 * 1000;
    await user.save();
    const message = {
      from: process.env.NODE_EMAIL,
      to: user.email,
      subject: "Your OTP for Password Reset",
      text: `Your OTP for resetting your account password is ${otp}. Do not share this code with anyone.`,
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
const resetPassword = async (req, res, next) => {
  const { email, otp, newpassword } = req.body;
  try {
    const user = await authModel.findOne({ email });
    if (!user) {
      return res.json({
        is_success: false,
        message: "user not found",
      });
    }
    if (user.resetPasswordToken === "") {
      return res.json({
        success: false,
        message: "OTP is Invaild",
      });
    }
    if (user.resetPasswordToken !== otp) {
      return res.json({
        success: false,
        message: "OTP is Incorrect",
      });
    }
    if (user.resetPasswordExpire < Date.now()) {
      return res.json({
        success: false,
        message: "OTP is Expired",
      });
    }
    user.password = newpassword;
    user.resetPasswordToken = "";
    user.resetPasswordExpire = "";
    await user.save();
    res.json({
      message: "Password Reset Successfully",
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
  createUser,
  getCurrentUser,
  login,
  logout,
  sendOtpforResetPassword,
  resetPassword,
};
