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

      // Add event listeners
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
});
