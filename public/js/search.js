// Product search functionality
document.addEventListener("DOMContentLoaded", function () {
    // DOM Elements
    const searchInput = document.querySelector(".search-bar input");
    const searchButton = document.querySelector(".search-bar button");
    const mainContent = document.querySelector("main") || document.body;
  
    // Create search results container - will be shown/hidden as needed
    const searchResultsContainer = document.createElement("section");
    searchResultsContainer.className = "search-results-section";
    searchResultsContainer.innerHTML = `
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Search Results</h2>
            <button class="close-search-btn">&times;</button>
          </div>
          <div id="search-results" class="product-grid"></div>
        </div>
      `;
    mainContent.insertBefore(
      searchResultsContainer,
      document.querySelector(".featured-section")
    );
    searchResultsContainer.style.display = "none";
  
    // Product database - in a real app, this would come from a backend API
    // For demo purposes, we'll create an array of products from what's visible on the page
    const products = extractProductsFromDOM();
  
    // Search event listeners
    searchButton.addEventListener("click", performSearch);
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        performSearch();
      }
    });
  
    // Close search results
    const closeSearchBtn =
      searchResultsContainer.querySelector(".close-search-btn");
    closeSearchBtn.addEventListener("click", function () {
      searchResultsContainer.style.display = "none";
      document.querySelectorAll(".featured-section").forEach((section) => {
        section.style.display = "block";
      });
    });
  
    // Extract products from the DOM for our search database
    function extractProductsFromDOM() {
      const productCards = document.querySelectorAll(".product-card");
      const products = [];
  
      productCards.forEach((card) => {
        const category =
          card.querySelector(".product-category")?.textContent || "";
        const title = card.querySelector(".product-title")?.textContent || "";
        const price = card.querySelector(".product-price")?.textContent || "";
        const metaElements = card.querySelectorAll(".product-meta span");
        const meta = Array.from(metaElements)
          .map((span) => span.textContent)
          .join(" ");
        const image = card.querySelector(".product-image img")?.src || "";
  
        products.push({
          category,
          title,
          price,
          meta,
          image,
          element: card.cloneNode(true), // Clone the card for reuse in search results
        });
      });
  
      return products;
    }
  
    // Search function
    function performSearch() {
      const query = searchInput.value.trim().toLowerCase();
      if (query.length < 2) {
        // Use the improved notification system
        if (window.showNotification) {
          window.showNotification("Please enter at least 2 characters to search", "info");
        } else {
          console.warn("Notification system not found");
          alert("Please enter at least 2 characters to search");
        }
        return;
      }
  
      // Filter products based on search query
      const results = products.filter((product) => {
        const searchText =
          `${product.category} ${product.title} ${product.meta}`.toLowerCase();
        return searchText.includes(query);
      });
  
      displaySearchResults(results, query);
    }
  
    // Display search results
    function displaySearchResults(results, query) {
      const resultsContainer = document.getElementById("search-results");
      resultsContainer.innerHTML = "";
  
      // Hide all product sections
      document.querySelectorAll(".featured-section").forEach((section) => {
        section.style.display = "none";
      });
  
      // Update section title to show query and result count
      const sectionTitle = searchResultsContainer.querySelector(".section-title");
      sectionTitle.textContent = `Results for "${query}" (${results.length} products)`;
  
      // Show search results section
      searchResultsContainer.style.display = "block";
  
      if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
              <p>No products found matching "${query}".</p>
              <p>Try different keywords or browse our categories.</p>
            </div>
          `;
        return;
      }
  
      // Populate results
      results.forEach((product) => {
        const productElement = product.element.cloneNode(true);
  
        // Add click event listener to add to cart
        productElement.setAttribute("data-cart-listener", "true");
        productElement.addEventListener("click", function () {
          // Collect product info for cart
          const cartProduct = {
            image: product.image,
            title: product.title,
            price: product.price,
            category: product.category,
          };
  
          // Add to cart using the function from cart.js
          if (window.addToCart) {
            window.addToCart(cartProduct);
          } else {
            console.error("Add to cart function not found");
            
            // Use the improved notification system
            if (window.showNotification) {
              window.showNotification("Cannot add to cart at this time", "error");
            } else {
              alert("Cannot add to cart at this time");
            }
          }
        });
  
        resultsContainer.appendChild(productElement);
      });
  
      // Scroll to results
      searchResultsContainer.scrollIntoView({ behavior: "smooth" });
    }
  });