document.addEventListener("DOMContentLoaded", function () {
    const sliderWrap = document.querySelector(".testimonial_slider_wrap");
    const cards = document.querySelectorAll(".slider_card");
    let currentIndex = 0; // Track the current visible card
    let startX = 0; // Store the start position of the swipe
    let isDragging = false; // Track if the user is swiping

    // Helper: Get the width of the card dynamically
    function getCardWidth() {
        return cards[0] ? cards[0].offsetWidth : 0;
    }

    // Helper: Get the visible cards and swipe limits
    function getVisibleCards() {
        const viewportWidth = window.innerWidth;

        if (viewportWidth <= 991) {
            return { visible: 1.5, maxSwipes: 2 }; // 1.5 cards, max 2 swipes left
        }
        if (viewportWidth <= 1304) {
            return { visible: 2.5, maxSwipes: 1 }; // 2.5 cards, max 1 swipe left
        }
        return { visible: cards.length, maxSwipes: 0 }; // All cards in view (static)
    }

    // Move the slider
    function moveSlider(direction) {
        const cardWidth = getCardWidth();
        const { visible, maxSwipes } = getVisibleCards();
        const maxIndex = cards.length - Math.ceil(visible); // Calculate max index based on visible cards

        if (direction === "left" && currentIndex < maxSwipes) {
            currentIndex++;
        } else if (direction === "right" && currentIndex > 0) {
            currentIndex--;
        }

        // Apply the translation
        sliderWrap.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
        sliderWrap.style.transition = "transform 0.3s ease"; // Smooth movement
    }

    // Start touch event
    function handleTouchStart(e) {
        isDragging = true;
        startX = e.touches[0].clientX; // Record the starting X position
        sliderWrap.style.transition = "none"; // Disable smooth transition while dragging
    }

    // End touch event
    function handleTouchEnd(e) {
        if (!isDragging) return;
        isDragging = false;

        const endX = e.changedTouches[0].clientX; // Get the end X position
        const diff = endX - startX; // Calculate the swipe difference

        if (diff < -50) {
            // Swipe left
            moveSlider("left");
        } else if (diff > 50) {
            // Swipe right
            moveSlider("right");
        }
    }

    // Initialize slider logic for breakpoints 1304px and below
    function initializeSlider() {
        if (window.innerWidth > 1304) {
            // Disable the slider for larger screens
            sliderWrap.style.transform = "translateX(0)";
            sliderWrap.style.transition = "none";
            currentIndex = 0; // Reset to the initial position
            return;
        }

        // Add touch event listeners to the slider wrapper
        sliderWrap.addEventListener("touchstart", handleTouchStart);
        sliderWrap.addEventListener("touchend", handleTouchEnd);

        // Adjust slider position on window resize
        window.addEventListener("resize", function () {
            if (window.innerWidth > 1304) {
                // Reset slider for larger screens
                sliderWrap.style.transform = "translateX(0)";
                sliderWrap.style.transition = "none";
                currentIndex = 0;
            } else {
                // Recalculate position for smaller screens
                const cardWidth = getCardWidth();
                sliderWrap.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
            }
        });
    }

    // Run the initialization
    initializeSlider();
});
