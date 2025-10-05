const mongoose = require("mongoose");

// ✅ Helper to generate SKU / slug
function generateSKU(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // spaces → dashes
    .replace(/[\/\\?#&%+,:;@'"\.!\$*\^()\{\}\[\]\|<>=]/g, "-") // remove special chars
    .replace(/-+/g, "-") // multiple dashes → one
    .replace(/^-|-$/g, ""); // remove leading/trailing dashes
}

const categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    categorySKU: {
      type: String,
      unique: true,
    },
    subcategories: [
      {
        name: { type: String, required: true, trim: true },
        sku: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true } // adds category createdAt & updatedAt
);

categorySchema.pre("save", function (next) {

  if (this.isModified("categoryName") || !this.categorySKU) {
    this.categorySKU = generateSKU(this.categoryName);
  }


  if (this.subcategories && this.subcategories.length > 0) {
    this.subcategories = this.subcategories.map((sub) => ({
      name: sub.name,
      sku: sub.sku || generateSKU(sub.name),
      createdAt: sub.createdAt || new Date(),
    }));
  }

  next();
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
