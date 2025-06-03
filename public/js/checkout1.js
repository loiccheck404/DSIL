// Checkout Page Logic
document.addEventListener("DOMContentLoaded", function () {
  // Initialize variables
  let currentStep = 1;
  const totalSteps = 3;
  let shippingData = {};
  let paymentData = {};
  let orderNotes = "";
  let shippingCost = 9.99; // Default shipping cost

  // DOM Elements
  const checkoutSteps = document.querySelectorAll(".checkout-step");
  const nextButtons = document.querySelectorAll(".next-step");
  const prevButtons = document.querySelectorAll(".prev-step");
  const editButtons = document.querySelectorAll(".edit-btn");
  const shippingForm = document.getElementById("shipping-form");
  const paymentForm = document.getElementById("payment-form");
  const placeOrderBtn = document.getElementById("place-order-btn");
  const termsAgreement = document.getElementById("terms-agreement");
  const shippingOptions = document.querySelectorAll('input[name="shipping"]');
  const paymentMethods = document.querySelectorAll(
    'input[name="payment-method"]'
  );
  const couponInput = document.querySelector(".coupon-code input");
  const couponButton = document.querySelector(".coupon-code button");
  const orderNotesField = document.getElementById("notes");
  const subtotalElement = document.querySelector(
    ".total-line:nth-child(1) span:last-child"
  );
  const shippingElement = document.querySelector(
    ".total-line:nth-child(2) span:last-child"
  );
  const taxElement = document.querySelector(
    ".total-line:nth-child(3) span:last-child"
  );
  const totalElement = document.querySelector(".total-amount span:last-child");

  // Cart items (could be loaded from localStorage in a real app)
  const cartItems = [
    {
      name: "Premium Pre-roll Pack",
      description: "Pre-roll • THC: 22%",
      quantity: 2,
      price: 25.0,
      image: "/api/placeholder/60/60",
    },
    {
      name: "CBD Pain Relief Capsules",
      description: "Pharma • 30mg CBD",
      quantity: 1,
      price: 45.0,
      image: "/api/placeholder/60/60",
    },
  ];

  // Initialize the checkout
  function initCheckout() {
    // Initialize step navigation
    setupStepNavigation();

    // Initialize payment method toggles
    setupPaymentMethodToggles();

    // Load cart items
    loadCartItems();

    // Calculate order summary
    updateOrderSummary();

    // Setup shipping option changes
    setupShippingOptions();

    // Setup coupon code
    setupCouponCode();

    // Setup form validation
    setupFormValidation();

    // Setup order placement
    setupOrderPlacement();
  }

  // Setup step navigation
  function setupStepNavigation() {
    // Next step buttons
    nextButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const nextStepId = this.getAttribute("data-next");
        const currentStepElement = this.closest(".checkout-step");
        const nextStepNumber = parseInt(nextStepId.split("-")[1]);

        // Validate current step before proceeding
        if (validateStep(currentStepElement.id)) {
          // If it's step 1, save shipping data
          if (currentStepElement.id === "step-1") {
            saveShippingData();
            updateShippingReview();
          }

          // If it's step 2, save payment data
          if (currentStepElement.id === "step-2") {
            savePaymentData();
            updatePaymentReview();
          }

          // Update current step
          currentStep = nextStepNumber;

          // Hide current step and show next step
          currentStepElement.classList.remove("active");
          document.getElementById(nextStepId).classList.add("active");

          // Scroll to top of the step
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
    });

    // Previous step buttons
    prevButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const prevStepId = this.getAttribute("data-prev");
        const currentStepElement = this.closest(".checkout-step");
        const prevStepNumber = parseInt(prevStepId.split("-")[1]);

        // Update current step
        currentStep = prevStepNumber;

        // Hide current step and show previous step
        currentStepElement.classList.remove("active");
        document.getElementById(prevStepId).classList.add("active");

        // Scroll to top of the step
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });

    // Edit buttons
    editButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const editStepId = this.getAttribute("data-edit");
        const currentStepElement = this.closest(".checkout-step");
        const editStepNumber = parseInt(editStepId.split("-")[1]);

        // Update current step
        currentStep = editStepNumber;

        // Hide current step and show edit step
        currentStepElement.classList.remove("active");
        document.getElementById(editStepId).classList.add("active");

        // Scroll to top of the step
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }

  // Validate step
  function validateStep(stepId) {
    let isValid = true;

    // Validate shipping step
    if (stepId === "step-1") {
      const requiredFields = shippingForm.querySelectorAll("[required]");

      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          markFieldAsInvalid(field);
          isValid = false;
        } else {
          markFieldAsValid(field);
        }
      });

      // Validate email format
      const emailField = document.getElementById("email");
      if (emailField.value && !isValidEmail(emailField.value)) {
        markFieldAsInvalid(emailField);
        isValid = false;
      }

      // Validate phone format
      const phoneField = document.getElementById("phone");
      if (phoneField.value && !isValidPhone(phoneField.value)) {
        markFieldAsInvalid(phoneField);
        isValid = false;
      }

      // Validate ZIP code
      const zipField = document.getElementById("zip");
      if (zipField.value && !isValidZip(zipField.value)) {
        markFieldAsInvalid(zipField);
        isValid = false;
      }
    }

    // Validate payment step
    if (stepId === "step-2") {
      const selectedPaymentMethod = document.querySelector(
        'input[name="payment-method"]:checked'
      ).value;

      if (selectedPaymentMethod === "credit-card") {
        const cardNumber = document.getElementById("card-number");
        const expiry = document.getElementById("expiry");
        const cvv = document.getElementById("cvv");
        const cardName = document.getElementById("card-name");

        // Validate card number
        if (!cardNumber.value.trim() || !isValidCardNumber(cardNumber.value)) {
          markFieldAsInvalid(cardNumber);
          isValid = false;
        } else {
          markFieldAsValid(cardNumber);
        }

        // Validate expiry date
        if (!expiry.value.trim() || !isValidExpiry(expiry.value)) {
          markFieldAsInvalid(expiry);
          isValid = false;
        } else {
          markFieldAsValid(expiry);
        }

        // Validate CVV
        if (!cvv.value.trim() || !isValidCVV(cvv.value)) {
          markFieldAsInvalid(cvv);
          isValid = false;
        } else {
          markFieldAsValid(cvv);
        }

        // Validate card name
        if (!cardName.value.trim()) {
          markFieldAsInvalid(cardName);
          isValid = false;
        } else {
          markFieldAsValid(cardName);
        }
      }
    }

    // If not valid, show an alert
    if (!isValid) {
      alert("Please fill in all required fields correctly before proceeding.");
    }

    return isValid;
  }

  // Setup payment method toggles
  function setupPaymentMethodToggles() {
    paymentMethods.forEach((method) => {
      method.addEventListener("change", function () {
        // Hide all payment details
        document.querySelectorAll(".payment-details").forEach((detail) => {
          detail.classList.add("hidden");
        });

        // Show selected payment method details
        document
          .getElementById(`${this.value}-details`)
          .classList.remove("hidden");
      });
    });
  }

  // Load cart items
  function loadCartItems() {
    const cartItemsContainer = document.querySelector(".cart-items");
    cartItemsContainer.innerHTML = "";

    cartItems.forEach((item) => {
      const cartItemElement = document.createElement("div");
      cartItemElement.className = "cart-item";

      cartItemElement.innerHTML = `
          <img src="${item.image}" alt="${item.name}" />
          <div class="item-details">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <div class="item-quantity">
              <span>Qty: ${item.quantity}</span>
            </div>
          </div>
          <div class="item-price">$${(item.price * item.quantity).toFixed(
            2
          )}</div>
        `;

      cartItemsContainer.appendChild(cartItemElement);
    });
  }

  // Update order summary
  function updateOrderSummary() {
    // Calculate subtotal
    const subtotal = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Calculate tax (9% for example)
    const taxRate = 0.09;
    const tax = subtotal * taxRate;

    // Calculate total
    const total = subtotal + shippingCost + tax;

    // Update DOM elements
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    shippingElement.textContent = `$${shippingCost.toFixed(2)}`;
    taxElement.textContent = `$${tax.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
  }

  // Setup shipping options
  function setupShippingOptions() {
    shippingOptions.forEach((option) => {
      option.addEventListener("change", function () {
        // Update shipping cost based on selection
        if (this.value === "standard") {
          shippingCost = 9.99;
        } else if (this.value === "express") {
          shippingCost = 19.99;
        }

        // Update order summary
        updateOrderSummary();
      });
    });
  }

  // Setup coupon code
  function setupCouponCode() {
    // Available coupon codes (would typically come from a database)
    const availableCoupons = {
      WELCOME10: {
        discount: 0.1,
        type: "percent",
      },
      FREESHIP: {
        discount: 9.99,
        type: "fixed",
      },
    };

    couponButton.addEventListener("click", function () {
      const couponCode = couponInput.value.trim().toUpperCase();

      if (couponCode && availableCoupons[couponCode]) {
        const coupon = availableCoupons[couponCode];

        // Calculate subtotal
        const subtotal = cartItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );

        // Apply discount
        if (coupon.type === "percent") {
          const discountAmount = subtotal * coupon.discount;
          const newSubtotal = subtotal - discountAmount;

          // Update subtotal
          subtotalElement.textContent = `$${newSubtotal.toFixed(2)}`;

          // Add discount line
          const discountLine = document.createElement("div");
          discountLine.className = "total-line";
          discountLine.innerHTML = `
              <span>Discount (${coupon.discount * 100}%)</span>
              <span>-$${discountAmount.toFixed(2)}</span>
            `;

          // Insert after subtotal
          const orderTotals = document.querySelector(".order-totals");
          orderTotals.insertBefore(discountLine, orderTotals.children[1]);

          // Recalculate tax and total
          const tax = newSubtotal * 0.09;
          const total = newSubtotal + shippingCost + tax;

          // Update tax and total
          taxElement.textContent = `$${tax.toFixed(2)}`;
          totalElement.textContent = `$${total.toFixed(2)}`;
        } else if (coupon.type === "fixed") {
          // Apply free shipping
          shippingCost = 0;
          shippingElement.textContent = `$${shippingCost.toFixed(2)}`;

          // Recalculate total
          const total = subtotal + shippingCost + subtotal * 0.09;
          totalElement.textContent = `$${total.toFixed(2)}`;
        }

        // Disable coupon input and button
        couponInput.disabled = true;
        couponButton.disabled = true;
        couponButton.textContent = "Applied";
        couponButton.classList.add("btn-success");

        // Show success message
        alert(`Coupon "${couponCode}" applied successfully!`);
      } else {
        // Invalid coupon
        alert("Invalid coupon code. Please try again.");
      }
    });
  }

  // Save shipping data
  function saveShippingData() {
    shippingData = {
      fullName: document.getElementById("fullname").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      address: document.getElementById("address").value,
      address2: document.getElementById("address2").value,
      city: document.getElementById("city").value,
      state: document.getElementById("state").value,
      zip: document.getElementById("zip").value,
      shipping: document.querySelector('input[name="shipping"]:checked').value,
    };
  }

  // Save payment data
  function savePaymentData() {
    const selectedPaymentMethod = document.querySelector(
      'input[name="payment-method"]:checked'
    ).value;

    paymentData = {
      method: selectedPaymentMethod,
    };

    if (selectedPaymentMethod === "credit-card") {
      paymentData.cardNumber = document.getElementById("card-number").value;
      paymentData.expiry = document.getElementById("expiry").value;
      paymentData.cvv = document.getElementById("cvv").value;
      paymentData.cardName = document.getElementById("card-name").value;
    } else if (selectedPaymentMethod === "crypto") {
      paymentData.cryptoType = document.querySelector(
        'input[name="crypto-type"]:checked'
      ).value;
    }
  }

  // Update shipping review
  function updateShippingReview() {
    const shippingReview = document.getElementById("shipping-review");

    shippingReview.innerHTML = `
        <p>${shippingData.fullName}</p>
        <p>${shippingData.address}${
      shippingData.address2 ? ", " + shippingData.address2 : ""
    }</p>
        <p>${shippingData.city}, ${shippingData.state} ${shippingData.zip}</p>
        <p>Email: ${shippingData.email}</p>
        <p>Phone: ${shippingData.phone}</p>
        <p>Shipping: ${
          shippingData.shipping === "standard"
            ? "Standard Shipping ($9.99)"
            : "Express Shipping ($19.99)"
        }</p>
      `;
  }

  // Update payment review
  function updatePaymentReview() {
    const paymentReview = document.getElementById("payment-review");

    if (paymentData.method === "credit-card") {
      // Get last 4 digits of card number
      const lastFour = paymentData.cardNumber.slice(-4);

      paymentReview.innerHTML = `
          <p>Credit Card (ending in ${lastFour})</p>
          <p>Expiry: ${paymentData.expiry}</p>
          <p>Card Holder: ${paymentData.cardName}</p>
        `;
    } else if (paymentData.method === "paypal") {
      paymentReview.innerHTML = `
          <p>PayPal</p>
          <p>You will be redirected to PayPal to complete payment.</p>
        `;
    } else if (paymentData.method === "crypto") {
      paymentReview.innerHTML = `
          <p>Cryptocurrency: ${
            paymentData.cryptoType.charAt(0).toUpperCase() +
            paymentData.cryptoType.slice(1)
          }</p>
        `;
    }
  }

  // Setup form validation
  function setupFormValidation() {
    // Add input event listeners to all form fields
    const formFields = document.querySelectorAll("input, select, textarea");

    formFields.forEach((field) => {
      field.addEventListener("input", function () {
        // Validate field
        validateField(field);
      });

      field.addEventListener("blur", function () {
        // Validate field
        validateField(field);
      });
    });

    // Format card number with spaces
    const cardNumberInput = document.getElementById("card-number");
    if (cardNumberInput) {
      cardNumberInput.addEventListener("input", function () {
        const value = this.value.replace(/\s+/g, "");
        const formattedValue = value.replace(/(\d{4})/g, "$1 ").trim();
        this.value = formattedValue;
      });
    }

    // Format expiry date
    const expiryInput = document.getElementById("expiry");
    if (expiryInput) {
      expiryInput.addEventListener("input", function () {
        const value = this.value.replace(/\D/g, "");

        if (value.length > 2) {
          this.value = value.slice(0, 2) + "/" + value.slice(2, 4);
        } else {
          this.value = value;
        }
      });
    }
  }

  // Validate field
  function validateField(field) {
    const fieldId = field.id;

    // Skip if field is not required and empty
    if (!field.required && !field.value.trim()) {
      markFieldAsValid(field);
      return;
    }

    // Validate based on field type or ID
    switch (fieldId) {
      case "email":
        if (!isValidEmail(field.value)) {
          markFieldAsInvalid(field);
        } else {
          markFieldAsValid(field);
        }
        break;

      case "phone":
        if (!isValidPhone(field.value)) {
          markFieldAsInvalid(field);
        } else {
          markFieldAsValid(field);
        }
        break;

      case "zip":
        if (!isValidZip(field.value)) {
          markFieldAsInvalid(field);
        } else {
          markFieldAsValid(field);
        }
        break;

      case "card-number":
        if (!isValidCardNumber(field.value)) {
          markFieldAsInvalid(field);
        } else {
          markFieldAsValid(field);
        }
        break;

      case "expiry":
        if (!isValidExpiry(field.value)) {
          markFieldAsInvalid(field);
        } else {
          markFieldAsValid(field);
        }
        break;

      case "cvv":
        if (!isValidCVV(field.value)) {
          markFieldAsInvalid(field);
        } else {
          markFieldAsValid(field);
        }
        break;

      default:
        // Required field check
        if (field.required && !field.value.trim()) {
          markFieldAsInvalid(field);
        } else {
          markFieldAsValid(field);
        }
    }
  }

  // Mark field as invalid
  function markFieldAsInvalid(field) {
    const formGroup = field.closest(".form-group");

    formGroup.classList.add("invalid");
    formGroup.classList.remove("valid");

    // Add error message if it doesn't exist
    let errorMessage = formGroup.querySelector(".error-message");

    if (!errorMessage) {
      errorMessage = document.createElement("div");
      errorMessage.className = "error-message";
      formGroup.appendChild(errorMessage);
    }

    // Set error message text based on field
    switch (field.id) {
      case "email":
        errorMessage.textContent = "Please enter a valid email address";
        break;

      case "phone":
        errorMessage.textContent = "Please enter a valid phone number";
        break;

      case "zip":
        errorMessage.textContent = "Please enter a valid ZIP code";
        break;

      case "card-number":
        errorMessage.textContent = "Please enter a valid card number";
        break;

      case "expiry":
        errorMessage.textContent = "Please enter a valid expiry date (MM/YY)";
        break;

      case "cvv":
        errorMessage.textContent = "Please enter a valid CVV code";
        break;

      default:
        errorMessage.textContent = "This field is required";
    }

    errorMessage.classList.add("visible");
  }

  // Mark field as valid
  function markFieldAsValid(field) {
    const formGroup = field.closest(".form-group");

    formGroup.classList.remove("invalid");
    formGroup.classList.add("valid");

    // Hide error message if it exists
    const errorMessage = formGroup.querySelector(".error-message");

    if (errorMessage) {
      errorMessage.classList.remove("visible");
    }
  }

  // Setup order placement
  function setupOrderPlacement() {
    // Save order notes
    orderNotesField.addEventListener("input", function () {
      orderNotes = this.value;
    });

    // Place order button
    placeOrderBtn.addEventListener("click", function () {
      if (!termsAgreement.checked) {
        alert("Please agree to the Terms and Conditions to place your order.");
        return;
      }

      // Add loading state
      this.classList.add("loading-btn", "loading");
      this.innerHTML = '<div class="spinner"></div><span>Processing...</span>';

      // Simulate order processing
      setTimeout(() => {
        // Compile order data
        const orderData = {
          shipping: shippingData,
          payment: paymentData,
          items: cartItems,
          notes: orderNotes,
          total: parseFloat(totalElement.textContent.replace("$", "")),
          orderDate: new Date().toISOString(),
        };

        // In a real application, you would send this data to your server
        console.log("Order Data:", orderData);

        // Show success message
        const checkoutSection = document.querySelector(
          ".checkout-section .container"
        );
        const successMessage = document.createElement("div");
        successMessage.className = "success-message";
        successMessage.innerHTML = `
            <h2><i class="fas fa-check-circle"></i> Thank you for your order!</h2>
            <p>Order #${generateOrderNumber()} has been placed successfully.</p>
            <p>We've sent a confirmation email to ${shippingData.email}</p>
            <p>You will receive your items in ${
              shippingData.shipping === "standard" ? "3-5" : "1-2"
            } business days.</p>
            <a href="index.html" class="btn btn-primary">Return to Home</a>
          `;

        // Replace checkout form with success message
        checkoutSection.innerHTML = "";
        checkoutSection.appendChild(successMessage);

        // Clear local storage cart (in a real application)
        // localStorage.removeItem('cart');

        // Scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 2000); // Simulate 2 second processing time
    });
  }

  // Helper function to validate email
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Helper function to validate phone
  function isValidPhone(phone) {
    const phoneRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    return phoneRegex.test(phone);
  }

  // Helper function to validate ZIP code
  function isValidZip(zip) {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zip);
  }

  // Helper function to validate card number
  function isValidCardNumber(cardNumber) {
    // Remove spaces
    const sanitizedNumber = cardNumber.replace(/\s+/g, "");
    // Check if it's 16 digits
    return /^\d{16}$/.test(sanitizedNumber);
  }

  // Helper function to validate expiry date
  function isValidExpiry(expiry) {
    // Check format MM/YY
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      return false;
    }

    const [month, year] = expiry.split("/").map(Number);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; // Get last two digits
    const currentMonth = currentDate.getMonth() + 1; // getMonth() is 0-indexed

    // Check if month is valid (1-12)
    if (month < 1 || month > 12) {
      return false;
    }

    // Check if expiry date is in the future
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return false;
    }

    return true;
  }

  // Helper function to validate CVV
  function isValidCVV(cvv) {
    // 3 or 4 digits
    return /^\d{3,4}$/.test(cvv);
  }

  // Generate random order number
  function generateOrderNumber() {
    const prefix = "ORD";
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `${prefix}-${timestamp}-${random}`;
  }

  // Initialize the checkout
  initCheckout();
});
