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

    // Helper: Get the maximum swipe index based on viewport
    function getMaxIndex() {
        const viewportWidth = window.innerWidth;

        if (viewportWidth <= 991) {
            return Math.min(cards.length - 1, 2); // Max 2 swipes left for 1.5 cards in view
        }
        if (viewportWidth <= 1304) {
            return Math.min(cards.length - 1, 1); // Max 1 swipe left for 2.5 cards in view
        }
        return 0; // No swipes allowed above 1304px
    }

    // Move the slider by the width of one card
    function moveSlider(direction) {
        const cardWidth = getCardWidth();
        const maxIndex = getMaxIndex();

        if (direction === "left" && currentIndex < maxIndex) {
            currentIndex++;
        } else if (direction === "right" && currentIndex > 0) {
            currentIndex--;
        }

        // Apply the translation
        sliderWrap.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
        sliderWrap.style.transition = "transform 0.4s ease"; // Smooth movement
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

    // Add touch event listeners to the slider wrapper
    sliderWrap.addEventListener("touchstart", handleTouchStart);
    sliderWrap.addEventListener("touchend", handleTouchEnd);

    // Adjust slider on window resize
    window.addEventListener("resize", function () {
        const cardWidth = getCardWidth();
        sliderWrap.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
    });
});
