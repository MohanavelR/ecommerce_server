const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity = 1, variation } = req.body;

    if (!userId || !productId || !variation || !variation.key || !quantity) {
      return res.json({
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

    // ✅ Use latest stock from DB variation
    const availableStock = productVariation.stock;

    let cart = await Cart.findOne({ userId });

    // 🧺 If no cart, create a new one
    if (!cart) {
      if (quantity > availableStock) {
        return res.status(400).json({
          success: false,
          message: `Only ${availableStock} in stock`,
          data: null,
        });
      }

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
            stock: availableStock,
          },
        ],
      });

      return res.status(201).json({
        success: true,
        message: "Product successfully added to your cart",
        data: cart,
      });
    }

    // 🧠 If cart exists, check if item already present
    const existingItem = cart.items.find(
      (item) =>
        item.productId.toString() === productId &&
        item.variationKey === variation.key
    );

    if (existingItem) {
      const newTotalQty = existingItem.quantity + quantity;

      // ✅ Check stock before updating
      if (newTotalQty > availableStock) {
        return res.status(400).json({
          success: false,
          message: `Only ${availableStock} available in stock. You already have ${existingItem.quantity} in cart.`,
          data: null,
        });
      }

      existingItem.quantity = newTotalQty;
    } else {
      if (quantity > availableStock) {
        return res.status(400).json({
          success: false,
          message: `Only ${availableStock} in stock`,
          data: null,
        });
      }

      cart.items.push({
        productId,
        variationKey: variation.key,
        quantity,
        type: variation.type,
        value: variation.value,
        price: variation.price,
        offer: variation.offer || 0,
        image: variation.image,
        stock: availableStock,
      });
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Product successfully added to your cart",
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
  const { userId } = req.params;
  try {
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "productName category subCategory brand images _id",
      options: { lean: true },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        data: null,
      });
    }



    return res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: cart,
      count:cart.items.length
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


// Update Cart Item
const updateCart = async (req, res) => {
  try {
    const { userId, variationKey, productId, action, quantity } = req.body;
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
      (item) => item.productId.toString() === productId && item.variationKey === variationKey
    );
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
        data: null,
      });
    }

    const item = cart.items[itemIndex];

    // ✅ Get latest product and variation stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        data: null,
      });
    }

    const productVariation = product.variations.find(v => v.key === variationKey);
    if (!productVariation) {
      return res.status(404).json({
        success: false,
        message: "Product variation not found",
        data: null,
      });
    }

    const availableStock = productVariation.stock;

    switch (action) {
      case "increment":
        if (item.quantity + 1 > availableStock) {
          return res.status(400).json({
            success: false,
            message: `Cannot add more than available stock (${availableStock})`,
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
        if (!quantity || quantity < 1 || quantity > availableStock) {
          return res.status(400).json({
            success: false,
            message: `Quantity must be between 1 and ${availableStock}`,
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

module.exports = { addToCart, getCart, updateCart, deleteCartItem };

