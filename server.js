const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

// Load environment variables
dotenv.config();

// Database connection
const connectDB = require("./src/config/db");

// Import routes
const authRoutes = require("./src/routes/auth");
const productRoutes = require("./src/routes/products");
const cartRoutes = require("./src/routes/cart");
const orderRoutes = require("./src/routes/orders");

// Import middleware
const errorHandler = require("./src/middlewares/error");

// Connect to database
connectDB();

// Initialize express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Development logging
// In server.js - for development only
if (process.env.NODE_ENV === "development") {
  app.use(
    cors({
      origin: "http://localhost:3000", // your frontend dev server
      credentials: true,
    })
  );
}

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Serve static assets
app.use(express.static(path.join(__dirname, "public")));

// For any route that doesn't match API routes, serve the index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Error handling middleware
app.use(errorHandler);

// Set port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});
