const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
// const crypto = require("crypto");

const authSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String
    },
    email:{
         type:String,
         required:true,
          unique: true,
    },password:{
        type:String,
        required:true,
        select:false
    },role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    isVerified: { 
        type: Boolean, default: false 
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    verificationToken: String,
    verificationExpire: Date,
    isActive:{
        default:true,
        type:Boolean,
    }

},{timestamps:true})

authSchema.pre("save",async function(next){
if (!this.isModified("password")) return next();
 const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
})

authSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


// // Generate verification token
// authSchema.methods.getVerificationToken = function () {
//   const token = crypto.randomBytes(32).toString("hex");
//   this.verificationToken = crypto.createHash("sha256").update(token).digest("hex");
//   this.verificationExpire = Date.now() + 24 * 60 * 60 * 1000;
//   return token;
// };

// // Generate reset password token
// authSchema.methods.getResetPasswordToken = function () {
//   const token = crypto.randomBytes(32).toString("hex");
//   this.resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
//   this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
//   return token;
// };
const authModel=mongoose.model('User',authSchema)
module.exports=authModel