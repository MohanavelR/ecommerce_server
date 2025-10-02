const generateSKU = require('../utils/generateSKU');
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true }, 
  stock: { type: Number, default: 0 },     
  sku: { type: String, unique: true, required: true }, 

  category: { type: String, required: true },       // ✅ plain string
  subCategory: { type: String, required: true },    // ✅ plain string
  brand: { type: String, required: true },  

  description: [{ type: String }],         
  features: [{ type: String }],
  additionalInfo: [{ type: String }],      
  images: [{ type: String }],              
  isTrending: { type: Boolean, default: false },  

  variations: [
    {
      key :{type:String,required:true,unique:true},
      type: { type: String, required: true },   // Example: "color", "size", "storage"
      value: { type: String, required: true },  // Example: "Red", "XL", "128GB"
      price: {
        current: { type: Number, required: true }, 
        original: { type: Number },
        currency: { type: String, default: "₹" }
      },
      offer: { type: Number, default: 0 },        
      stock: { type: Number, required: true }, 
      image: { type: String }                   
    }
  ]
}, { timestamps: true });

productSchema.pre("validate", function(next) {
  if (!this.sku) {
    this.sku = generateSKU(this.category, this.subCategory, this.productName);
  }
  next();
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
