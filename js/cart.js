// Shopping Cart functionality
document.addEventListener("DOMContentLoaded", function () {
  // Cart state
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // DOM Elements
  const cartBtn = document.getElementById("cartbtn");
  const cartBadge = document.getElementById("cart-badge");
  const orderBtn = document.getElementById("orderbtn");
  const productCards = document.querySelectorAll(".product-card");

  // Initialize cart UI
  updateCartBadge();

  // Add to cart buttons for all products
  productCards.forEach((card) => {
    // Get product information
    const productInfo = card.querySelector(".product-info");
    const productTitle =
      productInfo.querySelector(".product-title").textContent;
    const productPrice =
      productInfo.querySelector(".product-price").textContent;
    const productCategory =
      productInfo.querySelector(".product-category").textContent;
    const productImage = card.querySelector(".product-image img").src;
    const productMeta = Array.from(
      productInfo.querySelectorAll(".product-meta span")
    ).map((span) => span.textContent);

    // Create add to cart button if it doesn't exist
    if (!card.querySelector(".add-to-cart-btn")) {
      const addToCartBtn = document.createElement("button");
      addToCartBtn.className = "add-to-cart-btn";
      addToCartBtn.innerHTML =
        '<i class="fas fa-shopping-cart"></i> Add to Cart';
      productInfo.appendChild(addToCartBtn);

      // Add click event
      addToCartBtn.addEventListener("click", function (e) {
        e.preventDefault();

        // Check if product is already in cart
        const existingItemIndex = cart.findIndex(
          (item) => item.title === productTitle
        );

        if (existingItemIndex >= 0) {
          // Increment quantity
          cart[existingItemIndex].quantity += 1;
        } else {
          // Add new item
          cart.push({
            id: Date.now().toString(), // Unique ID
            title: productTitle,
            price: productPrice,
            category: productCategory,
            image: productImage,
            meta: productMeta,
            quantity: 1,
          });
        }

        // Save to localStorage
        saveCart();

        // Show notification
        showNotification(`Added "${productTitle}" to cart!`, "success");

        // Update UI
        updateCartBadge();
      });
    }
  });

  // Cart button click event
  cartBtn.addEventListener("click", function (e) {
    e.preventDefault();
    showCartModal();
  });

  // Order Now button - redirect to checkout if cart has items
  orderBtn.addEventListener("click", function (e) {
    e.preventDefault();

    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
      showNotification("Please login to place an order", "error");
      const loginBtn = document.getElementById("loginbtn");
      if (loginBtn) {
        loginBtn.click(); // Open login modal
      }
      return;
    }

    if (cart.length === 0) {
      showNotification("Your cart is empty", "error");
      return;
    }

    // Here you would typically redirect to checkout page
    showNotification("Proceeding to checkout...", "success");
    // For now, show cart as we don't have a separate checkout page
    showCartModal();
  });

  // Show cart modal
  function showCartModal() {
    const modalContainer = document.createElement("div");
    modalContainer.className = "cart-modal-container";

    let cartTotal = 0;

    // Calculate total
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
                ? '<p class="empty-cart-message">Your cart is empty</p>'
                : `<div class="cart-items">
                ${cart
                  .map(
                    (item) => `
                  <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image">
                      <img src="${item.image}" alt="${item.title}">
                    </div>
                    <div class="cart-item-info">
                      <h3>${item.title}</h3>
                      <p class="cart-item-category">${item.category}</p>
                      <p class="cart-item-price">${item.price}</p>
                      <div class="cart-item-meta">${item.meta.join(" • ")}</div>
                    </div>
                    <div class="cart-item-actions">
                      <div class="quantity-control">
                        <button class="decrease-qty">-</button>
                        <span class="item-quantity">${item.quantity}</span>
                        <button class="increase-qty">+</button>
                      </div>
                      <button class="remove-item-btn">Remove</button>
                    </div>
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
                  <button class="btn checkout-btn">Proceed to Checkout</button>
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

    // Cart item quantity controls
    const decreaseBtns = modalContainer.querySelectorAll(".decrease-qty");
    const increaseBtns = modalContainer.querySelectorAll(".increase-qty");
    const removeBtns = modalContainer.querySelectorAll(".remove-item-btn");

    decreaseBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const cartItem = this.closest(".cart-item");
        const itemId = cartItem.dataset.id;
        const itemIndex = cart.findIndex((item) => item.id === itemId);

        if (itemIndex !== -1) {
          if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity -= 1;
            cartItem.querySelector(".item-quantity").textContent =
              cart[itemIndex].quantity;
          } else {
            // Remove if quantity becomes 0
            cart.splice(itemIndex, 1);
            cartItem.remove();

            // Show empty message if cart is now empty
            if (cart.length === 0) {
              modalContainer.querySelector(".cart-items").innerHTML =
                '<p class="empty-cart-message">Your cart is empty</p>';
              modalContainer.querySelector(".cart-summary").style.display =
                "none";
            }
          }

          // Update cart
          saveCart();
          updateCartTotal(modalContainer);
          updateCartBadge();
        }
      });
    });

    increaseBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const cartItem = this.closest(".cart-item");
        const itemId = cartItem.dataset.id;
        const itemIndex = cart.findIndex((item) => item.id === itemId);

        if (itemIndex !== -1) {
          cart[itemIndex].quantity += 1;
          cartItem.querySelector(".item-quantity").textContent =
            cart[itemIndex].quantity;

          // Update cart
          saveCart();
          updateCartTotal(modalContainer);
          updateCartBadge();
        }
      });
    });

    removeBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const cartItem = this.closest(".cart-item");
        const itemId = cartItem.dataset.id;
        const itemIndex = cart.findIndex((item) => item.id === itemId);

        if (itemIndex !== -1) {
          cart.splice(itemIndex, 1);
          cartItem.remove();

          // Show empty message if cart is now empty
          if (cart.length === 0) {
            const cartItemsContainer =
              modalContainer.querySelector(".cart-items");
            if (cartItemsContainer) {
              cartItemsContainer.innerHTML =
                '<p class="empty-cart-message">Your cart is empty</p>';
              modalContainer.querySelector(".cart-summary").style.display =
                "none";
            }
          }

          // Update cart
          saveCart();
          updateCartTotal(modalContainer);
          updateCartBadge();
        }
      });
    });

    // Clear cart button
    const clearCartBtn = modalContainer.querySelector(".clear-cart-btn");
    if (clearCartBtn) {
      clearCartBtn.addEventListener("click", function () {
        cart = [];
        saveCart();
        updateCartBadge();

        // Update modal
        const cartItemsContainer = modalContainer.querySelector(".cart-items");
        if (cartItemsContainer) {
          cartItemsContainer.innerHTML =
            '<p class="empty-cart-message">Your cart is empty</p>';
          modalContainer.querySelector(".cart-summary").style.display = "none";
        }
      });
    }

    // Checkout button
    const checkoutBtn = modalContainer.querySelector(".checkout-btn");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", function () {
        // Check if user is logged in
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));

        if (!currentUser) {
          showNotification("Please login to checkout", "error");
          modalContainer.remove();
          const loginBtn = document.getElementById("loginbtn");
          if (loginBtn) {
            loginBtn.click(); // Open login modal
          }
          return;
        }

        // Here you would typically redirect to checkout page
        showNotification("Processing your order...", "success");

        // For demo purposes, just clear the cart after "checkout"
        setTimeout(() => {
          cart = [];
          saveCart();
          updateCartBadge();
          modalContainer.remove();
          showNotification("Order placed successfully!", "success");
        }, 1500);
      });
    }
  }

  // Update cart total in modal
  function updateCartTotal(modalContainer) {
    if (!modalContainer) return;

    const totalElement = modalContainer.querySelector(
      ".cart-total span:last-child"
    );
    if (!totalElement) return;

    let cartTotal = 0;
    cart.forEach((item) => {
      const price = parseFloat(item.price.replace("$", ""));
      cartTotal += price * item.quantity;
    });

    totalElement.textContent = `$${cartTotal.toFixed(2)}`;
  }

  // Update cart badge count
  function updateCartBadge() {
    if (!cartBadge) return;

    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

    if (itemCount > 0) {
      cartBadge.textContent = itemCount;
      cartBadge.style.display = "flex";
    } else {
      cartBadge.style.display = "none";
    }
  }

  // Save cart to localStorage
  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // Show notification function (reusing from auth.js)
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
});
