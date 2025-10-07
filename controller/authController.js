const transporter = require("../config/emailSender");
const Auth = require("../models/authModel");
const { generateOtp } = require("../utils/generateOtp");
const { createToken } = require("../utils/jwt");
// const createPendingUser=async (req,res)=>{
//   try {
//     const { firstName, lastName, email, password ,phoneNumber} = req.body;
//     const userPhone= await Auth.findOne({phoneNumber})
//     if (userPhone) {
//       return res.json({
//         message: "This Mobile number is already associated with an account. Please try logging in.",
//         success: false,
//       });
//     }
//     const userEmail=await Auth.findOne({email})
//     if (userEmail) {
//       return res.json({
//         message: "This email is already associated with an account. Please try logging in.",
//         success: false,
//       });
//     }
    

//   } catch (error) {
    
//   }
// }


// ## createUser
const createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const user = await Auth.findOne({ email });
    if (user) {
      return res.json({
        // Improved Message
        message: "This email is already associated with an account. Please try logging in.",
        success: false,
      });
    }
    const newUser = await new Auth({
      firstName,
      lastName,
      password,
      email,
    });
    await newUser.save();


    const message = {
  from: process.env.NODE_EMAIL, // your email
  to: newUser.email,
  // Visit us at: https://yourshop.com
  subject: "Welcome to EcomShop!",
  text: `Dear ${newUser.firstName},

Welcome to EcomShop! Your account has been successfully created. You can now explore our wide range of products and enjoy a seamless shopping experience.

Thank you for joining EcomShop!

Best regards,
The EcomShop Team`,
};

await transporter.sendMail(message);

    res
      .status(201)
      .json({ 
        success: true, 
        // Improved Message
        message: "Registration successful! Welcome to EcomShop." 
      });
  } catch (error) {
  
    res.json({
      message: error.message,
      success: false,
    });
  }
};

// ## login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Auth.findOne({ email }).select("+password");
    if (!user) {
      return res.json({
        // Improved Message
        message: "Login failed. No account found with this email address.",
        success: false,
      });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.json({
        success: false,
        // Improved Message
        message: "Login failed. The password you entered is incorrect.",
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
      // Improved Message
      message: "Login successful! You are now logged in.",
      data: {
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        role: user?.role,
        isVerified: user?.isVerified,
        id:user._id
      },
    });
  } catch (error) {
   
    res.json({
      message: error.message,
      success: false,
    });
  }
};

// ## logout
const logout = async (req, res, next) => {
  try {
    res.clearCookie("token").json({
      success: true,
      // Improved Message
      message: "You have been successfully logged out.",
    });
  } catch (error) {

    res.json({
      message: error.message,
      success: false,
    });
  }
};

// ## getCurrentUser
const getCurrentUser = async (req, res, next) => {
  try {
    const user = req.user;

    res.json({
      success: true,
      // Improved Message
      message: "User authentication validated.",
      data: {
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        role: user?.role,
        isVerified: user?.isVerified,
        id:user?._id
      },
    });
  } catch (error) {
 
    res.json({
      message: error.message,
      success: false,
    });
  }
};

// ## sendOtpforResetPassword
const sendOtpforResetPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await Auth.findOne({ email });
    if (!user) {
      return res.json({
        is_success: false,
        // Improved Message
        message: "Could not find an account registered with this email.",
      });
    }
    const otp = String(generateOtp());
    user.resetPasswordToken = otp;
    user.resetPasswordExpire = Date.now() + 20 * 60 * 1000;
    await user.save();
    const message = {
  from: process.env.NODE_EMAIL,
  to: user.email,
  subject: "EcomShop - Password Reset OTP",
  text: `Hello ${user.firstName || ''},

We received a request to reset your EcomShop account password.

Your One-Time Password (OTP) is: ${otp}

⚠️ This OTP is valid for the next 20 minutes. Please do not share it with anyone.

If you did not request this password reset, you can safely ignore this email.

Best regards,  
The EcomShop Team`,
};
    await transporter.sendMail(message);
    res.json({
      success: true,
      // Improved Message
      message: "A password reset OTP has been successfully sent to your email.",
    });
  } catch (error) {

    res.json({
      message: error.message,
      success: false,
    });
  }
};

// ## resetPassword
const resetPassword = async (req, res, next) => {
  const { email, otp, newpassword } = req.body;
  try {
    const user = await Auth.findOne({ email });
    if (!user) {
      return res.json({
        is_success: false,
        // Improved Message
        message: "User not found for password reset.",
      });
    }
    if (user.resetPasswordToken === "") {
      return res.json({
        success: false,
        // Improved Message
        message: "The OTP field is invalid or missing. Please request a new OTP.",
      });
    }
    if (user.resetPasswordToken !== otp) {
      return res.json({
        success: false,
        // Improved Message
        message: "The provided OTP is incorrect. Please try again.",
      });
    }
    if (user.resetPasswordExpire < Date.now()) {
      return res.json({
        success: false,
        // Improved Message
        message: "The OTP has expired. Please request a new password reset link or OTP.",
      });
    }
    user.password = newpassword;
    user.resetPasswordToken = "";
    user.resetPasswordExpire = "";
    await user.save();
    res.json({
      // Improved Message
      message: "Your password has been successfully reset. You can now log in.",
      success: true,
    });
  } catch (error) {

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