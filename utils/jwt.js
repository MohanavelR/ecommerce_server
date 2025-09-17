const jwt=require("jsonwebtoken")

const createToken =async(user_id)=>{
const token = jwt.sign({user_id},process.env.JWT_SECRET_KEY,{expiresIn:"7d"})
return token
}
const verifyToken=async(token)=>{
 return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { createToken, verifyToken };