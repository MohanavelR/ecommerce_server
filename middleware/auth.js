const jwt = require('jsonwebtoken');
const authModel = require('../models/authModel');


const authMiddleware = async(req,res,next)=>{
  const { token } = req.cookies;
  if (!token){
    return res.json({
        success:false,
        message:"You are not authorized to access this resource."})
  }
  try{
      const decoded= jwt.verify(token,process.env.JWT_SECRET_KEY) ;
       const user = await authModel.findById(decoded.user_id)
       if (!user){
        return res.json({
        success:false,
        message:"You are not authorized to access this resource."})
       }
       req.user=user
       next()
  }
  catch(e){
     return res.json({
        success:false,
        message:e.message})
  }
  }
module.exports={
    authMiddleware
}
