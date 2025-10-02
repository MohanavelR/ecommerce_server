const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity, variation } = req.body;

    if (!userId || !productId || !variation || !variation.key || !quantity) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
        data: null,
      });

    const productVariation = product.variations.find(
      (v) => v.key === variation.key
    );
    if (!productVariation)
      return res.status(404).json({
        success: false,
        message: "Selected variation not available",
        data: null,
      });

    if (variation.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${variation.stock} in stock`,
        data: null,
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [
          {
            productId,
            variationKey: variation.key,
            quantity,
            type: variation.type,
            value: variation.value,
            price: variation.price,
            offer: variation.offer || 0,
            image: variation.image,
            stock: variation.stock,
          },
        ],
      });
      return res.status(201).json({
        success: true,
        message: "Item added to cart",
        data: cart,
      });
    }

    const existingItem = cart.items.find(
      (item) =>
        item.productId.toString() === productId &&
        item.variationKey === variation.key
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        variationKey: variation.key,
        quantity,
        type: variation.type,
        value: variation.value,
        price: variation.price,
        offer: variation.offer || 0,
        image: variation.image,
        stock: variation.stock,
      });
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      data: cart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      data: error.message,
    });
  }
};


const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "productName category subCategory brand images",
      options: { lean: true },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        data: null,
      });
    }

    let grandTotal = 0;
    const itemsWithTotal = cart.items.map((item) => {
      const discountedPrice =
        item.price.current - (item.price.current * (item.offer || 0)) / 100;
      const subtotal = discountedPrice * item.quantity;
      grandTotal += subtotal;

      return {
        ...item.toObject(),
        productDetails: item.productId,
        discountedPrice,
        subtotal,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: {
        userId: cart.userId,
        items: itemsWithTotal,
        grandTotal,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      data: error.message,
    });
  }
};

// controllers/cartController.js
const Cart = require("../models/cartModel");

// Update Cart Item
const updateCart = async (req, res) => {
  try {
    const { userId, variationKey, action, quantity } = req.body;
    // action = "increment" | "decrement" | "set" | "remove"

    if (!userId || !variationKey || !action) {
      return res.status(400).json({
        success: false,
        message: "userId, variationKey and action are required",
        data: null,
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cart is empty",
        data: null,
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.variationKey === variationKey
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
        data: null,
      });
    }

    const item = cart.items[itemIndex];

    switch (action) {
      case "increment":
        if (item.stock <= item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Cannot add more than available stock (${item.stock})`,
            data: null,
          });
        }
        item.quantity += 1;
        break;

      case "decrement":
        item.quantity -= 1;
        if (item.quantity <= 0) {
          cart.items.splice(itemIndex, 1); // remove item if quantity <= 0
        }
        break;

      case "set":
        if (!quantity || quantity < 1 || quantity > item.stock) {
          return res.status(400).json({
            success: false,
            message: `Quantity must be between 1 and ${item.stock}`,
            data: null,
          });
        }
        item.quantity = quantity;
        break;

      case "remove":
        cart.items.splice(itemIndex, 1);
        break;

      default:
        return res.status(400).json({
          success: false,
          message: "Invalid action",
          data: null,
        });
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      data: cart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      data: error.message,
    });
  }
};

// controllers/cartController.js
const Cart = require("../models/cartModel");

// Delete single item or clear entire cart
const deleteCartItem = async (req, res) => {
  try {
    const { userId, variationKey, clearAll } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cart is empty",
        data: null,
      });
    }

    if (clearAll) {
      cart.items = []; // remove all items
      await cart.save();
      return res.status(200).json({
        success: true,
        message: "Cart cleared successfully",
        data: cart,
      });
    }

    if (!variationKey) {
      return res.status(400).json({
        success: false,
        message: "variationKey is required to delete an item",
        data: null,
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.variationKey === variationKey
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
        data: null,
      });
    }

    cart.items.splice(itemIndex, 1); // remove the item
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: cart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      data: error.message,
    });
  }
};

module.exports = { deleteCartItem };

