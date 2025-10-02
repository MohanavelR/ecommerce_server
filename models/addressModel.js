const mongoose=require('mongoose')

const addressSchema = new mongoose.Schema({
    title: { 
        type: String, 
        trim: true,
        required: true,
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
    },
    address: { 
        type: String, 
        trim: true,
        required: true,
        maxlength: 255
    },
    city: { 
        type: String, 
        trim: true,
        required: true
    },
    pincode: { 
        type: String, 
        trim: true,
        required: true,
       
    },
    phone: { 
        type: String, 
        trim: true,
        required: true,
    },
}, { 
    timestamps: true 
});


const Address=mongoose.model('address',addressSchema)
module.exports=Address