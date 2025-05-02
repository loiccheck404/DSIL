// Cart functionality
document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const cartBtn = document.getElementById("cartbtn");
  const cartBadge = document.getElementById("cart-badge");

  // Initialize cart from localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  
  // Update cart badge on initial load
  updateCartBadge();

  // Add event listener to cart button
  if (cartBtn) {
    cartBtn.addEventListener("click", function (e) {
      e.preventDefault();
      showCartModal();
    });
  }

  // Add to cart function - this will be called when an "Add to Cart" button is clicked
  window.addToCart = function (product) {
    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex(item => 
      item.title === product.title && 
      item.price === product.price && 
      item.category === product.category
    );

    if (existingProductIndex > -1) {
      // Increment quantity if product already exists
      cart[existingProductIndex].quantity += 1;
    } else {
      // Add new product with quantity 1
      product.quantity = 1;
      cart.push(product);
    }

    // Save cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Update UI elements
    updateCartBadge();
    showNotification(`${product.title} added to cart`, "success");
  };

  // Update cart badge with current number of items
  function updateCartBadge() {
    if (!cartBadge) return;
    
    // Calculate total quantity
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Update badge
    if (totalItems > 0) {
      cartBadge.textContent = totalItems;
      cartBadge.style.display = "flex";
    } else {
      cartBadge.style.display = "none";
    }
  }

  // Show cart modal
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
    cart.forEach(item => {
      const price = parseFloat(item.price.replace("$", ""));
      cartTotal += price * item.quantity;
    });

    modalContainer.innerHTML = `
      <div class="cart-modal">
        <div class="cart-modal-content">
          <span class="close-modal">&times;</span>
          <h2>Your Cart</h2>
          
          ${cart.length === 0 ? 
            '<p class="empty-cart-message">Your cart is empty</p>' : 
            `<div class="cart-items">
              ${cart.map(item => `
                <div class="cart-item" data-id="${cart.indexOf(item)}">
                  <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.title}">
                  </div>
                  <div class="cart-item-info">
                    <h3>${item.title}</h3>
                    <p class="cart-item-price">${item.price}</p>
                    <p class="cart-item-category">${item.category}</p>
                  </div>
                  <div class="cart-item-quantity">
                    <button class="quantity-btn decrease">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn increase">+</button>
                  </div>
                  <div class="cart-item-total">
                    $${(parseFloat(item.price.replace("$", "")) * item.quantity).toFixed(2)}
                  </div>
                  <button class="remove-item-btn">×</button>
                </div>
              `).join('')}
            </div>
            
            <div class="cart-footer">
              <div class="cart-total">
                <span>Total:</span>
                <span>$${cartTotal.toFixed(2)}</span>
              </div>
              <div class="cart-actions">
                <button class="btn clear-cart-btn">Clear Cart</button>
                <button class="btn checkout-btn">Checkout</button>
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
    closeModal.addEventListener("click", function() {
      modalContainer.remove();
    });

    window.addEventListener("click", function(e) {
      if (e.target === modalContainer) {
        modalContainer.remove();
      }
    });

    // Don't close when clicking inside the modal
    modalContainer.querySelector(".cart-modal").addEventListener("click", function(e) {
      e.stopPropagation();
    });

    // Handle quantity buttons
    if (cart.length > 0) {
      // Increase quantity
      const increaseButtons = modalContainer.querySelectorAll(".quantity-btn.increase");
      increaseButtons.forEach(button => {
        button.addEventListener("click", function() {
          const cartItem = this.closest(".cart-item");
          const index = parseInt(cartItem.dataset.id);
          
          cart[index].quantity += 1;
          
          // Update UI
          cartItem.querySelector(".quantity").textContent = cart[index].quantity;
          const itemPrice = parseFloat(cart[index].price.replace("$", ""));
          cartItem.querySelector(".cart-item-total").textContent = `$${(itemPrice * cart[index].quantity).toFixed(2)}`;
          
          // Recalculate cart total
          let newTotal = 0;
          cart.forEach(item => {
            const price = parseFloat(item.price.replace("$", ""));
            newTotal += price * item.quantity;
          });
          
          modalContainer.querySelector(".cart-total span:last-child").textContent = `$${newTotal.toFixed(2)}`;
          
          // Save cart to localStorage
          localStorage.setItem("cart", JSON.stringify(cart));
          
          // Update cart badge
          updateCartBadge();
        });
      });

      // Decrease quantity
      const decreaseButtons = modalContainer.querySelectorAll(".quantity-btn.decrease");
      decreaseButtons.forEach(button => {
        button.addEventListener("click", function() {
          const cartItem = this.closest(".cart-item");
          const index = parseInt(cartItem.dataset.id);
          
          if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
            
            // Update UI
            cartItem.querySelector(".quantity").textContent = cart[index].quantity;
            const itemPrice = parseFloat(cart[index].price.replace("$", ""));
            cartItem.querySelector(".cart-item-total").textContent = `$${(itemPrice * cart[index].quantity).toFixed(2)}`;
            
            // Recalculate cart total
            let newTotal = 0;
            cart.forEach(item => {
              const price = parseFloat(item.price.replace("$", ""));
              newTotal += price * item.quantity;
            });
            
            modalContainer.querySelector(".cart-total span:last-child").textContent = `$${newTotal.toFixed(2)}`;
            
            // Save cart to localStorage
            localStorage.setItem("cart", JSON.stringify(cart));
            
            // Update cart badge
            updateCartBadge();
          }
        });
      });

      // Remove item
      const removeButtons = modalContainer.querySelectorAll(".remove-item-btn");
      removeButtons.forEach(button => {
        button.addEventListener("click", function() {
          const cartItem = this.closest(".cart-item");
          const index = parseInt(cartItem.dataset.id);
          
          // Remove from cart array
          cart.splice(index, 1);
          
          // Save cart to localStorage
          localStorage.setItem("cart", JSON.stringify(cart));
          
          // Remove from UI
          cartItem.remove();
          
          // Update cart badge
          updateCartBadge();
          
          // Recalculate cart total
          let newTotal = 0;
          cart.forEach(item => {
            const price = parseFloat(item.price.replace("$", ""));
            newTotal += price * item.quantity;
          });
          
          if (cart.length === 0) {
            // If cart is empty, update the modal content
            modalContainer.querySelector(".cart-modal-content").innerHTML = `
              <span class="close-modal">&times;</span>
              <h2>Your Cart</h2>
              <p class="empty-cart-message">Your cart is empty</p>
            `;
            
            // Re-attach close event listener to the new X button
            modalContainer.querySelector(".close-modal").addEventListener("click", function() {
              modalContainer.remove();
            });
          } else {
            // Update total
            modalContainer.querySelector(".cart-total span:last-child").textContent = `$${newTotal.toFixed(2)}`;
            
            // Update item indices
            const cartItems = modalContainer.querySelectorAll(".cart-item");
            cartItems.forEach((item, idx) => {
              item.dataset.id = idx;
            });
          }
        });
      });

      // Clear cart button
      const clearCartBtn = modalContainer.querySelector(".clear-cart-btn");
      if (clearCartBtn) {
        clearCartBtn.addEventListener("click", function() {
          // Clear cart array
          cart = [];
          
          // Save cart to localStorage
          localStorage.setItem("cart", JSON.stringify(cart));
          
          // Update UI
          modalContainer.querySelector(".cart-modal-content").innerHTML = `
            <span class="close-modal">&times;</span>
            <h2>Your Cart</h2>
            <p class="empty-cart-message">Your cart is empty</p>
          `;
          
          // Re-attach close event listener to the new X button
          modalContainer.querySelector(".close-modal").addEventListener("click", function() {
            modalContainer.remove();
          });
          
          // Update cart badge
          updateCartBadge();
          
          // Show notification
          showNotification("Cart cleared", "info");
        });
      }

      // Checkout button
      const checkoutBtn = modalContainer.querySelector(".checkout-btn");
      if (checkoutBtn) {
        checkoutBtn.addEventListener("click", function() {
          // Close the cart modal
          modalContainer.remove();
          
          // Call the checkout function from checkout.js
          if (typeof window.proceedToCheckout === "function") {
            window.proceedToCheckout();
          }
        });
      }
    }
  }

  // Add click event listeners to all product cards to enable "Add to Cart" functionality
  function setupAddToCartButtons() {
    const productCards = document.querySelectorAll(".product-card");
    
    productCards.forEach(card => {
      // Check if the card already has an event listener
      if (card.getAttribute("data-cart-listener") === "true") {
        return;
      }
      
      card.setAttribute("data-cart-listener", "true");
      
      card.addEventListener("click", function(e) {
        // Get product info
        const productImage = this.querySelector(".product-image img").src;
        const productTitle = this.querySelector(".product-title").textContent;
        const productPrice = this.querySelector(".product-price").textContent;
        const productCategory = this.querySelector(".product-category").textContent;
        
        const product = {
          image: productImage,
          title: productTitle,
          price: productPrice,
          category: productCategory
        };
        
        // Add to cart
        window.addToCart(product);
      });
    });
  }
  
  // Setup add to cart buttons when the page loads
  setupAddToCartButtons();

  // Show notification function
  window.showNotification = function(message, type) {
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
  };
});

