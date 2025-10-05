const transporter = require("../config/emailSender");
const User = require("../models/authModel");
const { generateOtp } = require("../utils/generateOtp");
const { createToken } = require("../utils/jwt");
const pendingUser = require("../models/pendingModel");

// Update firstName and lastName
const updateUserName = async (req, res) => {
  try {
    
    const { firstName, lastName,userId } = req.body;

    if (!firstName && !lastName) {
      return res.status(400).json({
        success: false,
        message: "Provide at least firstName or lastName to update",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { firstName, lastName } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User name updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Step 1: Request Email Change
const requestEmailChange = async (req, res) => {
  try {
    const { userId, newEmail } = req.body;
    
    if (!newEmail) return res.status(400).json({ success: false, message: "Email required" });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    const emailExists = await User.findOne({ email: newEmail });
    if (emailExists) return res.status(400).json({ success: false, message: "Email already in use" });
    let pending_user=await pendingUser.findOne({email:newEmail})
    if(!pending_user){
      pending_user= await pendingUser({email:newEmail})
    }
    const token = generateOtp();
    const tokenExpiry = Date.now() + 20 * 60 * 1000;
    pending_user.otpToken = token;
    pending_user.otpExpireDate = tokenExpiry;
    await pending_user.save();
    const message = {
      from: process.env.NODE_EMAIL,
      to: newEmail,
      subject: "EcomShop - Verify Your Email",
      text: `Hi ${user.firstName || ''},

Welcome to EcomShop! We're excited to have you on board.

To complete your email change, please use the following One-Time Password (OTP): ${token}

⏳ This OTP will expire in 20 minutes.

If you did not request this email, please ignore it.

Cheers,
EcomShop Team
`,
    };

    await transporter.sendMail(message);

    res.status(200).json({ success: true, message: "Verification email sent to new email address" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Step 2: Verify Email Change
const verifyEmailChange = async (req, res) => {
  try {
    const { userId, newEmail, otp } = req.body;
    if (!newEmail) return res.status(400).json({ success: false, message: "Email required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const emailExists = await User.findOne({ email: newEmail });
    if (emailExists) return res.status(400).json({ success: false, message: "Email already in use" });
   
    const pending_user = await pendingUser.findOne({ email: newEmail });
    if (!pending_user) {
      return res.status(400).json({ success: false, message: "No OTP request found. Please request a new OTP." });
    }
    if (pending_user.otpExpireDate < Date.now()) {
      await pending_user.deleteOne(); // remove expired OTP
      return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });
    }

    if (pending_user.otpToken !== otp) {
      return res.status(400).json({ success: false, message: "Incorrect OTP. Please try again." });
    }

    user.email = newEmail;
    const updatedUser = await user.save();

    const token = await createToken(updatedUser._id);
    await res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ success: true, message: "Email changed successfully", data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  updateUserName,
  requestEmailChange,
  verifyEmailChange,
};
