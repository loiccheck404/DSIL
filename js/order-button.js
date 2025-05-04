// order-button.js - Handles the "Order Now" button functionality

document.addEventListener("DOMContentLoaded", function () {
  // Get the "Order Now" button element
  const orderButton = document.getElementById("orderbtn");

  // Add click event listener to the button
  if (orderButton) {
    orderButton.addEventListener("click", function (e) {
      e.preventDefault(); // Prevent default anchor behavior

      // Redirect to the checkout page
      window.location.href = "checkout.html";
    });
  }
});