// Add this section to handle dynamically loaded product cards
// This ensures that cards added to the DOM after initial load also get event listeners
(function() {
  // Create a mutation observer to watch for changes to the DOM
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length) {
        // Check each added node to see if it's a product card or contains product cards
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) { // Element node
            // Check if the node itself is a product card
            if (node.classList && node.classList.contains("product-card")) {
              addCartListener(node);
            }
            
            // Check for product cards within the added node
            const productCards = node.querySelectorAll ? node.querySelectorAll(".product-card") : [];
            productCards.forEach(addCartListener);
          }
        });
      }
    });
  });
  
  // Function to add cart listener to a product card
  function addCartListener(card) {
    // Check if the card already has an event listener
    if (card.getAttribute("data-cart-listener") === "true") {
      return;
    }
    
    card.setAttribute("data-cart-listener", "true");
    
    card.addEventListener("click", function(e) {
      // Get product info
      const productImage = this.querySelector(".product-image img").src;
      const productTitle = this.querySelector(".product-title").textContent;
      const productPrice = this.querySelector(".product-price").textContent;
      const productCategory = this.querySelector(".product-category").textContent;
      
      const product = {
        image: productImage,
        title: productTitle,
        price: productPrice,
        category: productCategory
      };
      
      // Add to cart
      if (window.addToCart) {
        window.addToCart(product);
      }
    });
  }
  
  // Start observing the document with the configured parameters
  observer.observe(document.body, { childList: true, subtree: true });
})();