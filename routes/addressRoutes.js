// routes/addressRoutes.js
const express = require("express");
const router = express.Router();
const addressController = require("../controller/addressController");

// Create a new address
router.post("/create", addressController.createAddress);

// Get all addresses
router.get("/get", addressController.getAllAddresses);

// Get address by ID
router.get("/get/:id", addressController.getAddressById);

// Get addresses by user ID
router.get("/user/:userId", addressController.getAddressesByUser);

// Update address
router.put("/update/:id", addressController.updateAddress);

// Delete address
router.delete("/delete/:id", addressController.deleteAddress);

module.exports = router;
