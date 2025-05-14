// Input validation helper functions

const validator = require("validator");

// Validate email
exports.validateEmail = (email) => {
  return validator.isEmail(email);
};

// Validate password - at least 6 characters, 1 uppercase, 1 lowercase, 1 number
exports.validatePassword = (password) => {
  if (password.length < 6) {
    return {
      isValid: false,
      message: "Password must be at least 6 characters",
    };
  }

  // Check for at least 1 uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one uppercase letter",
    };
  }

  // Check for at least 1 lowercase letter
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one lowercase letter",
    };
  }

  // Check for at least 1 number
  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one number",
    };
  }

  return {
    isValid: true,
    message: "Password is valid",
  };
};

// Validate product data
exports.validateProduct = (productData) => {
  const errors = [];

  if (!productData.name || productData.name.trim() === "") {
    errors.push("Product name is required");
  }

  if (!productData.description || productData.description.trim() === "") {
    errors.push("Product description is required");
  }

  if (productData.price === undefined || productData.price <= 0) {
    errors.push("Product must have a valid price greater than 0");
  }

  if (productData.countInStock === undefined || productData.countInStock < 0) {
    errors.push("Product must have a valid count in stock (0 or greater)");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Validate shipping address
exports.validateShippingAddress = (address) => {
  const errors = [];

  if (!address.address || address.address.trim() === "") {
    errors.push("Street address is required");
  }

  if (!address.city || address.city.trim() === "") {
    errors.push("City is required");
  }

  if (!address.postalCode || address.postalCode.trim() === "") {
    errors.push("Postal code is required");
  }

  if (!address.country || address.country.trim() === "") {
    errors.push("Country is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Sanitize input to prevent XSS
exports.sanitizeInput = (input) => {
  if (typeof input === "string") {
    return validator.escape(input);
  }

  if (typeof input === "object" && input !== null) {
    const sanitized = {};

    Object.keys(input).forEach((key) => {
      sanitized[key] = exports.sanitizeInput(input[key]);
    });

    return sanitized;
  }

  if (Array.isArray(input)) {
    return input.map((item) => exports.sanitizeInput(item));
  }

  return input;
};
