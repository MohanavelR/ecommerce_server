// routes/cartRoutes.js
const express = require("express");
const router = express.Router();
const {
  addToCart,

  updateCart,
  deleteCartItem,
  getCart,
} = require("../controller/cartController");


router.post("/add", addToCart);

router.get("/get/:userId", getCart);

router.patch("/update", updateCart);

router.delete("/delete", deleteCartItem);

module.exports = router;
