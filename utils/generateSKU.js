function generateSKU(category, subCategory, productName) {
  const prefix = category.toUpperCase();   
  const sub = subCategory.toUpperCase();   
  const name = productName.toUpperCase();   
  const random = Math.floor(1000 + Math.random() * 9000);   // 4-digit number
  return `${prefix}-${sub}-${name}-${random}`;
}
module.exports=generateSKU
