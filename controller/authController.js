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
    const { firstName, lastName, email, password, phoneNumber } = req.body;

    // Basic required fields check
    if (!firstName || !email || !password || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if email already exists
    let user = await Auth.findOne({ email });
    if (user) {
      return res.json({
        success: false,
        message: "This email is already associated with an account. Please try logging in.",
      });
    }

    // Check if phone number already exists
    user = await Auth.findOne({ phoneNumber });
    if (user) {
      return res.json({
        success: false,
        message: "This mobile number is already associated with an account. Please try logging in.",
      });
    }

    // Create new user
    const newUser = new Auth({
      firstName,
      lastName,
      password,
      email,
      phoneNumber, // store phone number
    });
    await newUser.save();

    // Send welcome email
    const message = {
      from: process.env.NODE_EMAIL,
      to: newUser.email,
      subject: "Welcome to EcomShop!",
      text: `Dear ${newUser.firstName},

Welcome to EcomShop! Your account has been successfully created. You can now explore our wide range of products and enjoy a seamless shopping experience.

Thank you for joining EcomShop!

Best regards,
The EcomShop Team`,
    };
    await transporter.sendMail(message);

    res.status(201).json({
      success: true,
      message: "Registration successful! Welcome to EcomShop.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ## login
const login = async (req, res, next) => {
  try {
    const { loginId, password } = req.body; 

    if (!loginId || !password) {
      return res.json({
        success: false,
        message: "Please provide email/phone and password",
      });
    }

    // Determine if loginId is an email or phone number
    const isEmail = /\S+@\S+\.\S+/.test(loginId);
    const query = isEmail ? { email: loginId } : { phoneNumber: loginId };

    // Find user and select password
    const user = await Auth.findOne(query).select("+password");
    if (!user) {
      return res.json({
        success: false,
        message: "Login failed. No account found with this email/phone number.",
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Login failed. The password you entered is incorrect.",
      });
    }

    // Create JWT token and set cookie
    const token = await createToken(user._id);
    await res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Login successful! You are now logged in.",
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        isVerified: user.isVerified,
        id: user._id,
      },
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};


const logout = async (req, res) => {
  try {
    // Clear cookie with the same settings used when setting it
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/", // must match the original cookie path
    });

    // Send response separately (don’t chain after clearCookie)
    return res.status(200).json({
      success: true,
      message: "You have been successfully logged out.",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
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
        id:user?._id,
        phoneNumber:user?.phoneNumber
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
  const { resetId } = req.body;

  if (!resetId) {
    return res.status(400).json({
      success: false,
      message: "Email or mobile number is required",
    });
  }

  try {
    // Determine if resetId is email or phone
    const isEmail = /\S+@\S+\.\S+/.test(resetId);
    const query = isEmail ? { email: resetId } : { phoneNumber: resetId };

    const user = await Auth.findOne(query);
    if (!user) {
      return res.json({
        success: false,
        message: `Could not find an account registered with this ${isEmail ? "email" : "mobile number"}.`,
      });
    }

    const otp = String(generateOtp());
    user.resetPasswordToken = otp;
    user.resetPasswordExpire = Date.now() + 20 * 60 * 1000; // 20 minutes
    await user.save();

    if (isEmail) {
      // Send OTP via email
      const message = {
        from: process.env.NODE_EMAIL,
        to: user.email,
        subject: "EcomShop - Password Reset OTP",
        text: `Hello ${user.firstName || ''},

Your OTP for password reset is: ${otp}

This OTP is valid for 20 minutes.

If you did not request this, please ignore this email.`,
      };
      await transporter.sendMail(message);
    } else {
      // TODO: send OTP via SMS using your preferred SMS gateway
    }

    res.json({
      success: true,
      message: `A password reset OTP has been successfully sent to your Email.`,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};


// ## resetPassword
const resetPassword = async (req, res, next) => {
  const { resetId, otp, newpassword } = req.body;

  if (!resetId || !otp || !newpassword) {
    return res.status(400).json({
      success: false,
      message: "Reset ID, OTP, and new password are required",
    });
  }

  try {
    const isEmail = /\S+@\S+\.\S+/.test(resetId);
    const query = isEmail ? { email: resetId } : { phoneNumber: resetId };

    const user = await Auth.findOne(query);
    if (!user) {
      return res.json({
        success: false,
        message: `User not found for this ${isEmail ? "email" : "mobile number"}.`,
      });
    }

    if (!user.resetPasswordToken) {
      return res.json({
        success: false,
        message: "The OTP field is invalid or missing. Please request a new OTP.",
      });
    }

    if (user.resetPasswordToken !== otp) {
      return res.json({
        success: false,
        message: "The provided OTP is incorrect. Please try again.",
      });
    }

    if (user.resetPasswordExpire < Date.now()) {
      return res.json({
        success: false,
        message: "The OTP has expired. Please request a new password reset link or OTP.",
      });
    }

    user.password = newpassword; // hashed automatically if you use pre-save middleware
    user.resetPasswordToken = "";
    user.resetPasswordExpire = "";
    await user.save();

    res.json({
      success: true,
      message: "Your password has been successfully reset. You can now log in.",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
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