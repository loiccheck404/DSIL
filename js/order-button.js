// Order button functionality
document.addEventListener("DOMContentLoaded", function () {
  // Get the order button
  const orderBtn = document.getElementById("orderbtn");

  // If order button exists, add click event listener
  if (orderBtn) {
    orderBtn.addEventListener("click", function (e) {
      e.preventDefault();

      // Check if user is logged in
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));

      if (!currentUser) {
        // If not logged in, show login modal
        const loginBtn = document.getElementById("loginbtn");
        if (loginBtn) {
          loginBtn.click(); // Trigger the login modal
          showNotification("Please log in to place an order", "info");
        }
        return;
      }

      // If logged in, proceed to order processing
      // This could redirect to a checkout page or show a modal
      showOrderModal();
    });
  }

  // Show order modal
  function showOrderModal() {
    // Create modal container if it doesn't exist
    let modalContainer = document.querySelector(".order-modal-container");
    if (!modalContainer) {
      modalContainer = document.createElement("div");
      modalContainer.className = "order-modal-container";
      document.body.appendChild(modalContainer);
    }

    // Populate the modal
    modalContainer.innerHTML = `
            <div class="auth-modal order-modal">
                <div class="auth-modal-content">
                    <span class="close-modal">&times;</span>
                    <h2>Place Your Order</h2>
                    
                    <div class="tabs">
                        <button class="tab active" data-tab="cart">Cart</button>
                        <button class="tab" data-tab="checkout">Checkout</button>
                    </div>
                    
                    <div class="tab-content" id="cart-tab">
                        <div id="cart-items">
                            <!-- Cart items will be loaded here -->
                            <p class="empty-cart-message">Your cart is empty. Browse our products to add items.</p>
                        </div>
                        <div class="cart-summary">
                            <div class="cart-total">Total: <span id="cart-total-amount">$0.00</span></div>
                            <button id="proceed-to-checkout" class="btn btn-primary">Proceed to Checkout</button>
                        </div>
                    </div>
                    
                    <div class="tab-content" id="checkout-tab" style="display: none;">
                        <form id="checkout-form">
                            <div class="form-section">
                                <h3>Shipping Information</h3>
                                <div class="form-group">
                                    <label for="shipping-name">Full Name</label>
                                    <input type="text" id="shipping-name" required>
                                </div>
                                <div class="form-group">
                                    <label for="shipping-address">Address</label>
                                    <input type="text" id="shipping-address" required>
                                </div>
                                <div class="form-group">
                                    <label for="shipping-city">City</label>
                                    <input type="text" id="shipping-city" required>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="shipping-state">State</label>
                                        <input type="text" id="shipping-state" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="shipping-zip">ZIP Code</label>
                                        <input type="text" id="shipping-zip" required>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="form-section">
                                <h3>Payment Information</h3>
                                <div class="form-group">
                                    <label for="card-name">Name on Card</label>
                                    <input type="text" id="card-name" required>
                                </div>
                                <div class="form-group">
                                    <label for="card-number">Card Number</label>
                                    <input type="text" id="card-number" required>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="card-expiry">Expiration Date</label>
                                        <input type="text" id="card-expiry" placeholder="MM/YY" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="card-cvv">CVV</label>
                                        <input type="text" id="card-cvv" required>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="form-section">
                                <h3>Order Summary</h3>
                                <div id="order-summary">
                                    <!-- Order summary will be displayed here -->
                                </div>
                                <div class="order-total">Total: <span id="order-total-amount">$0.00</span></div>
                            </div>
                            
                            <button type="submit" class="btn btn-primary">Place Order</button>
                        </form>
                    </div>
                </div>
            </div>
        `;

    modalContainer.style.display = "flex";

    // Setup event listeners for the modal
    setupModalEventListeners(modalContainer);

    // Load cart items
    loadCartItems();
  }

  // Set up event listeners for the modal
  function setupModalEventListeners(modalContainer) {
    // Close modal when clicking the X or outside the modal
    const closeModal = modalContainer.querySelector(".close-modal");
    closeModal.addEventListener("click", function () {
      modalContainer.style.display = "none";
    });

    window.addEventListener("click", function (e) {
      if (e.target === modalContainer) {
        modalContainer.style.display = "none";
      }
    });

    // Tab switching functionality
    const tabs = modalContainer.querySelectorAll(".tab");
    tabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        // Remove active class from all tabs
        tabs.forEach((t) => t.classList.remove("active"));
        // Add active class to clicked tab
        this.classList.add("active");

        // Hide all tab contents
        document.querySelectorAll(".tab-content").forEach((content) => {
          content.style.display = "none";
        });

        // Show the selected tab content
        const tabName = this.getAttribute("data-tab");
        document.getElementById(tabName + "-tab").style.display = "block";
      });
    });

    // Proceed to checkout button
    const proceedBtn = document.getElementById("proceed-to-checkout");
    if (proceedBtn) {
      proceedBtn.addEventListener("click", function () {
        // Switch to checkout tab
        const checkoutTab = modalContainer.querySelector(
          '[data-tab="checkout"]'
        );
        if (checkoutTab) {
          checkoutTab.click();
        }

        // Update order summary
        updateOrderSummary();
      });
    }

    // Checkout form submission
    const checkoutForm = document.getElementById("checkout-form");
    if (checkoutForm) {
      checkoutForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Process order (in a real app, this would send data to a server)
        processOrder();
      });
    }
  }

  // Load cart items from local storage
  function loadCartItems() {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const emptyCartMessage = document.querySelector(".empty-cart-message");

    if (cartItems.length === 0) {
      if (emptyCartMessage) {
        emptyCartMessage.style.display = "block";
      }
      return;
    }

    if (emptyCartMessage) {
      emptyCartMessage.style.display = "none";
    }

    let cartHTML = "";
    let total = 0;

    cartItems.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      cartHTML += `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="/api/placeholder/50/50" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>${item.category}</p>
                    </div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn increase">+</button>
                    </div>
                    <div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
                    <button class="remove-item-btn">&times;</button>
                </div>
            `;
    });

    if (cartItemsContainer) {
      cartItemsContainer.innerHTML = cartHTML;

      // Update total
      const totalElement = document.getElementById("cart-total-amount");
      if (totalElement) {
        totalElement.textContent = `$${total.toFixed(2)}`;
      }

      // Add event listeners for quantity buttons and remove buttons
      setupCartItemEventListeners();
    }
  }

  // Set up event listeners for cart item buttons
  function setupCartItemEventListeners() {
    // Quantity increase buttons
    document.querySelectorAll(".quantity-btn.increase").forEach((btn) => {
      btn.addEventListener("click", function () {
        const itemElement = this.closest(".cart-item");
        const itemId = itemElement.getAttribute("data-id");
        updateCartItemQuantity(itemId, 1);
      });
    });

    // Quantity decrease buttons
    document.querySelectorAll(".quantity-btn.decrease").forEach((btn) => {
      btn.addEventListener("click", function () {
        const itemElement = this.closest(".cart-item");
        const itemId = itemElement.getAttribute("data-id");
        updateCartItemQuantity(itemId, -1);
      });
    });

    // Remove item buttons
    document.querySelectorAll(".remove-item-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const itemElement = this.closest(".cart-item");
        const itemId = itemElement.getAttribute("data-id");
        removeCartItem(itemId);
      });
    });
  }

  // Update cart item quantity
  function updateCartItemQuantity(itemId, change) {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const itemIndex = cartItems.findIndex((item) => item.id === itemId);

    if (itemIndex !== -1) {
      cartItems[itemIndex].quantity += change;

      // Remove item if quantity is 0 or less
      if (cartItems[itemIndex].quantity <= 0) {
        cartItems.splice(itemIndex, 1);
      }

      // Update local storage
      localStorage.setItem("cartItems", JSON.stringify(cartItems));

      // Reload cart items display
      loadCartItems();

      // Update cart badge
      updateCartBadge();
    }
  }

  // Remove cart item
  function removeCartItem(itemId) {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const updatedItems = cartItems.filter((item) => item.id !== itemId);

    // Update local storage
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));

    // Reload cart items display
    loadCartItems();

    // Update cart badge
    updateCartBadge();
  }

  // Update order summary in checkout tab
  function updateOrderSummary() {
    const orderSummary = document.getElementById("order-summary");
    const orderTotal = document.getElementById("order-total-amount");
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    if (!orderSummary || !orderTotal) return;

    let summaryHTML = "";
    let total = 0;

    cartItems.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      summaryHTML += `
                <div class="order-item">
                    <div class="order-item-details">
                        <span class="order-item-name">${item.name}</span>
                        <span class="order-item-quantity">x${
                          item.quantity
                        }</span>
                    </div>
                    <div class="order-item-price">$${itemTotal.toFixed(2)}</div>
                </div>
            `;
    });

    orderSummary.innerHTML = summaryHTML;
    orderTotal.textContent = `$${total.toFixed(2)}`;
  }

  // Process order
  function processOrder() {
    // In a real application, this would send the order to a server
    // For now, we'll just simulate success

    // Clear cart
    localStorage.setItem("cartItems", JSON.stringify([]));

    // Update cart badge
    updateCartBadge();

    // Close modal
    const modalContainer = document.querySelector(".order-modal-container");
    if (modalContainer) {
      modalContainer.style.display = "none";
    }

    // Show success notification
    showNotification(
      "Order placed successfully! Thank you for your purchase.",
      "success"
    );
  }

  // Update cart badge
  function updateCartBadge() {
    const cartBadge = document.getElementById("cart-badge");
    if (!cartBadge) return;

    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const itemCount = cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );

    cartBadge.textContent = itemCount;
  }

  // Show notification (reusing from script.js)
  function showNotification(message, type) {
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
});
