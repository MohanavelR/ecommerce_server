const mongoose=require('mongoose')
const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
    unique: true, 
  },
  subcategories: [
    {
      type: String, 
      required: true,
    },
  ],
}, { timestamps: true });

const CategoryModel = mongoose.model("Category", categorySchema);
module.exports= CategoryModel;

