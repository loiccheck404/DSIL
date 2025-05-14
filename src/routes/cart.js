const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController");
const { protect } = require("../middlewares/auth");

// All cart routes are protected
router.use(protect);

// Get cart
router.get("/", getCart);

// Add item to cart
router.post("/add", addToCart);

// Update cart item quantity
router.put("/update", updateCartItem);

// Remove item from cart
router.delete("/remove/:productId", removeCartItem);

// Clear cart
router.delete("/clear", clearCart);

module.exports = router;
