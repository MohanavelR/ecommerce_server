const  authModel=require("../models/authModel")
const  { createToken } =require("../utils/jwt")
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
    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
  console.log(error)
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
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid password. Please try again",
        });
    }
    const token = await createToken(user._id);
    await res.cookie('token',token,{
                        httpOnly:true,
                        secure: process.env.NODE_ENV=='production',
                        sameSite:process.env.NODE_ENV ==='production'? 'none' : 'lax',
                        maxAge : 7 * 24 * 60 * 60 * 1000}) 
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
     console.log(error)
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
     console.log(error)
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
    console.log(error)
    res.json({
      message: error.message,
      success: false,
    });
  }
};
module.exports={createUser,getCurrentUser,login,logout}