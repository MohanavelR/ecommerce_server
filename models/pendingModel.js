const mongoose=require("mongoose")

const PendingUserSchema = new mongoose.Schema({
    firstName:{
        isRequired:true,
        type:String
    },
    lastName:{
        type:String
    },
    email:{
        isRequired:true,
        type:String,
        unique:true        
    },
    phoneNumber:{
        isRequired:true,
        type:String,
        unique:true   
    },
    otpToken:{
        type:String
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    otpExpireDate:{
        type:Date
    }
},{timestamps:true})

const pendingUser=mongoose.model("PendingUser",PendingUserSchema)
module.exports=pendingUser