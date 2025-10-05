const mongoose=require("mongoose")

const PendingUserSchema = new mongoose.Schema({
    email:{
        isRequired:true,
        type:String,
        unique:true        
    },
    otpToken:{
        type:String
    },
    otpExpireDate:{
        type:Date
    }
},{timestamps:true})

const pendingUser=mongoose.model("PendingUser",PendingUserSchema)
module.exports=pendingUser