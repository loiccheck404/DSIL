// Checkout functionality
document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const cartBtn = document.getElementById("cartbtn");
  const checkoutContainer = document.getElementById("checkout-container");

  // Initialize cart from localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // If checkout button is clicked in cart modal
  window.proceedToCheckout = function () {
    // Close the cart modal if it's open
    const cartModal = document.querySelector(".cart-modal-container");
    if (cartModal) {
      cartModal.remove();
    }

    // Show checkout interface
    showCheckoutInterface();
  };

  // Display checkout interface
  function showCheckoutInterface() {
    // Verify user is logged in
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      showNotification("Please login to checkout", "error");
      const loginBtn = document.getElementById("loginbtn");
      if (loginBtn) {
        loginBtn.click(); // Open login modal
      }
      return;
    }

    // Verify cart has items
    if (cart.length === 0) {
      showNotification("Your cart is empty", "error");
      return;
    }

    // Calculate total
    let cartTotal = 0;
    cart.forEach((item) => {
      const price = parseFloat(item.price.replace("$", ""));
      cartTotal += price * item.quantity;
    });

    // Tax calculation (assuming 8.5% tax rate)
    const taxRate = 0.085;
    const taxAmount = cartTotal * taxRate;
    const orderTotal = cartTotal + taxAmount;

    // Create checkout modal
    const modalContainer = document.createElement("div");
    modalContainer.className = "checkout-modal-container";

    modalContainer.innerHTML = `
          <div class="checkout-modal">
            <div class="checkout-modal-content">
              <span class="close-modal">&times;</span>
              <h2>Checkout</h2>
              
              <div class="checkout-sections">
                <div class="checkout-section">
                  <h3>Order Summary</h3>
                  <div class="order-items">
                    ${cart
                      .map(
                        (item) => `
                      <div class="order-item">
                        <div class="order-item-image">
                          <img src="${item.image}" alt="${item.title}">
                        </div>
                        <div class="order-item-info">
                          <h4>${item.title}</h4>
                          <p class="order-item-price">${item.price} × ${
                          item.quantity
                        }</p>
                        </div>
                        <div class="order-item-total">
                          $${(
                            parseFloat(item.price.replace("$", "")) *
                            item.quantity
                          ).toFixed(2)}
                        </div>
                      </div>
                    `
                      )
                      .join("")}
                  </div>
                  
                  <div class="order-summary">
                    <div class="summary-row">
                      <span>Subtotal:</span>
                      <span>$${cartTotal.toFixed(2)}</span>
                    </div>
                    <div class="summary-row">
                      <span>Tax (8.5%):</span>
                      <span>$${taxAmount.toFixed(2)}</span>
                    </div>
                    <div class="summary-row total">
                      <span>Total:</span>
                      <span>$${orderTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div class="checkout-section">
                  <h3>Shipping Information</h3>
                  <form id="shipping-form" class="checkout-form">
                    <div class="form-row">
                      <div class="form-group">
                        <label for="firstName">First Name</label>
                        <input type="text" id="firstName" name="firstName" required value="${
                          currentUser.firstName || ""
                        }">
                      </div>
                      <div class="form-group">
                        <label for="lastName">Last Name</label>
                        <input type="text" id="lastName" name="lastName" required value="${
                          currentUser.lastName || ""
                        }">
                      </div>
                    </div>
                    
                    <div class="form-group">
                      <label for="address">Street Address</label>
                      <input type="text" id="address" name="address" required>
                    </div>
                    
                    <div class="form-row">
                      <div class="form-group">
                        <label for="city">City</label>
                        <input type="text" id="city" name="city" required>
                      </div>
                      <div class="form-group">
                        <label for="state">State</label>
                        <input type="text" id="state" name="state" required>
                      </div>
                      <div class="form-group">
                        <label for="zipCode">ZIP Code</label>
                        <input type="text" id="zipCode" name="zipCode" required>
                      </div>
                    </div>
                    
                    <div class="form-group">
                      <label for="phone">Phone Number</label>
                      <input type="tel" id="phone" name="phone" required>
                    </div>
                  </form>
                </div>
                
   <div class="checkout-section">
                <h3>Payment Method</h3>
                <form id="payment-form" class="checkout-form">
                  <div class="form-group">
                    <label for="paymentMethod">Select Payment Method</label>
                    <select id="paymentMethod" name="paymentMethod" required>
                      <option value="" disabled selected>Choose a payment method</option>
                      <option value="creditCard">Credit Card</option>
                      <option value="paypal">PayPal</option>
                      <option value="applePay">Apple Pay</option>
                      <option value="googlePay">Google Pay</option>
                    </select>
                  </div>
                  
                  <div id="creditCard-form" class="payment-method-form">
                    <div class="form-group">
                      <label for="cardName">Name on Card</label>
                      <input type="text" id="cardName" name="cardName" placeholder="Enter cardholder name">
                    </div>
                    
                    <div class="form-group card-number-group">
                      <label for="cardNumber">Card Number</label>
                      <input type="text" id="cardNumber" name="cardNumber" placeholder="•••• •••• •••• ••••">
                      <div class="card-type-indicator"></div>
                    </div>
                    
                    <div class="form-row">
                      <div class="form-group">
                        <label for="expDate">Expiration Date</label>
                        <input type="text" id="expDate" name="expDate" placeholder="MM/YY">
                      </div>
                      <div class="form-group">
                        <label for="cvv">CVV</label>
                        <input type="text" id="cvv" name="cvv" placeholder="•••">
                      </div>
                    </div>
                  </div>
                  
                  <div id="paypal-form" class="payment-method-form" style="display: none;">
                    <div class="paypal-info">
                      <p>You will be redirected to PayPal to complete your payment securely.</p>
                    </div>
                    <div class="form-group">
                      <label for="paypalEmail">PayPal Email</label>
                      <input type="email" id="paypalEmail" name="paypalEmail" placeholder="your-email@example.com">
                    </div>
                  </div>
                  
                  <div id="applePay-form" class="payment-method-form" style="display: none;">
                    <div class="apple-pay-button">
                      <p>Pay with Apple Pay</p>
                    </div>
                    <p>Click "Place Order" to proceed with Apple Pay for a secure, quick checkout.</p>
                  </div>
                  
                  <div id="googlePay-form" class="payment-method-form" style="display: none;">
                    <div class="google-pay-button">
                      <p>Pay with Google Pay</p>
                    </div>
                    <p>Click "Place Order" to proceed with Google Pay for a secure, quick checkout.</p>
                  </div>
                </form>
              </div>
            </div>
            
            <div class="checkout-actions">
              <button class="btn back-btn" id="back-to-cart">Back to Cart</button>
              <button class="btn place-order-btn" id="place-order">Place Order</button>
            </div>
          </div>
        </div>
      `;

    document.body.appendChild(modalContainer);
    modalContainer.style.display = "flex";

    // Handle payment method selection
    const paymentMethodSelect = document.getElementById("paymentMethod");
    const creditCardForm = document.getElementById("creditCard-form");
    const paypalForm = document.getElementById("paypal-form");
    const applePayForm = document.getElementById("applePay-form");
    const googlePayForm = document.getElementById("googlePay-form");

    // Initially hide all payment forms except credit card
    hideAllPaymentForms();

    // Show credit card form by default if no payment method is selected
    if (paymentMethodSelect.value === "") {
      creditCardForm.style.display = "none";
    }

    // Payment method change handler
    paymentMethodSelect.addEventListener("change", function () {
      // Hide all payment forms
      hideAllPaymentForms();

      // Show the selected payment form
      const selectedMethod = this.value;
      switch (selectedMethod) {
        case "creditCard":
          creditCardForm.style.display = "block";
          break;
        case "paypal":
          paypalForm.style.display = "block";
          break;
        case "applePay":
          applePayForm.style.display = "block";
          break;
        case "googlePay":
          googlePayForm.style.display = "block";
          break;
      }
    });

    function hideAllPaymentForms() {
      const paymentForms = document.querySelectorAll(".payment-method-form");
      paymentForms.forEach((form) => {
        form.style.display = "none";
      });
    }

    // Close modal when clicking the X or outside the modal
    const closeModal = modalContainer.querySelector(".close-modal");
    closeModal.addEventListener("click", function () {
      modalContainer.remove();
    });

    window.addEventListener("click", function (e) {
      if (e.target === modalContainer) {
        modalContainer.remove();
      }
    });

    // Back to cart button
    const backToCartBtn = document.getElementById("back-to-cart");
    backToCartBtn.addEventListener("click", function () {
      modalContainer.remove();
      showCartModal(); // This function is defined in cart.js
    });

    // Place order button
    const placeOrderBtn = document.getElementById("place-order");
    placeOrderBtn.addEventListener("click", function () {
      // Validate shipping form
      const shippingForm = document.getElementById("shipping-form");
      const paymentForm = document.getElementById("payment-form");
      const selectedPaymentMethod = paymentMethodSelect.value;

      // Validate shipping information
      if (!shippingForm.checkValidity()) {
        showNotification("Please fill out all shipping information", "error");
        return;
      }

      // Validate payment method selection
      if (!selectedPaymentMethod) {
        showNotification("Please select a payment method", "error");
        return;
      }

      // Validate payment method specific fields
      if (!validatePaymentMethod(selectedPaymentMethod)) {
        return;
      }

      // Process the order with the selected payment method
      processOrder(modalContainer, selectedPaymentMethod);
    });

    // Validate payment method based on selected type
    function validatePaymentMethod(method) {
      switch (method) {
        case "creditCard":
          // Validate credit card fields
          const cardName = document.getElementById("cardName").value;
          const cardNumber = document.getElementById("cardNumber").value;
          const expDate = document.getElementById("expDate").value;
          const cvv = document.getElementById("cvv").value;

          if (!cardName || !cardNumber || !expDate || !cvv) {
            showNotification(
              "Please fill out all credit card information",
              "error"
            );
            return false;
          }

          // Basic validation for card number format (16 digits, can include spaces)
          const cardNumberClean = cardNumber.replace(/\s/g, "");
          if (!/^\d{16}$/.test(cardNumberClean)) {
            showNotification(
              "Please enter a valid 16-digit card number",
              "error"
            );
            return false;
          }

          // Basic validation for expiration date (MM/YY format)
          if (!/^\d{2}\/\d{2}$/.test(expDate)) {
            showNotification(
              "Please enter a valid expiration date (MM/YY)",
              "error"
            );
            return false;
          }

          // Basic validation for CVV (3 or 4 digits)
          if (!/^\d{3,4}$/.test(cvv)) {
            showNotification(
              "Please enter a valid CVV code (3 or 4 digits)",
              "error"
            );
            return false;
          }

          return true;

        case "paypal":
          // Validate PayPal email
          const paypalEmail = document.getElementById("paypalEmail").value;
          if (!paypalEmail) {
            showNotification("Please enter your PayPal email", "error");
            return false;
          }

          // Basic email validation
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paypalEmail)) {
            showNotification("Please enter a valid email address", "error");
            return false;
          }

          return true;

        case "applePay":
          // Apple Pay doesn't require additional validation here
          // In a real implementation, we would verify device compatibility
          return true;

        case "googlePay":
          // Google Pay doesn't require additional validation here
          // In a real implementation, we would verify device compatibility
          return true;

        default:
          showNotification("Please select a valid payment method", "error");
          return false;
      }
    }

    // Format card number as user types (add spaces every 4 digits)
    const cardNumberInput = document.getElementById("cardNumber");
    if (cardNumberInput) {
      cardNumberInput.addEventListener("input", function (e) {
        let value = e.target.value.replace(/\D/g, "");
        let formattedValue = "";

        for (let i = 0; i < value.length; i++) {
          if (i > 0 && i % 4 === 0) {
            formattedValue += " ";
          }
          formattedValue += value[i];
        }

        e.target.value = formattedValue.substring(0, 19); // Limit to 16 digits + 3 spaces
      });
    }

    // Format expiration date as user types (MM/YY format)
    const expDateInput = document.getElementById("expDate");
    if (expDateInput) {
      expDateInput.addEventListener("input", function (e) {
        let value = e.target.value.replace(/\D/g, "");
        let formattedValue = "";

        if (value.length > 0) {
          // Ensure month is between 01-12
          let month = value.substring(0, 2);
          if (month.length === 1) {
            formattedValue = month;
          } else {
            // Adjust month if needed
            let monthNum = parseInt(month);
            if (monthNum > 12) {
              month = "12";
            } else if (monthNum < 1) {
              month = "01";
            } else if (month.charAt(0) === "0" && month.charAt(1) === "0") {
              month = "01";
            }
            formattedValue = month;

            // Add the year if provided
            if (value.length > 2) {
              formattedValue += "/" + value.substring(2, 4);
            }
          }
        }

        e.target.value = formattedValue;
      });
    }

    // Limit CVV to 3 or 4 digits
    const cvvInput = document.getElementById("cvv");
    if (cvvInput) {
      cvvInput.addEventListener("input", function (e) {
        let value = e.target.value.replace(/\D/g, "");
        e.target.value = value.substring(0, 4);
      });
    }
  }

  // Process the order
  function processOrder(modalContainer, paymentMethod) {
    // Show loading overlay
    const loadingOverlay = document.createElement("div");
    loadingOverlay.className = "loading-overlay";
    loadingOverlay.innerHTML = `
          <div class="loading-spinner"></div>
          <p>Processing your order...</p>
        `;

    modalContainer.querySelector(".checkout-modal").appendChild(loadingOverlay);

    // Collect payment data based on payment method
    let paymentData = {};

    switch (paymentMethod) {
      case "creditCard":
        paymentData = {
          method: "creditCard",
          cardName: document.getElementById("cardName").value,
          cardNumber: document
            .getElementById("cardNumber")
            .value.replace(/\s/g, ""),
          expDate: document.getElementById("expDate").value,
          cvv: document.getElementById("cvv").value,
        };
        break;

      case "paypal":
        paymentData = {
          method: "paypal",
          email: document.getElementById("paypalEmail").value,
        };
        break;

      case "applePay":
        paymentData = {
          method: "applePay",
          deviceInfo: navigator.userAgent,
        };
        break;

      case "googlePay":
        paymentData = {
          method: "googlePay",
          deviceInfo: navigator.userAgent,
        };
        break;
    }

    // Simulate order processing (in a real application, this would be an API call)
    setTimeout(() => {
      // Create order object
      const order = {
        id: generateOrderId(),
        userId: JSON.parse(localStorage.getItem("currentUser")).id,
        items: cart,
        shippingInfo: {
          firstName: document.getElementById("firstName").value,
          lastName: document.getElementById("lastName").value,
          address: document.getElementById("address").value,
          city: document.getElementById("city").value,
          state: document.getElementById("state").value,
          zipCode: document.getElementById("zipCode").value,
          phone: document.getElementById("phone").value,
        },
        paymentMethod: paymentMethod,
        paymentData: paymentData,
        orderDate: new Date(),
        status: "Processing",
      };

      // In real application, we would process the payment here
      const paymentSuccessful = processPayment(paymentMethod, paymentData);

      if (!paymentSuccessful) {
        // Remove loading overlay
        loadingOverlay.remove();
        showNotification(
          "Payment processing failed. Please try again.",
          "error"
        );
        return;
      }

      // Save order to localStorage
      saveOrder(order);

      // Clear cart
      cart = [];
      localStorage.setItem("cart", JSON.stringify(cart));

      // Update cart badge
      const cartBadge = document.getElementById("cart-badge");
      if (cartBadge) {
        cartBadge.style.display = "none";
      }

      // Close checkout modal and show order confirmation
      modalContainer.remove();
      showOrderConfirmation(order);
    }, 2000);
  }

  // Process payment based on payment method
  function processPayment(paymentMethod, paymentData) {
    // In a real application, this would interact with payment gateways
    // For demo purposes, we'll simulate successful payment processing

    switch (paymentMethod) {
      case "creditCard":
        // Credit card validation would happen here
        // For demonstration, we'll just return true
        return true;

      case "paypal":
        // Would redirect to PayPal for authentication and payment
        return true;

      case "applePay":
        // Would use Apple Pay API
        return true;

      case "googlePay":
        // Would use Google Pay API
        return true;

      default:
        return false;
    }
  }

  // Generate a random order ID
  function generateOrderId() {
    return "ORD-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  // Save order to localStorage
  function saveOrder(order) {
    // Get existing orders
    let orders = JSON.parse(localStorage.getItem("orders")) || {};

    // Add new order to user's orders
    const userId = order.userId;
    if (!orders[userId]) {
      orders[userId] = [];
    }

    orders[userId].push(order);

    // Save updated orders
    localStorage.setItem("orders", JSON.stringify(orders));
  }

  // Generate a random order ID
  function generateOrderId() {
    return "ORD-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  // Save order to localStorage
  function saveOrder(order) {
    // Get existing orders
    let orders = JSON.parse(localStorage.getItem("orders")) || {};

    // Add new order to user's orders
    const userId = order.userId;
    if (!orders[userId]) {
      orders[userId] = [];
    }

    orders[userId].push(order);

    // Save updated orders
    localStorage.setItem("orders", JSON.stringify(orders));
  }

  // Show order confirmation
  function showOrderConfirmation(order) {
    const modalContainer = document.createElement("div");
    modalContainer.className = "confirmation-modal-container";

    // Set payment method display name
    let paymentMethodName = "Credit Card";
    switch (order.paymentMethod) {
      case "paypal":
        paymentMethodName = "PayPal";
        break;
      case "applePay":
        paymentMethodName = "Apple Pay";
        break;
      case "googlePay":
        paymentMethodName = "Google Pay";
        break;
    }

    modalContainer.innerHTML = `
          <div class="confirmation-modal">
            <div class="confirmation-modal-content">
              <span class="close-modal">&times;</span>
              <div class="confirmation-header">
                <i class="fas fa-check-circle"></i>
                <h2>Order Confirmed!</h2>
              </div>
              
              <div class="confirmation-details">
                <p>Thank you for your order. Your order has been received and is being processed.</p>
                <div class="order-info">
                  <div class="order-info-item">
                    <span>Order Number:</span>
                    <span>${order.id}</span>
                  </div>
                  <div class="order-info-item">
                    <span>Order Date:</span>
                    <span>${new Date(
                      order.orderDate
                    ).toLocaleDateString()} ${new Date(
      order.orderDate
    ).toLocaleTimeString()}</span>
                  </div>
                  <div class="order-info-item">
                    <span>Payment Method:</span>
                    <span>${paymentMethodName}</span>
                  </div>
                  <div class="order-info-item">
                    <span>Status:</span>
                    <span>${order.status}</span>
                  </div>
                </div>
              </div>
              
              <div class="confirmation-actions">
                <button class="btn continue-shopping-btn">Continue Shopping</button>
                <button class="btn view-orders-btn">View My Orders</button>
              </div>
            </div>
          </div>
        `;

    document.body.appendChild(modalContainer);
    modalContainer.style.display = "flex";

    // Close modal when clicking the X or outside the modal
    const closeModal = modalContainer.querySelector(".close-modal");
    closeModal.addEventListener("click", function () {
      modalContainer.remove();
    });

    window.addEventListener("click", function (e) {
      if (e.target === modalContainer) {
        modalContainer.remove();
      }
    });

    // Continue shopping button
    const continueShoppingBtn = modalContainer.querySelector(
      ".continue-shopping-btn"
    );
    continueShoppingBtn.addEventListener("click", function () {
      modalContainer.remove();
    });

    // View orders button
    const viewOrdersBtn = modalContainer.querySelector(".view-orders-btn");
    viewOrdersBtn.addEventListener("click", function () {
      modalContainer.remove();
      showOrdersPage();
    });
  }

  // Show orders page
  function showOrdersPage() {
    // Get current user and their orders
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const orders = JSON.parse(localStorage.getItem("orders")) || {};
    const userOrders = orders[currentUser.id] || [];

    const modalContainer = document.createElement("div");
    modalContainer.className = "orders-modal-container";

    modalContainer.innerHTML = `
          <div class="orders-modal">
            <div class="orders-modal-content">
              <span class="close-modal">&times;</span>
              <h2>My Orders</h2>
              
              ${
                userOrders.length === 0
                  ? '<p class="empty-orders-message">You have no orders yet.</p>'
                  : `<div class="orders-list">
                  ${userOrders
                    .map((order) => {
                      let paymentMethodName = "Credit Card";
                      if (order.paymentMethod) {
                        switch (order.paymentMethod) {
                          case "paypal":
                            paymentMethodName = "PayPal";
                            break;
                          case "applePay":
                            paymentMethodName = "Apple Pay";
                            break;
                          case "googlePay":
                            paymentMethodName = "Google Pay";
                            break;
                        }
                      }

                      return `
                        <div class="order-card">
                          <div class="order-card-header">
                            <div>
                              <h3>Order #${order.id}</h3>
                              <p>${new Date(
                                order.orderDate
                              ).toLocaleDateString()} ${new Date(
                        order.orderDate
                      ).toLocaleTimeString()}</p>
                            </div>
                            <div class="order-status ${order.status.toLowerCase()}">${
                        order.status
                      }</div>
                          </div>
                          
                          <div class="order-card-items">
                            ${order.items
                              .map(
                                (item) => `
                              <div class="order-card-item">
                                <div class="order-card-item-image">
                                  <img src="${item.image}" alt="${item.title}">
                                </div>
                                <div class="order-card-item-info">
                                  <h4>${item.title}</h4>
                                  <p>${item.price} × ${item.quantity}</p>
                                </div>
                              </div>
                            `
                              )
                              .join("")}
                          </div>
                          
                          <div class="order-payment-method">
                            <p>Payment Method: ${paymentMethodName}</p>
                          </div>
                          
                          <div class="order-card-footer">
                            <button class="btn view-order-details-btn" data-id="${
                              order.id
                            }">View Details</button>
                          </div>
                        </div>
                      `;
                    })
                    .join("")}
                </div>`
              }
              
              <div class="orders-actions">
                <button class="btn continue-shopping-btn">Continue Shopping</button>
              </div>
            </div>
          </div>
        `;

    document.body.appendChild(modalContainer);
    modalContainer.style.display = "flex";

    // Close modal when clicking the X or outside the modal
    const closeModal = modalContainer.querySelector(".close-modal");
    closeModal.addEventListener("click", function () {
      modalContainer.remove();
    });

    window.addEventListener("click", function (e) {
      if (e.target === modalContainer) {
        modalContainer.remove();
      }
    });

    // Continue shopping button
    const continueShoppingBtn = modalContainer.querySelector(
      ".continue-shopping-btn"
    );
    continueShoppingBtn.addEventListener("click", function () {
      modalContainer.remove();
    });

    // View order details buttons
    const viewOrderDetailsBtns = modalContainer.querySelectorAll(
      ".view-order-details-btn"
    );
    viewOrderDetailsBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const orderId = this.dataset.id;
        const order = userOrders.find((order) => order.id === orderId);

        if (order) {
          showOrderDetails(order);
        }
      });
    });
  }

  // Show order details
  function showOrderDetails(order) {
    // Calculate order total
    let subtotal = 0;
    order.items.forEach((item) => {
      const price = parseFloat(item.price.replace("$", ""));
      subtotal += price * item.quantity;
    });

    const taxRate = 0.085;
    const taxAmount = subtotal * taxRate;
    const orderTotal = subtotal + taxAmount;

    // Set payment method display name
    let paymentMethodName = "Credit Card";
    if (order.paymentMethod) {
      switch (order.paymentMethod) {
        case "paypal":
          paymentMethodName = "PayPal";
          break;
        case "applePay":
          paymentMethodName = "Apple Pay";
          break;
        case "googlePay":
          paymentMethodName = "Google Pay";
          break;
      }
    }

    const modalContainer = document.createElement("div");
    modalContainer.className = "order-details-modal-container";

    modalContainer.innerHTML = `
        <div class="order-details-modal">
          <div class="order-details-modal-content">
            <span class="close-modal">&times;</span>
            <div class="order-details-header">
              <h2>Order Details</h2>
              <div class="order-status ${order.status.toLowerCase()}">${
      order.status
    }</div>
            </div>
            
            <div class="order-info-grid">
              <div class="order-info-block">
                <h3>Order Information</h3>
                <div class="info-row">
                  <span>Order Number:</span>
                  <span>${order.id}</span>
                </div>
                <div class="info-row">
                  <span>Order Date:</span>
                  <span>${new Date(
                    order.orderDate
                  ).toLocaleDateString()} ${new Date(
      order.orderDate
    ).toLocaleTimeString()}</span>
                </div>
                <div class="info-row">
                  <span>Payment Method:</span>
                  <span>${paymentMethodName}</span>
                </div>
                <div class="info-row">
                  <span>Status:</span>
                  <span>${order.status}</span>
                </div>
              </div>
              
              <div class="order-info-block">
                <h3>Shipping Information</h3>
                <div class="info-row">
                  <span>Name:</span>
                  <span>${order.shippingInfo.firstName} ${
      order.shippingInfo.lastName
    }</span>
                </div>
                <div class="info-row">
                  <span>Address:</span>
                  <span>${order.shippingInfo.address}</span>
                </div>
                <div class="info-row">
                  <span>City:</span>
                  <span>${order.shippingInfo.city}</span>
                </div>
                <div class="info-row">
                  <span>State:</span>
                  <span>${order.shippingInfo.state}</span>
                </div>
                <div class="info-row">
                  <span>ZIP Code:</span>
                  <span>${order.shippingInfo.zipCode}</span>
                </div>
                <div class="info-row">
                  <span>Phone:</span>
                  <span>${order.shippingInfo.phone}</span>
                </div>
              </div>
            </div>
            
            <div class="order-items-section">
              <h3>Order Items</h3>
              <div class="order-items-list">
                ${order.items
                  .map(
                    (item) => `
                  <div class="order-item-detail">
                    <div class="order-item-image">
                      <img src="${item.image}" alt="${item.title}">
                    </div>
                    <div class="order-item-info">
                      <h4>${item.title}</h4>
                      <p>${item.price} × ${item.quantity}</p>
                    </div>
                    <div class="order-item-price">
                      $${(
                        parseFloat(item.price.replace("$", "")) * item.quantity
                      ).toFixed(2)}
                    </div>
                  </div>
                `
                  )
                  .join("")}
              </div>
              
              <div class="order-summary">
                <div class="summary-row">
                  <span>Subtotal:</span>
                  <span>$${subtotal.toFixed(2)}</span>
                </div>
                <div class="summary-row">
                  <span>Tax (8.5%):</span>
                  <span>$${taxAmount.toFixed(2)}</span>
                </div>
                <div class="summary-row total">
                  <span>Total:</span>
                  <span>$${orderTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div class="order-details-actions">
              <button class="btn back-to-orders-btn">Back to My Orders</button>
              <button class="btn track-order-btn" data-id="${
                order.id
              }">Track Order</button>
            </div>
          </div>
        </div>
      `;

    document.body.appendChild(modalContainer);
    modalContainer.style.display = "flex";

    // Close modal when clicking the X or outside the modal
    const closeModal = modalContainer.querySelector(".close-modal");
    closeModal.addEventListener("click", function () {
      modalContainer.remove();
    });

    window.addEventListener("click", function (e) {
      if (e.target === modalContainer) {
        modalContainer.remove();
      }
    });

    // Back to orders button
    const backToOrdersBtn = modalContainer.querySelector(".back-to-orders-btn");
    backToOrdersBtn.addEventListener("click", function () {
      modalContainer.remove();
      showOrdersPage();
    });

    // Track order button
    const trackOrderBtn = modalContainer.querySelector(".track-order-btn");
    trackOrderBtn.addEventListener("click", function () {
      const orderId = this.dataset.id;
      showOrderTracking(orderId);
    });
  }

  function showOrderTracking(orderId) {
    // Get current user and their orders
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const orders = JSON.parse(localStorage.getItem("orders")) || {};
    const userOrders = orders[currentUser.id] || [];
    const order = userOrders.find((o) => o.id === orderId);

    if (!order) {
      showNotification("Order not found", "error");
      return;
    }

    // Simulate tracking information
    const trackingSteps = [
      {
        status: "Order Placed",
        date: new Date(order.orderDate),
        completed: true,
        description: "Your order has been placed and is being processed.",
      },
      {
        status: "Payment Confirmed",
        date: new Date(new Date(order.orderDate).getTime() + 1000 * 60 * 30), // 30 minutes after order placement
        completed: true,
        description: "Payment has been confirmed and verified.",
      },
      {
        status: "Processing",
        date: new Date(
          new Date(order.orderDate).getTime() + 1000 * 60 * 60 * 2
        ), // 2 hours after order placement
        completed:
          order.status === "Processing" ||
          order.status === "Shipped" ||
          order.status === "Delivered",
        description: "Your order is being prepared for shipment.",
      },
      {
        status: "Shipped",
        date: new Date(
          new Date(order.orderDate).getTime() + 1000 * 60 * 60 * 24
        ), // 1 day after order placement
        completed: order.status === "Shipped" || order.status === "Delivered",
        description: "Your order has been shipped and is on its way.",
      },
      {
        status: "Delivered",
        date: new Date(
          new Date(order.orderDate).getTime() + 1000 * 60 * 60 * 24 * 3
        ), // 3 days after order placement
        completed: order.status === "Delivered",
        description: "Your order has been delivered to the shipping address.",
      },
    ];

    const modalContainer = document.createElement("div");
    modalContainer.className = "tracking-modal-container";

    modalContainer.innerHTML = `
          <div class="tracking-modal">
            <div class="tracking-modal-content">
              <span class="close-modal">&times;</span>
              <div class="tracking-header">
                <h2>Order Tracking</h2>
                <div class="order-id">Order #${order.id}</div>
              </div>
              
              <div class="tracking-timeline">
                ${trackingSteps
                  .map(
                    (step, index) => `
                  <div class="tracking-step ${
                    step.completed ? "completed" : ""
                  }">
                    <div class="tracking-step-indicator">
                      <div class="step-indicator-dot"></div>
                      ${
                        index < trackingSteps.length - 1
                          ? '<div class="step-indicator-line"></div>'
                          : ""
                      }
                    </div>
                    <div class="tracking-step-content">
                      <div class="tracking-step-header">
                        <h4>${step.status}</h4>
                        <span class="tracking-date">${
                          step.completed
                            ? step.date.toLocaleDateString() +
                              " " +
                              step.date.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "Estimated: " + step.date.toLocaleDateString()
                        }</span>
                      </div>
                      <p class="tracking-step-description">${
                        step.description
                      }</p>
                    </div>
                  </div>
                `
                  )
                  .join("")}
              </div>
              
              <div class="estimated-delivery">
                <h3>Estimated Delivery</h3>
                <p>${trackingSteps[4].date.toLocaleDateString()}</p>
              </div>
              
              <div class="tracking-actions">
                <button class="btn back-to-details-btn">Back to Order Details</button>
              </div>
            </div>
          </div>
        `;

    document.body.appendChild(modalContainer);
    modalContainer.style.display = "flex";

    // Close modal when clicking the X or outside the modal
    const closeModal = modalContainer.querySelector(".close-modal");
    closeModal.addEventListener("click", function () {
      modalContainer.remove();
    });

    window.addEventListener("click", function (e) {
      if (e.target === modalContainer) {
        modalContainer.remove();
      }
    });

    // Back to order details button
    const backToDetailsBtn = modalContainer.querySelector(
      ".back-to-details-btn"
    );
    backToDetailsBtn.addEventListener("click", function () {
      modalContainer.remove();
      showOrderDetails(order);
    });
  }

  // Show notification function (reusing from cart.js)
  function showNotification(message, type) {
    // Check if showNotification already exists in the global scope
    if (typeof window.showNotification === "function") {
      window.showNotification(message, type);
      return;
    }

    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      notification.classList.add("fade-out");
      setTimeout(() => {
        notification.remove();
      }, 500);
    }, 3000);
  }

  function showCartModal() {
    // Remove existing cart modal if it exists
    const existingModal = document.querySelector(".cart-modal-container");
    if (existingModal) {
      existingModal.remove();
    }

    // Create cart modal
    const modalContainer = document.createElement("div");
    modalContainer.className = "cart-modal-container";

    // Calculate cart total
    let cartTotal = 0;
    cart.forEach((item) => {
      const price = parseFloat(item.price.replace("$", ""));
      cartTotal += price * item.quantity;
    });

    modalContainer.innerHTML = `
        <div class="cart-modal">
          <div class="cart-modal-content">
            <span class="close-modal">&times;</span>
            <h2>Your Shopping Cart</h2>
            
            ${
              cart.length === 0
                ? '<p class="empty-cart-message">Your cart is empty.</p>'
                : `<div class="cart-items">
                ${cart
                  .map(
                    (item) => `
                  <div class="cart-item">
                    <div class="cart-item-image">
                      <img src="${item.image}" alt="${item.title}">
                    </div>
                    <div class="cart-item-info">
                      <h3>${item.title}</h3>
                      <p class="cart-item-price">${item.price}</p>
                    </div>
                    <div class="cart-item-quantity">
                      <button class="quantity-btn decrease" data-id="${
                        item.id
                      }">-</button>
                      <span class="quantity">${item.quantity}</span>
                      <button class="quantity-btn increase" data-id="${
                        item.id
                      }">+</button>
                    </div>
                    <div class="cart-item-total">
                      $${(
                        parseFloat(item.price.replace("$", "")) * item.quantity
                      ).toFixed(2)}
                    </div>
                    <button class="remove-item-btn" data-id="${
                      item.id
                    }">×</button>
                  </div>
                `
                  )
                  .join("")}
              </div>
              
              <div class="cart-summary">
                <div class="cart-total">
                  <span>Total:</span>
                  <span>$${cartTotal.toFixed(2)}</span>
                </div>
                <div class="cart-actions">
                  <button class="btn clear-cart-btn">Clear Cart</button>
                  <button class="btn checkout-btn" onclick="proceedToCheckout()">Checkout</button>
                </div>
              </div>`
            }
          </div>
        </div>
      `;

    document.body.appendChild(modalContainer);
    modalContainer.style.display = "flex";

    // Close modal when clicking the X or outside the modal
    const closeModal = modalContainer.querySelector(".close-modal");
    closeModal.addEventListener("click", function () {
      modalContainer.remove();
    });

    window.addEventListener("click", function (e) {
      if (e.target === modalContainer) {
        modalContainer.remove();
      }
    });

    // If cart is empty, no need to add these event listeners
    if (cart.length === 0) return;

    // Increase/decrease quantity buttons
    const increaseButtons = modalContainer.querySelectorAll(".increase");
    const decreaseButtons = modalContainer.querySelectorAll(".decrease");

    increaseButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const itemId = this.dataset.id;
        const itemIndex = cart.findIndex((item) => item.id === itemId);

        if (itemIndex !== -1) {
          cart[itemIndex].quantity++;
          localStorage.setItem("cart", JSON.stringify(cart));
          showCartModal(); // Refresh cart modal
        }
      });
    });

    decreaseButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const itemId = this.dataset.id;
        const itemIndex = cart.findIndex((item) => item.id === itemId);

        if (itemIndex !== -1) {
          if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity--;
          } else {
            cart.splice(itemIndex, 1);
          }
          localStorage.setItem("cart", JSON.stringify(cart));

          // Update cart badge
          const cartBadge = document.getElementById("cart-badge");
          if (cartBadge) {
            const totalItems = cart.reduce(
              (total, item) => total + item.quantity,
              0
            );
            if (totalItems > 0) {
              cartBadge.textContent = totalItems;
              cartBadge.style.display = "flex";
            } else {
              cartBadge.style.display = "none";
            }
          }

          showCartModal(); // Refresh cart modal
        }
      });
    });

    // Remove item buttons
    const removeButtons = modalContainer.querySelectorAll(".remove-item-btn");
    removeButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const itemId = this.dataset.id;
        const itemIndex = cart.findIndex((item) => item.id === itemId);

        if (itemIndex !== -1) {
          cart.splice(itemIndex, 1);
          localStorage.setItem("cart", JSON.stringify(cart));

          // Update cart badge
          const cartBadge = document.getElementById("cart-badge");
          if (cartBadge) {
            const totalItems = cart.reduce(
              (total, item) => total + item.quantity,
              0
            );
            if (totalItems > 0) {
              cartBadge.textContent = totalItems;
              cartBadge.style.display = "flex";
            } else {
              cartBadge.style.display = "none";
            }
          }

          showCartModal(); // Refresh cart modal
        }
      });
    });

    // Clear cart button
    const clearCartBtn = modalContainer.querySelector(".clear-cart-btn");
    clearCartBtn.addEventListener("click", function () {
      if (confirm("Are you sure you want to clear your cart?")) {
        cart = [];
        localStorage.setItem("cart", JSON.stringify(cart));

        // Update cart badge
        const cartBadge = document.getElementById("cart-badge");
        if (cartBadge) {
          cartBadge.style.display = "none";
        }

        showCartModal(); // Refresh cart modal
      }
    });
  }

  function showNotification2(message, type = "success") {
    const notificationContainer =
      document.getElementById("notification-container") ||
      createNotificationContainer();

    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `
          <span class="notification-message">${message}</span>
          <span class="notification-close">&times;</span>
        `;

    notificationContainer.appendChild(notification);

    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      notification.classList.add("hide");
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 5000);

    // Close notification when clicking the X
    const closeNotification = notification.querySelector(".notification-close");
    closeNotification.addEventListener("click", function () {
      notification.classList.add("hide");
      setTimeout(() => {
        notification.remove();
      }, 300);
    });
  }

  // Create notification container if not exists
  function createNotificationContainer() {
    const container = document.createElement("div");
    container.id = "notification-container";
    document.body.appendChild(container);
    return container;
  }

  // Export functions to global scope
  window.showCheckoutInterface = showCheckoutInterface;
  window.showOrdersPage = showOrdersPage;
});
