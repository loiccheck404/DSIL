// In script.js or a separate router.js file
function router() {
  const path = window.location.pathname;

  // Hide all page containers
  document.querySelectorAll(".page-container").forEach((page) => {
    page.style.display = "none";
  });

  // Show the appropriate page based on the path
  switch (path) {
    case "/":
      document.getElementById("home-page").style.display = "block";
      loadProducts();
      break;
    case "/cart":
      document.getElementById("cart-page").style.display = "block";
      loadCart();
      break;
    case "/checkout":
      document.getElementById("checkout-page").style.display = "block";
      loadCheckoutForm();
      break;
    default:
      document.getElementById("home-page").style.display = "block";
      loadProducts();
  }
}

// Call router on page load and when the history changes
window.addEventListener("load", router);
window.addEventListener("popstate", router);
