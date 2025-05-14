const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "pre-roll",
      "pharma",
      "flower",
      "carts",
      "edibles",
      "disposables",
      "cbd",
      "accessories",
    ],
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  imageUrl: {
    type: String,
    default: "/api/placeholder/200/150",
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  metadata: {
    thc: String,
    cbd: String,
    weight: String,
    count: String,
    potency: String,
    strain: String,
    effects: [String],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
ProductSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Product", ProductSchema);
