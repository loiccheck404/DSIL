const express = require("express");
const router = express.Router();
const {
  getMyOrders,
  getOrder,
  createOrder,
  updateOrderToPaid,
  getOrders,
  updateOrderToDelivered,
} = require("../controllers/orderController");
const { protect, admin } = require("../middlewares/auth");

// All order routes are protected
router.use(protect);

// User routes
router.get("/myorders", getMyOrders);
router.get("/:id", getOrder);
router.post("/", createOrder);
router.put("/:id/pay", updateOrderToPaid);

// Admin routes
router.get("/", admin, getOrders);
router.put("/:id/deliver", admin, updateOrderToDelivered);

module.exports = router;
