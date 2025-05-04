/**
 * Mr Trappy's Profile Page JavaScript
 * Handles tab switching, form submissions, and interactive elements
 */

document.addEventListener('DOMContentLoaded', function() {
    // Tab Navigation
    const profileTabs = document.querySelectorAll('.profile-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    profileTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        // Remove active class from all tabs and contents
        profileTabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab
        this.classList.add('active');
        
        // Show the corresponding content
        const tabId = this.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
      });
    });
    
    // Personal Info Form Submission
    const personalInfoForm = document.querySelector('#personal-info form');
    if (personalInfoForm) {
      personalInfoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = {
          fullName: document.getElementById('fullname').value,
          email: document.getElementById('email').value,
          phone: document.getElementById('phone').value,
          dob: document.getElementById('dob').value,
          address: document.getElementById('address').value,
          city: document.getElementById('city').value,
          state: document.getElementById('state').value,
          zip: document.getElementById('zip').value
        };
        
        // Here we would typically send this data to the server
        // For demonstration, we'll show a success message
        showNotification('Personal information updated successfully!', 'success');
      });
    }
    
    // Preferences Form Submission
    const preferencesForm = document.querySelector('#preferences form');
    if (preferencesForm) {
      preferencesForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect preferences data
        const preferredCategories = Array.from(
          document.querySelectorAll('#preferences input[type="checkbox"]')
        )
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.parentElement.textContent.trim());
        
        // Here we would typically send this data to the server
        showNotification('Preferences saved successfully!', 'success');
      });
    }
    
    // Reward Redemption
    const redeemButtons = document.querySelectorAll('.reward-card button');
    redeemButtons.forEach(button => {
      button.addEventListener('click', function() {
        const rewardName = this.closest('.reward-card').querySelector('h4').textContent;
        const pointsCost = parseInt(this.closest('.reward-card').querySelector('.reward-cost').textContent);
        
        // Get current points
        const currentPoints = parseInt(document.querySelector('.points-value').textContent);
        
        if (currentPoints >= pointsCost) {
          // Subtract points
          const newPoints = currentPoints - pointsCost;
          document.querySelector('.points-value').textContent = newPoints;
          
          // Update points in progress bar as well
          const progressText = document.querySelector('.level-progress span');
          const newProgressText = progressText.textContent.replace(/^\d+/, newPoints);
          progressText.textContent = newProgressText;
          
          // Add to point history
          addPointHistoryEntry(`Reward Redemption - ${rewardName}`, -pointsCost);
          
          showNotification(`${rewardName} redeemed successfully!`, 'success');
        } else {
          showNotification('Not enough points to redeem this reward.', 'error');
        }
      });
    });
    
    // Avatar Upload Functionality
    const editAvatarBtn = document.querySelector('.edit-avatar');
    if (editAvatarBtn) {
      editAvatarBtn.addEventListener('click', function() {
        // Create a hidden file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        
        fileInput.addEventListener('change', function() {
          if (this.files && this.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
              // Update avatar image
              document.querySelector('.profile-avatar img').src = e.target.result;
              showNotification('Profile picture updated!', 'success');
            };
            
            reader.readAsDataURL(this.files[0]);
          }
        });
        
        fileInput.click();
      });
    }
    
    // Add to Cart functionality in Favorites tab
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
      button.addEventListener('click', function() {
        const productName = this.closest('.product-card').querySelector('.product-title').textContent;
        const productPrice = this.closest('.product-card').querySelector('.product-price').textContent;
        
        // Update cart badge count
        const cartBadge = document.getElementById('cart-badge');
        const currentCount = parseInt(cartBadge.textContent);
        cartBadge.textContent = currentCount + 1;
        
        showNotification(`${productName} added to cart!`, 'success');
      });
    });
    
    // Show More Orders button
    const showMoreOrdersBtn = document.querySelector('.show-more-btn');
    if (showMoreOrdersBtn) {
      showMoreOrdersBtn.addEventListener('click', function() {
        // This would typically load more orders from the server
        // For demonstration, we'll show a message
        showNotification('Loading more orders...', 'info');
        
        // After a delay, hide the button to simulate all orders loaded
        setTimeout(() => {
          this.style.display = 'none';
          showNotification('All orders loaded!', 'success');
        }, 1500);
      });
    }
    
    // Order filtering in the Orders tab
    const orderFilter = document.querySelector('.order-filters select');
    if (orderFilter) {
      orderFilter.addEventListener('change', function() {
        const filterValue = this.value;
        const orderCards = document.querySelectorAll('.order-card');
        
        if (filterValue === 'all') {
          orderCards.forEach(card => card.style.display = 'block');
        } else {
          orderCards.forEach(card => {
            const statusElement = card.querySelector('.order-status');
            if (statusElement.classList.contains(filterValue)) {
              card.style.display = 'block';
            } else {
              card.style.display = 'none';
            }
          });
        }
      });
    }
    
    // Order search functionality
    const orderSearch = document.querySelector('.order-filters input');
    if (orderSearch) {
      orderSearch.addEventListener('input', function() {
        const searchValue = this.value.toLowerCase();
        const orderCards = document.querySelectorAll('.order-card');
        
        orderCards.forEach(card => {
          const orderId = card.querySelector('.order-id').textContent.toLowerCase();
          const orderItems = Array.from(card.querySelectorAll('.item-name'))
            .map(item => item.textContent.toLowerCase());
          
          // Check if order ID or any item contains the search term
          if (orderId.includes(searchValue) || orderItems.some(item => item.includes(searchValue))) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    }
    
    // Helper function to add point history entry
    function addPointHistoryEntry(description, points) {
      const pointsHistory = document.querySelector('.points-history');
      const historyItem = document.createElement('div');
      historyItem.className = 'history-item';
      
      // Create date string for today
      const today = new Date();
      const dateString = today.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      historyItem.innerHTML = `
        <div class="history-date">${dateString}</div>
        <div class="history-description">${description}</div>
        <div class="history-points ${points >= 0 ? 'earned' : 'spent'}">${points >= 0 ? '+' + points : points} points</div>
      `;
      
      // Add to the beginning of the history
      if (pointsHistory.firstChild) {
        pointsHistory.insertBefore(historyItem, pointsHistory.firstChild);
      } else {
        pointsHistory.appendChild(historyItem);
      }
    }
    
    // Notification system
    function showNotification(message, type = 'info') {
      // Create notification element
      const notification = document.createElement('div');
      notification.className = `notification ${type}`;
      notification.textContent = message;
      
      // Add icon based on type
      const icon = document.createElement('i');
      switch (type) {
        case 'success':
          icon.className = 'fas fa-check-circle';
          break;
        case 'error':
          icon.className = 'fas fa-exclamation-circle';
          break;
        case 'info':
        default:
          icon.className = 'fas fa-info-circle';
      }
      
      notification.prepend(icon);
      
      // Add close button
      const closeBtn = document.createElement('span');
      closeBtn.className = 'notification-close';
      closeBtn.innerHTML = '&times;';
      closeBtn.addEventListener('click', function() {
        document.body.removeChild(notification);
      });
      notification.appendChild(closeBtn);
      
      // Add to body
      document.body.appendChild(notification);
      
      // Auto-remove after 5 seconds
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 5000);
    }
    
    // Handle logout button
    const logoutBtn = document.getElementById('loginbtn');
    if (logoutBtn && logoutBtn.textContent === 'Logout') {
      logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Show confirmation dialog
        if (confirm('Are you sure you want to log out?')) {
          // In a real app, this would clear session data and redirect
          showNotification('Logging out...', 'info');
          
          // Simulate redirect after logout
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 1500);
        }
      });
    }
    
    // Init any custom UI elements that need JavaScript
    initCustomUIElements();
  });
  
  // Initialize custom UI elements like sliders
  function initCustomUIElements() {
    // THC/CBD Preference slider
    const slider = document.querySelector('.slider-container .slider');
    if (slider) {
      // Change background gradient based on slider value
      slider.addEventListener('input', function() {
        const value = (this.value - this.min) / (this.max - this.min) * 100;
        this.style.background = `linear-gradient(to right, #4CAF50 0%, #4CAF50 ${value}%, #ddd ${value}%, #ddd 100%)`;
      });
      
      // Trigger once to set initial gradient
      const event = new Event('input');
      slider.dispatchEvent(event);
    }
    
    // Add CSS for notifications
    const style = document.createElement('style');
    style.textContent = `
      .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        background-color: #f8f9fa;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 400px;
        animation: slideIn 0.3s ease-out forwards;
      }
      
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      
      .notification.success {
        background-color: #d4edda;
        color: #155724;
        border-left: 4px solid #28a745;
      }
      
      .notification.error {
        background-color: #f8d7da;
        color: #721c24;
        border-left: 4px solid #dc3545;
      }
      
      .notification.info {
        background-color: #d1ecf1;
        color: #0c5460;
        border-left: 4px solid #17a2b8;
      }
      
      .notification i {
        font-size: 1.2rem;
      }
      
      .notification-close {
        margin-left: 15px;
        color: #6c757d;
        cursor: pointer;
        font-size: 1.5rem;
        line-height: 1;
      }
      
      .notification-close:hover {
        color: #343a40;
      }
    `;
    document.head.appendChild(style);
  }