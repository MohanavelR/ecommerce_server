const mongoose=require('mongoose')

const addressSchema=new mongoose.Schema({
    userId:mongoose.Schema.Types.ObjectId,
    address:String,
    city:String,
    pincode:String,
    phone:String,
    notes:String
},{timestamps:true})


const addressModel=mongoose.model('address',addressSchema)
module.exports=addressModel