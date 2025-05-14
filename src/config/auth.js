// Authentication configuration
const jwt = require("jsonwebtoken");

// JWT secret should be stored in environment variables in production
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const JWT_EXPIRE = process.env.JWT_EXPIRE || "1d";

module.exports = {
  JWT_SECRET,
  JWT_EXPIRE,

  // Generate JWT token
  generateToken: (userId) => {
    return jwt.sign({ id: userId }, JWT_SECRET, {
      expiresIn: JWT_EXPIRE,
    });
  },

  // Verify JWT token
  verifyToken: (token) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  },
};
