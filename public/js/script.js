// User authentication functionality
document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const loginBtn = document.getElementById("loginbtn");
  const modalContainer = document.createElement("div");
  modalContainer.className = "auth-modal-container";
  document.body.appendChild(modalContainer);

  // User state
  let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

  // Update UI based on user state
  function updateUIState() {
    if (currentUser) {
      loginBtn.textContent = `Hello, ${currentUser.firstName}`;
      loginBtn.href = "#";
      loginBtn.onclick = function (e) {
        e.preventDefault();
        showUserMenu();
      };
    } else {
      loginBtn.textContent = "Login";
      loginBtn.href = "#";
      loginBtn.onclick = function (e) {
        e.preventDefault();
        showLoginModal();
      };
    }
  }

  // Initialize UI
  updateUIState();

  // Show login modal
  function showLoginModal() {
    modalContainer.innerHTML = `
            <div class="auth-modal">
                <div class="auth-modal-content">
                    <span class="close-modal">&times;</span>
                    <div class="auth-tabs">
                        <button class="auth-tab active" data-tab="login">Login</button>
                        <button class="auth-tab" data-tab="signup">Sign Up</button>
                    </div>
                    
                    <div class="tab-content" id="login-tab">
                        <h2>Welcome Back</h2>
                        <form id="login-form">
                            <div class="form-group">
                                <label for="login-email">Email</label>
                                <input type="email" id="login-email" required>
                            </div>
                            <div class="form-group">
                                <label for="login-password">Password</label>
                                <input type="password" id="login-password" required>
                            </div>
                            <div class="form-options">
                                <label>
                                    <input type="checkbox" id="remember-me"> Remember me
                                </label>
                                <a href="#" class="forgot-password">Forgot password?</a>
                            </div>
                            <button type="submit" class="auth-button">Login</button>
                        </form>
                    </div>
                    
                    <div class="tab-content" id="signup-tab" style="display: none;">
                        <h2>Create Account</h2>
                        <form id="signup-form">
                            <div class="form-group">
                                <label for="signup-firstname">First Name</label>
                                <input type="text" id="signup-firstname" required>
                            </div>
                            <div class="form-group">
                                <label for="signup-lastname">Last Name</label>
                                <input type="text" id="signup-lastname" required>
                            </div>
                            <div class="form-group">
                                <label for="signup-email">Email</label>
                                <input type="email" id="signup-email" required>
                            </div>
                            <div class="form-group">
                                <label for="signup-password">Password</label>
                                <input type="password" id="signup-password" required minlength="8">
                                <small>Password must be at least 8 characters</small>
                            </div>
                            <div class="form-group">
                                <label for="signup-confirm">Confirm Password</label>
                                <input type="password" id="signup-confirm" required>
                            </div>
                            <div class="form-options">
                                <label>
                                    <input type="checkbox" id="terms" required> 
                                    I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                                </label>
                            </div>
                            <button type="submit" class="auth-button">Create Account</button>
                        </form>
                    </div>
                </div>
            </div>
        `;

    modalContainer.style.display = "flex";

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
    const tabs = modalContainer.querySelectorAll(".auth-tab");
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

    // Login form submission
    const loginForm = document.getElementById("login-form");
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;

      // Check if user exists in localStorage
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        // Login successful
        currentUser = user;
        localStorage.setItem("currentUser", JSON.stringify(user));

        // Show success message and close modal
        showNotification("Login successful!", "success");
        modalContainer.style.display = "none";

        // Update UI
        updateUIState();
      } else {
        // Login failed
        showNotification("Invalid email or password!", "error");
      }
    });

    // Signup form submission
    const signupForm = document.getElementById("signup-form");
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const firstName = document.getElementById("signup-firstname").value;
      const lastName = document.getElementById("signup-lastname").value;
      const email = document.getElementById("signup-email").value;
      const password = document.getElementById("signup-password").value;
      const confirmPassword = document.getElementById("signup-confirm").value;

      // Validate password match
      if (password !== confirmPassword) {
        showNotification("Passwords do not match!", "error");
        return;
      }

      // Check if email already exists
      const users = JSON.parse(localStorage.getItem("users")) || [];
      if (users.some((user) => user.email === email)) {
        showNotification("Email already in use!", "error");
        return;
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        firstName,
        lastName,
        email,
        password,
        createdAt: new Date().toISOString(),
      };

      // Save user to localStorage
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      // Auto login
      currentUser = newUser;
      localStorage.setItem("currentUser", JSON.stringify(newUser));

      // Show success message and close modal
      showNotification("Account created successfully!", "success");
      modalContainer.style.display = "none";

      // Update UI
      updateUIState();
    });
  }

  // Show user dropdown menu
  function showUserMenu() {
    // Create menu if it doesn't exist
    let userMenu = document.querySelector(".user-dropdown");

    if (!userMenu) {
      userMenu = document.createElement("div");
      userMenu.className = "user-dropdown";
      userMenu.innerHTML = `
                <ul>
                    <li class="user-info">
                        <div class="user-name">${currentUser.firstName} ${currentUser.lastName}</div>
                        <div class="user-email">${currentUser.email}</div>
                    </li>
                    <li><a href="#" id="profile-link">My Profile</a></li>
                    <li><a href="#" id="orders-link">My Orders</a></li>
                    <li><a href="#" id="settings-link">Settings</a></li>
                    <li><a href="#" id="logout-link">Logout</a></li>
                </ul>
            `;

      document.body.appendChild(userMenu);

      // Position the menu near the login button
      const loginBtnRect = loginBtn.getBoundingClientRect();
      userMenu.style.top = loginBtnRect.bottom + window.scrollY + "px";
      userMenu.style.left = loginBtnRect.left + "px";

      // Add event listeners for each menu item
      document
        .getElementById("profile-link")
        .addEventListener("click", function (e) {
          e.preventDefault();
          showProfilePage();
          userMenu.remove();
        });

      document
        .getElementById("orders-link")
        .addEventListener("click", function (e) {
          e.preventDefault();
          showOrdersPage();
          userMenu.remove();
        });

      document
        .getElementById("settings-link")
        .addEventListener("click", function (e) {
          e.preventDefault();
          showSettingsPage();
          userMenu.remove();
        });

      document
        .getElementById("logout-link")
        .addEventListener("click", function (e) {
          e.preventDefault();
          logout();
          userMenu.remove();
        });

      // Close menu when clicking outside
      window.addEventListener("click", function (e) {
        if (!userMenu.contains(e.target) && e.target !== loginBtn) {
          userMenu.remove();
        }
      });
    } else {
      userMenu.remove();
    }
  }

  // Show user profile page
  function showProfilePage() {
    // Create profile modal
    modalContainer.innerHTML = `
    <div class="auth-modal">
      <div class="auth-modal-content profile-content">
        <span class="close-modal">&times;</span>
        <h2>My Profile</h2>
        
        <div class="profile-info">
          <div class="profile-avatar">
            <div class="avatar-placeholder">
              ${currentUser.firstName.charAt(0)}${currentUser.lastName.charAt(
      0
    )}
            </div>
            <button class="change-avatar-btn">Change Photo</button>
          </div>
          
          <form id="profile-form">
            <div class="form-group">
              <label for="profile-firstname">First Name</label>
              <input type="text" id="profile-firstname" value="${
                currentUser.firstName
              }" required>
            </div>
            <div class="form-group">
              <label for="profile-lastname">Last Name</label>
              <input type="text" id="profile-lastname" value="${
                currentUser.lastName
              }" required>
            </div>
            <div class="form-group">
              <label for="profile-email">Email</label>
              <input type="email" id="profile-email" value="${
                currentUser.email
              }" required>
            </div>
            <div class="form-group">
              <label for="profile-phone">Phone Number</label>
              <input type="tel" id="profile-phone" value="${
                currentUser.phone || ""
              }">
            </div>
            <div class="form-group">
              <label for="profile-address">Address</label>
              <textarea id="profile-address">${
                currentUser.address || ""
              }</textarea>
            </div>
            <button type="submit" class="auth-button">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  `;

    modalContainer.style.display = "flex";

    // Close modal functionality
    const closeModal = modalContainer.querySelector(".close-modal");
    closeModal.addEventListener("click", function () {
      modalContainer.style.display = "none";
    });

    window.addEventListener("click", function (e) {
      if (e.target === modalContainer) {
        modalContainer.style.display = "none";
      }
    });

    // Handle form submission
    const profileForm = document.getElementById("profile-form");
    profileForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get updated user information
      const updatedUser = {
        ...currentUser,
        firstName: document.getElementById("profile-firstname").value,
        lastName: document.getElementById("profile-lastname").value,
        email: document.getElementById("profile-email").value,
        phone: document.getElementById("profile-phone").value,
        address: document.getElementById("profile-address").value,
      };

      // Update user in localStorage
      currentUser = updatedUser;
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      // Update user in users array
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const userIndex = users.findIndex((u) => u.id === currentUser.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem("users", JSON.stringify(users));
      }

      // Show success message and close modal
      showNotification("Profile updated successfully!", "success");
      modalContainer.style.display = "none";

      // Update UI
      updateUIState();
    });
  }

  // Show orders page
  function showOrdersPage() {
    // Get user orders from localStorage (or initialize empty array)
    const orders =
      JSON.parse(localStorage.getItem(`orders_${currentUser.id}`)) || [];

    // Create orders modal
    modalContainer.innerHTML = `
    <div class="auth-modal">
      <div class="auth-modal-content orders-content">
        <span class="close-modal">&times;</span>
        <h2>My Orders</h2>
        
        <div class="orders-list">
          ${
            orders.length
              ? renderOrdersList(orders)
              : `
            <div class="empty-orders">
              <p>You haven't placed any orders yet.</p>
              <a href="#" class="start-shopping-btn">Start Shopping</a>
            </div>
          `
          }
        </div>
      </div>
    </div>
  `;

    modalContainer.style.display = "flex";

    // Close modal functionality
    const closeModal = modalContainer.querySelector(".close-modal");
    closeModal.addEventListener("click", function () {
      modalContainer.style.display = "none";
    });

    window.addEventListener("click", function (e) {
      if (e.target === modalContainer) {
        modalContainer.style.display = "none";
      }
    });

    // Add event listener for "Start Shopping" button if shown
    const startShoppingBtn = modalContainer.querySelector(
      ".start-shopping-btn"
    );
    if (startShoppingBtn) {
      startShoppingBtn.addEventListener("click", function (e) {
        e.preventDefault();
        modalContainer.style.display = "none";
        // Redirect to products page or show products section
        window.scrollTo({
          top: document.querySelector("#products")
            ? document.querySelector("#products").offsetTop
            : 0,
          behavior: "smooth",
        });
      });
    }

    // Add event listeners for order detail buttons
    const orderDetailBtns = modalContainer.querySelectorAll(".view-order-btn");
    orderDetailBtns.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        const orderId = this.getAttribute("data-order-id");
        const order = orders.find((o) => o.id === orderId);
        if (order) {
          showOrderDetails(order);
        }
      });
    });
  }

  // Helper function to render orders list
  function renderOrdersList(orders) {
    return `
    <table class="orders-table">
      <thead>
        <tr>
          <th>Order #</th>
          <th>Date</th>
          <th>Status</th>
          <th>Total</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${orders
          .map(
            (order) => `
          <tr>
            <td>#${order.id.substring(0, 8)}</td>
            <td>${new Date(order.date).toLocaleDateString()}</td>
            <td><span class="order-status ${order.status.toLowerCase()}">${
              order.status
            }</span></td>
            <td>$${order.total.toFixed(2)}</td>
            <td><button class="view-order-btn" data-order-id="${
              order.id
            }">Details</button></td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;
  }

  // Show single order details
  function showOrderDetails(order) {
    modalContainer.innerHTML = `
    <div class="auth-modal">
      <div class="auth-modal-content order-detail-content">
        <span class="close-modal">&times;</span>
        <div class="order-detail-header">
          <h2>Order #${order.id.substring(0, 8)}</h2>
          <span class="order-status ${order.status.toLowerCase()}">${
      order.status
    }</span>
        </div>
        
        <div class="order-info">
          <div class="order-info-group">
            <h3>Order Date</h3>
            <p>${new Date(order.date).toLocaleDateString()} at ${new Date(
      order.date
    ).toLocaleTimeString()}</p>
          </div>
          
          <div class="order-info-group">
            <h3>Shipping Address</h3>
            <p>${
              order.shippingAddress ||
              currentUser.address ||
              "No address provided"
            }</p>
          </div>
          
          <div class="order-info-group">
            <h3>Payment Method</h3>
            <p>${order.paymentMethod || "Credit Card"}</p>
          </div>
        </div>
        
        <div class="order-items">
          <h3>Order Items</h3>
          <table class="item-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (item) => `
                <tr>
                  <td>
                    <div class="item-info">
                      <div class="item-image-placeholder"></div>
                      <div class="item-details">
                        <div class="item-name">${item.name}</div>
                        ${
                          item.options
                            ? `<div class="item-options">${item.options}</div>`
                            : ""
                        }
                      </div>
                    </div>
                  </td>
                  <td>$${item.price.toFixed(2)}</td>
                  <td>${item.quantity}</td>
                  <td>$${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>
        
        <div class="order-summary">
          <div class="summary-row">
            <span>Subtotal</span>
            <span>$${order.subtotal.toFixed(2)}</span>
          </div>
          <div class="summary-row">
            <span>Shipping</span>
            <span>$${order.shipping.toFixed(2)}</span>
          </div>
          ${
            order.discount
              ? `
            <div class="summary-row discount">
              <span>Discount</span>
              <span>-$${order.discount.toFixed(2)}</span>
            </div>
          `
              : ""
          }
          <div class="summary-row tax">
            <span>Tax</span>
            <span>$${order.tax.toFixed(2)}</span>
          </div>
          <div class="summary-row total">
            <span>Total</span>
            <span>$${order.total.toFixed(2)}</span>
          </div>
        </div>
        
        <div class="order-actions">
          <button class="track-order-btn">Track Order</button>
          <button class="back-to-orders-btn">Back to Orders</button>
        </div>
      </div>
    </div>
  `;

    modalContainer.style.display = "flex";

    // Close modal functionality
    const closeModal = modalContainer.querySelector(".close-modal");
    closeModal.addEventListener("click", function () {
      modalContainer.style.display = "none";
    });

    window.addEventListener("click", function (e) {
      if (e.target === modalContainer) {
        modalContainer.style.display = "none";
      }
    });

    // Back to orders button
    const backBtn = modalContainer.querySelector(".back-to-orders-btn");
    backBtn.addEventListener("click", function (e) {
      e.preventDefault();
      showOrdersPage();
    });

    // Track order button
    const trackBtn = modalContainer.querySelector(".track-order-btn");
    trackBtn.addEventListener("click", function (e) {
      e.preventDefault();
      showNotification("Tracking information is not available yet.", "info");
    });
  }

  // Show settings page
  function showSettingsPage() {
    modalContainer.innerHTML = `
    <div class="auth-modal">
      <div class="auth-modal-content settings-content">
        <span class="close-modal">&times;</span>
        <h2>Account Settings</h2>
        
        <div class="settings-tabs">
          <button class="settings-tab active" data-tab="password">Password</button>
          <button class="settings-tab" data-tab="notifications">Notifications</button>
          <button class="settings-tab" data-tab="privacy">Privacy</button>
        </div>
        
        <div class="settings-tab-content" id="password-tab">
          <h3>Change Password</h3>
          <form id="password-form">
            <div class="form-group">
              <label for="current-password">Current Password</label>
              <input type="password" id="current-password" required>
            </div>
            <div class="form-group">
              <label for="new-password">New Password</label>
              <input type="password" id="new-password" required minlength="8">
              <small>Password must be at least 8 characters</small>
            </div>
            <div class="form-group">
              <label for="confirm-password">Confirm New Password</label>
              <input type="password" id="confirm-password" required>
            </div>
            <button type="submit" class="auth-button">Update Password</button>
          </form>
        </div>
        
        <div class="settings-tab-content" id="notifications-tab" style="display: none;">
          <h3>Notification Preferences</h3>
          <form id="notifications-form">
            <div class="form-group checkbox-group">
              <label>
                <input type="checkbox" id="order-updates" ${
                  currentUser.notifications?.orderUpdates ? "checked" : ""
                }>
                Order status updates
              </label>
            </div>
            <div class="form-group checkbox-group">
              <label>
                <input type="checkbox" id="promo-emails" ${
                  currentUser.notifications?.promoEmails ? "checked" : ""
                }>
                Promotional emails and offers
              </label>
            </div>
            <div class="form-group checkbox-group">
              <label>
                <input type="checkbox" id="product-news" ${
                  currentUser.notifications?.productNews ? "checked" : ""
                }>
                New product announcements
              </label>
            </div>
            <div class="form-group checkbox-group">
              <label>
                <input type="checkbox" id="account-activity" ${
                  currentUser.notifications?.accountActivity ? "checked" : ""
                }>
                Account activity alerts
              </label>
            </div>
            <button type="submit" class="auth-button">Save Preferences</button>
          </form>
        </div>
        
        <div class="settings-tab-content" id="privacy-tab" style="display: none;">
          <h3>Privacy Settings</h3>
          <form id="privacy-form">
            <div class="form-group checkbox-group">
              <label>
                <input type="checkbox" id="data-collection" ${
                  currentUser.privacy?.dataCollection !== false ? "checked" : ""
                }>
                Allow data collection for personalized experience
              </label>
            </div>
            <div class="form-group checkbox-group">
              <label>
                <input type="checkbox" id="third-party" ${
                  currentUser.privacy?.thirdParty ? "checked" : ""
                }>
                Share data with trusted third parties
              </label>
            </div>
            <h4>Data Management</h4>
            <div class="data-actions">
              <button type="button" class="secondary-button" id="download-data-btn">Download My Data</button>
              <button type="button" class="danger-button" id="delete-account-btn">Delete Account</button>
            </div>
            <button type="submit" class="auth-button">Save Privacy Settings</button>
          </form>
        </div>
      </div>
    </div>
  `;

    modalContainer.style.display = "flex";

    // Close modal functionality
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
    const tabs = modalContainer.querySelectorAll(".settings-tab");
    tabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        // Remove active class from all tabs
        tabs.forEach((t) => t.classList.remove("active"));
        // Add active class to clicked tab
        this.classList.add("active");

        // Hide all tab contents
        document
          .querySelectorAll(".settings-tab-content")
          .forEach((content) => {
            content.style.display = "none";
          });

        // Show the selected tab content
        const tabName = this.getAttribute("data-tab");
        document.getElementById(tabName + "-tab").style.display = "block";
      });
    });

    // Password change form
    const passwordForm = document.getElementById("password-form");
    passwordForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const currentPassword = document.getElementById("current-password").value;
      const newPassword = document.getElementById("new-password").value;
      const confirmPassword = document.getElementById("confirm-password").value;

      // Validate current password
      if (currentPassword !== currentUser.password) {
        showNotification("Current password is incorrect!", "error");
        return;
      }

      // Validate password match
      if (newPassword !== confirmPassword) {
        showNotification("New passwords do not match!", "error");
        return;
      }

      // Update password
      const updatedUser = {
        ...currentUser,
        password: newPassword,
      };

      // Update user in localStorage
      currentUser = updatedUser;
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      // Update user in users array
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const userIndex = users.findIndex((u) => u.id === currentUser.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem("users", JSON.stringify(users));
      }

      // Show success message
      showNotification("Password updated successfully!", "success");
      passwordForm.reset();
    });

    // Notifications form
    const notificationsForm = document.getElementById("notifications-form");
    notificationsForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const notifications = {
        orderUpdates: document.getElementById("order-updates").checked,
        promoEmails: document.getElementById("promo-emails").checked,
        productNews: document.getElementById("product-news").checked,
        accountActivity: document.getElementById("account-activity").checked,
      };

      // Update user preferences
      const updatedUser = {
        ...currentUser,
        notifications,
      };

      // Update user in localStorage
      currentUser = updatedUser;
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      // Update user in users array
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const userIndex = users.findIndex((u) => u.id === currentUser.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem("users", JSON.stringify(users));
      }

      // Show success message
      showNotification("Notification preferences updated!", "success");
    });

    // Privacy form
    const privacyForm = document.getElementById("privacy-form");
    privacyForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const privacy = {
        dataCollection: document.getElementById("data-collection").checked,
        thirdParty: document.getElementById("third-party").checked,
      };

      // Update user preferences
      const updatedUser = {
        ...currentUser,
        privacy,
      };

      // Update user in localStorage
      currentUser = updatedUser;
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      // Update user in users array
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const userIndex = users.findIndex((u) => u.id === currentUser.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem("users", JSON.stringify(users));
      }

      // Show success message
      showNotification("Privacy settings updated!", "success");
    });

    // Download data button
    const downloadDataBtn = document.getElementById("download-data-btn");
    downloadDataBtn.addEventListener("click", function (e) {
      e.preventDefault();

      // Prepare user data for download (excluding password)
      const userData = { ...currentUser };
      delete userData.password;

      // Get user orders
      const orders =
        JSON.parse(localStorage.getItem(`orders_${currentUser.id}`)) || [];
      userData.orders = orders;

      // Convert to JSON and create blob
      const dataStr = JSON.stringify(userData, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });

      // Create download link and trigger click
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `user_data_${currentUser.id}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showNotification("Your data has been downloaded", "success");
    });

    // Delete account button
    const deleteAccountBtn = document.getElementById("delete-account-btn");
    deleteAccountBtn.addEventListener("click", function (e) {
      e.preventDefault();

      // Show confirmation dialog
      if (
        confirm(
          "Are you sure you want to delete your account? This action cannot be undone."
        )
      ) {
        // Remove user from users array
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const updatedUsers = users.filter((u) => u.id !== currentUser.id);
        localStorage.setItem("users", JSON.stringify(updatedUsers));

        // Remove user data
        localStorage.removeItem("currentUser");
        localStorage.removeItem(`orders_${currentUser.id}`);

        // Reset current user
        currentUser = null;

        // Close modal and update UI
        modalContainer.style.display = "none";
        updateUIState();

        showNotification("Your account has been deleted", "info");
      }
    });
  }

  // Logout function
  function logout() {
    currentUser = null;
    localStorage.removeItem("currentUser");
    updateUIState();
    showNotification("Logged out successfully!", "success");
  }

  // Show notification
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

  function loadProducts() {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "<p>Loading products...</p>";

    fetch("/api/products")
      .then((response) => response.json())
      .then((data) => {
        // Render products
        renderProducts(data.data);
      })
      .catch((error) => {
        productList.innerHTML =
          "<p>Error loading products. Please try again.</p>";
        console.error("Error loading products:", error);
      });
  }

  function handleFetchError(error, element, message) {
    console.error(error);
    element.innerHTML = `<div class="error">${message}</div>`;
  }

  function isLoggedIn() {
    return localStorage.getItem("token") !== null;
  }

  function updateNavigation() {
    const authLinks = document.getElementById("auth-links");

    if (isLoggedIn()) {
      authLinks.innerHTML = `
        <a href="/account">My Account</a>
        <a href="#" id="logout-link">Logout</a>
      `;
      document.getElementById("logout-link").addEventListener("click", logout);
    } else {
      authLinks.innerHTML = `
        <a href="/login">Login</a>
        <a href="/register">Register</a>
      `;
    }
  }

  const navLinks = document.querySelectorAll("ul.tabs li a");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // Remove 'active' from all links
      navLinks.forEach((l) => l.classList.remove("active"));
      // Add 'active' to the clicked link
      this.classList.add("active");
    });
  });
});
