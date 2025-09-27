const generateSKU= require('../utils/generateSKU');

const mongoose=require('mongoose')

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true }, 
  stock: { type: Number },     
  sku: { type: String, unique: true, required: true }, 
  price: {
    current: { type: Number, required: true },
    original: { type: Number },
    currency: { type: String, default: "₹" }
  },
  category: { 
    type: String, 
    ref: "Category", 
    required: true 
  }, // Reference to Category
  subCategory: { type: String, required: true },       
  brand: { type: String },
  offer: { type: String },
  description: [{ type: String }],         
  features: [{ type: String }],
  additionalInfo: [{ type: String }],      
  images: [{ type: String }],              
  isTrending: { type: Boolean, default: false },  
  variations: [
    {
      type: { type: String, required: true },  
      value: { type: String, required: true }, 
      price: { type: Number, default: 0 },     
      stock: { type: Number, required: true }, 
      images: [{ type: String }]               
    }
  ]
}, { timestamps: true });

productSchema.pre("validate", function(next) {
  if (!this.sku) {
    this.sku=generateSKU(this.category,this.subCategory,this.productName)
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports= Product;
