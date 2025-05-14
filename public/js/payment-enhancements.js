/**
 * Enhanced Payment Methods Module
 * Improves the payment method selection experience with visual icons and validation
 */

// Wait for DOM to be fully loaded before initializing
document.addEventListener("DOMContentLoaded", initPaymentEnhancements);

/**
 * Main initialization function
 */
function initPaymentEnhancements() {
  // Set up observer for checkout modal and enhance existing checkout if present
  setupCheckoutObserver();
  enhanceExistingCheckout();
  extendProceedToCheckout();
}

/**
 * Sets up a MutationObserver to watch for the checkout modal being added to the DOM
 */
function setupCheckoutObserver() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (!mutation.addedNodes || mutation.addedNodes.length === 0) return;

      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;

        // Check if node is checkout modal or contains it
        if (
          (node.classList &&
            node.classList.contains("checkout-modal-container")) ||
          node.querySelector(".checkout-modal-container")
        ) {
          enhancePaymentDropdown();
          break;
        }
      }
    });
  });

  // Start observing document body for changes
  observer.observe(document.body, { childList: true, subtree: true });
}

/**
 * Enhances any existing checkout container on page load
 */
function enhanceExistingCheckout() {
  const checkoutContainer = document.getElementById("checkout-container");
  if (checkoutContainer) {
    enhancePaymentDropdown();
  }
}

/**
 * Extends the existing proceedToCheckout function
 */
function extendProceedToCheckout() {
  const originalProceedToCheckout = window.proceedToCheckout;

  window.proceedToCheckout = function () {
    // Call the original function if it exists
    if (typeof originalProceedToCheckout === "function") {
      originalProceedToCheckout();
    }

    // Wait a short time for the modal to be created
    setTimeout(enhancePaymentDropdown, 100);
  };
}

/**
 * Enhances the payment method dropdown with visual icons and improved UX
 */
function enhancePaymentDropdown() {
  const paymentMethodSelect = document.getElementById("paymentMethod");
  if (!paymentMethodSelect) return;

  const paymentMethodContainer = paymentMethodSelect.parentElement;

  // Create and add payment icons container
  const paymentIconsContainer =
    createPaymentIconsContainer(paymentMethodSelect);
  paymentMethodContainer.insertBefore(
    paymentIconsContainer,
    paymentMethodSelect.nextSibling
  );

  // Set up change event on the select element
  setupPaymentSelectChangeEvent(paymentMethodSelect);

  // Enhance card input field with validation
  enhanceCardNumberInput();

  // Initialize with default selection
  initializeDefaultSelection(paymentMethodSelect);
}

/**
 * Creates a container with payment method icons
 * @param {HTMLElement} paymentMethodSelect - The payment method select element
 * @returns {HTMLElement} The payment icons container
 */
function createPaymentIconsContainer(paymentMethodSelect) {
  const paymentIconsContainer = document.createElement("div");
  paymentIconsContainer.className = "payment-method-icons";

  const paymentIcons = [
    { id: "creditCard", name: "Credit Card", icon: "fa-credit-card" },
    { id: "paypal", name: "PayPal", icon: "fa-paypal" },
    { id: "applePay", name: "Apple Pay", icon: "fa-apple" },
    { id: "googlePay", name: "Google Pay", icon: "fa-google" },
  ];

  paymentIcons.forEach((payment) => {
    const iconElement = createPaymentIcon(payment, paymentMethodSelect);
    paymentIconsContainer.appendChild(iconElement);
  });

  return paymentIconsContainer;
}

/**
 * Creates a payment method icon element
 * @param {Object} payment - Payment method data
 * @param {HTMLElement} paymentMethodSelect - The payment method select element
 * @returns {HTMLElement} The payment icon element
 */
function createPaymentIcon(payment, paymentMethodSelect) {
  const iconElement = document.createElement("div");
  iconElement.className = `payment-icon ${payment.id}`;
  iconElement.innerHTML = `<i class="fas ${payment.icon}"></i>`;
  iconElement.title = payment.name;

  // Add click event to select the corresponding option
  iconElement.addEventListener("click", () => {
    paymentMethodSelect.value = payment.id;

    // Trigger change event
    triggerChangeEvent(paymentMethodSelect);

    // Update active state for icons
    updateActiveIconState(iconElement);
  });

  return iconElement;
}

/**
 * Sets up change event handler for the payment method select element
 * @param {HTMLElement} paymentMethodSelect - The payment method select element
 */
function setupPaymentSelectChangeEvent(paymentMethodSelect) {
  paymentMethodSelect.addEventListener("change", function () {
    const selectedValue = this.value;

    // Update active icon
    updateActiveIconState(
      document.querySelector(`.payment-icon.${selectedValue}`)
    );

    // Apply smooth transitions between payment forms
    applyPaymentFormTransition(selectedValue);
  });
}

/**
 * Triggers a change event on an element
 * @param {HTMLElement} element - The element to trigger the event on
 */
function triggerChangeEvent(element) {
  const event = new Event("change");
  element.dispatchEvent(event);
}

/**
 * Updates the active state of payment icons
 * @param {HTMLElement} activeIcon - The icon to set as active
 */
function updateActiveIconState(activeIcon) {
  if (!activeIcon) return;

  // Remove active class from all icons
  document.querySelectorAll(".payment-icon").forEach((icon) => {
    icon.classList.remove("active");
  });

  // Add active class to selected icon
  activeIcon.classList.add("active");
}

/**
 * Applies transition animation to the selected payment form
 * @param {string} selectedValue - The selected payment method value
 */
function applyPaymentFormTransition(selectedValue) {
  const selectedForm = document.getElementById(`${selectedValue}-form`);
  if (!selectedForm) return;

  // Reset animation to trigger it again
  selectedForm.style.animation = "none";
  selectedForm.offsetHeight; // Trigger reflow
  selectedForm.style.animation = null;
}

/**
 * Enhances the card number input field with validation and card type detection
 */
function enhanceCardNumberInput() {
  const cardNumberInput = document.getElementById("cardNumber");
  if (!cardNumberInput) return;

  cardNumberInput.setAttribute("placeholder", "•••• •••• •••• ••••");

  cardNumberInput.addEventListener("input", function () {
    const value = this.value.replace(/\s+/g, "");
    detectAndApplyCardType(this, value);
  });
}

/**
 * Detects credit card type based on number pattern and applies CSS class
 * @param {HTMLElement} inputElement - The card number input element
 * @param {string} cardNumber - The card number without spaces
 */
function detectAndApplyCardType(inputElement, cardNumber) {
  // Remove existing card type classes
  inputElement.classList.remove("visa", "mastercard", "amex", "discover");

  // Basic card type detection
  let cardType = "";
  if (/^4/.test(cardNumber)) {
    cardType = "visa";
  } else if (/^5[1-5]/.test(cardNumber)) {
    cardType = "mastercard";
  } else if (/^3[47]/.test(cardNumber)) {
    cardType = "amex";
  } else if (/^6(?:011|5)/.test(cardNumber)) {
    cardType = "discover";
  }

  // Add card type class if detected
  if (cardType) {
    inputElement.classList.add(cardType);
  }
}

/**
 * Initializes the dropdown with the default selection
 * @param {HTMLElement} paymentMethodSelect - The payment method select element
 */
function initializeDefaultSelection(paymentMethodSelect) {
  if (paymentMethodSelect.value) {
    triggerChangeEvent(paymentMethodSelect);
  }
}
