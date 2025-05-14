document.addEventListener("DOMContentLoaded", function () {
  // Function to determine how many items to show based on screen width
  function getVisibleCount() {
    return window.innerWidth < 768 ? 3 : 5;
  }

  // Animation transition duration - 5 seconds
  const ANIMATION_DURATION = 500;
  const ANIMATION_STEP_DELAY = 100; // Delay between each card animation

  // Add CSS for slide animations to the document head
  const styleElement = document.createElement("style");
  styleElement.textContent = `
      .product-card {
        transition: transform ${ANIMATION_DURATION / 1000}s ease, opacity ${
    ANIMATION_DURATION / 1000
  }s ease;
        transform-origin: center top;
      }
      .card-hidden {
        transform: translateY(50px);
        opacity: 0;
      }
      .card-visible {
        transform: translateY(0);
        opacity: 1;
      }
    `;
  document.head.appendChild(styleElement);

  // Select all product grid sections
  const productSections = document.querySelectorAll(".featured-section");

  productSections.forEach((section) => {
    const productGrid = section.querySelector(".product-grid");
    const showMoreBtn = section.querySelector(".show-more-btn");
    const productCards = productGrid.querySelectorAll(".product-card");

    // Set initial visible count based on screen size
    let initialVisibleCount = getVisibleCount();
    let isExpanded = false;

    // Function to update visibility based on current initialVisibleCount
    function updateCardVisibility(expanded) {
      productCards.forEach((card, index) => {
        // Apply appropriate classes based on visibility
        if (!expanded && index >= initialVisibleCount) {
          card.classList.add("card-hidden");
          card.classList.remove("card-visible");

          // After animation completes, hide the card completely
          setTimeout(() => {
            if (!isExpanded) {
              // Double-check state hasn't changed
              card.style.display = "none";
            }
          }, ANIMATION_DURATION);
        } else {
          // Make sure it's displayed before animating
          card.style.display = "block";

          // Small delay before starting animation
          setTimeout(() => {
            card.classList.remove("card-hidden");
            card.classList.add("card-visible");
          }, 10);
        }
      });

      // If there are fewer products than initialVisibleCount, hide the "Show More" button
      if (productCards.length <= initialVisibleCount) {
        showMoreBtn.style.display = "none";
      } else {
        showMoreBtn.style.display = "block";
        showMoreBtn.textContent = expanded ? "Show Less" : "Show More";
      }
    }

    // Initial setup - apply classes for initial state
    productCards.forEach((card, index) => {
      if (index >= initialVisibleCount) {
        card.classList.add("card-hidden");
        card.style.display = "none";
      } else {
        card.classList.add("card-visible");
      }
    });

    // If there are fewer products than initialVisibleCount, hide the "Show More" button
    if (productCards.length <= initialVisibleCount) {
      showMoreBtn.style.display = "none";
    }

    // Add click event to the "Show More/Less" button
    showMoreBtn.addEventListener("click", function (e) {
      e.preventDefault();

      // Toggle expanded state
      isExpanded = !isExpanded;

      if (isExpanded) {
        // Show all hidden cards with a slight delay for each to create a cascade effect
        productCards.forEach((card, index) => {
          if (index >= initialVisibleCount) {
            // First make the card visible but hidden
            card.style.display = "block";

            // Cascade effect with delay based on card position
            setTimeout(() => {
              card.classList.remove("card-hidden");
              card.classList.add("card-visible");
            }, (index - initialVisibleCount) * ANIMATION_STEP_DELAY);
          }
        });

        // Change the button text to "Show Less"
        showMoreBtn.textContent = "Show Less";
      } else {
        // Hide cards beyond the initial count with cascade effect
        let cardsToHide = Array.from(productCards).slice(initialVisibleCount);
        cardsToHide.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add("card-hidden");
            card.classList.remove("card-visible");

            // After animation completes, hide the card completely
            setTimeout(() => {
              if (!isExpanded) {
                // Double-check state hasn't changed
                card.style.display = "none";
              }
            }, ANIMATION_DURATION);
          }, index * ANIMATION_STEP_DELAY);
        });

        // Change button text back to "Show More"
        showMoreBtn.textContent = "Show More";
      }
    });

    // Add resize event listener to adjust visible count when screen size changes
    window.addEventListener("resize", function () {
      const newVisibleCount = getVisibleCount();

      // Only update if the visible count changed
      if (newVisibleCount !== initialVisibleCount) {
        let oldVisibleCount = initialVisibleCount;
        initialVisibleCount = newVisibleCount;

        if (!isExpanded) {
          // If we're showing more cards now (larger screen)
          if (newVisibleCount > oldVisibleCount) {
            // Show the newly visible cards
            for (
              let i = oldVisibleCount;
              i < newVisibleCount && i < productCards.length;
              i++
            ) {
              const card = productCards[i];
              card.style.display = "block";

              setTimeout(() => {
                card.classList.remove("card-hidden");
                card.classList.add("card-visible");
              }, (i - oldVisibleCount) * ANIMATION_STEP_DELAY);
            }
          }
          // If we're showing fewer cards now (smaller screen)
          else if (newVisibleCount < oldVisibleCount) {
            // Hide the cards that should no longer be visible
            for (
              let i = newVisibleCount;
              i < oldVisibleCount && i < productCards.length;
              i++
            ) {
              const card = productCards[i];

              card.classList.add("card-hidden");
              card.classList.remove("card-visible");

              // After animation completes, hide the card completely
              setTimeout(() => {
                if (!isExpanded) {
                  // Double-check state hasn't changed
                  card.style.display = "none";
                }
              }, ANIMATION_DURATION);
            }
          }
        }

        // Update button text if needed
        if (productCards.length <= initialVisibleCount) {
          showMoreBtn.style.display = "none";
        } else {
          showMoreBtn.style.display = "block";
        }
      }
    });
  });
});
