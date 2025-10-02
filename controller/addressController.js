// controllers/addressController.js
const Address = require("../models/addressModel");

// Create new address
exports.createAddress = async (req, res) => {
  try {
    const { userId, address, city, pincode, phone,title } = req.body;

    const newAddress = new Address({
      userId,
      address,
      title,
      city,
      pincode,
      phone,
    });

    const savedAddress = await newAddress.save();
    res.status(201).json({
      success: true,
      message: "Address created successfully",
      data: savedAddress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create address",
      error: error.message,
    });
  }
};

// Get all addresses
exports.getAllAddresses = async (req, res) => {
  try {
    const addresses = await Address.find();
    res.status(200).json({
      success: true,
      message: "All addresses fetched successfully",
      data: addresses,
      count: addresses.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch addresses",
      error: error.message,
    });
  }
};

// Get address by ID
exports.getAddressById = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
        data: null,
      });
    }
    res.status(200).json({
      success: true,
      message: "Address fetched successfully",
      data: address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch address",
      error: error.message,
    });
  }
};

// Get addresses by user ID
exports.getAddressesByUser = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.params.userId });
    res.status(200).json({
      success: true,
      message: "User addresses fetched successfully",
      data: addresses,
      count: addresses.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user addresses",
      error: error.message,
    });
  }
};

// Update address
exports.updateAddress = async (req, res) => {
  try {
    const { address, city, pincode, phone, title } = req.body;

    const updatedAddress = await Address.findByIdAndUpdate(
      req.params.id,
      { address, city, pincode, phone, title },
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: updatedAddress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update address",
      error: error.message,
    });
  }
};

// Delete address
exports.deleteAddress = async (req, res) => {
  try {
    const deletedAddress = await Address.findByIdAndDelete(req.params.id);

    if (!deletedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      data: deletedAddress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete address",
      error: error.message,
    });
  }
};
