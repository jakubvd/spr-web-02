document.addEventListener("DOMContentLoaded", function () {
    const sliderWrap = document.querySelector(".slider_home_wrap");
    const cards = document.querySelectorAll(".slider_home_card");
    let currentIndex = 0; // Track the current visible card
    let startX = 0; // Store the start position of the swipe/drag
    let isDragging = false; // Track if the user is swiping or dragging
    let cardWidth = 0; // Store the width of one card
    let currentTranslate = 0; // Current translateX value
    let prevTranslate = 0; // Previous translateX value
    let isActive = false; // Track whether the slider is active

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
        if (viewportWidth <= 1349) {
            return Math.min(cards.length - 1, 1); // Max 1 swipe left for 2.5 cards in view
        }
        return 0; // No swipes allowed above 1304px
    }

    // Clamp value to ensure it stays within min and max boundaries
    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    // Move the slider by the width of one card
    function moveSlider(direction) {
        const maxIndex = getMaxIndex();

        if (direction === "left" && currentIndex < maxIndex) {
            currentIndex++;
        } else if (direction === "right" && currentIndex > 0) {
            currentIndex--;
        }

        // Apply the translation
        sliderWrap.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
        sliderWrap.style.transition = "transform 0.25s ease"; // Smooth movement (duration: 0.25s)
        prevTranslate = -currentIndex * cardWidth;
    }

    // Start drag or touch event
    function handleStart(e) {
        isDragging = true;
        startX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX; // Use clientX for mouse and touches
        sliderWrap.style.transition = "none"; // Disable smooth transition while dragging
    }

    // Move during drag or touch
    function handleMove(e) {
        if (!isDragging) return;

        const currentX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
        const diff = currentX - startX;

        // Calculate the new translation and clamp it to prevent overscrolling
        const maxTranslate = -(getMaxIndex() * cardWidth);
        const minTranslate = 0;
        currentTranslate = clamp(prevTranslate + diff, maxTranslate, minTranslate);

        sliderWrap.style.transform = `translateX(${currentTranslate}px)`; // Translate dynamically as the user drags
    }

    // End drag or touch event
    function handleEnd(e) {
        if (!isDragging) return;
        isDragging = false;

        const endX = e.type.includes("mouse") ? e.clientX : e.changedTouches[0].clientX; // Use clientX for mouse and touches
        const diff = endX - startX; // Calculate the swipe/drag distance

        if (diff < -50) {
            // Swipe left
            moveSlider("left");
        } else if (diff > 50) {
            // Swipe right
            moveSlider("right");
        } else {
            // Snap back to the current position
            sliderWrap.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
            sliderWrap.style.transition = "transform 0.25s ease"; // Smooth snap-back (duration: 0.25s)
        }
    }

    // Handle window resize and activate/deactivate slider
    function handleResize() {
        const viewportWidth = window.innerWidth;

        if (viewportWidth <= 1349 && !isActive) {
            activateSlider();
        } else if (viewportWidth > 1349 && isActive) {
            deactivateSlider();
        }
    }

    // Activate slider
    function activateSlider() {
        isActive = true;
        cardWidth = getCardWidth(); // Recalculate card width
        sliderWrap.style.transform = `translateX(${-currentIndex * cardWidth}px)`; // Set initial position

        // Add event listeners for touch and pointer (mouse) events
        sliderWrap.addEventListener("mousedown", handleStart); // For mouse down
        sliderWrap.addEventListener("mousemove", handleMove); // For mouse move
        sliderWrap.addEventListener("mouseup", handleEnd); // For mouse up
        sliderWrap.addEventListener("mouseleave", handleEnd); // Handle edge case when mouse leaves

        sliderWrap.addEventListener("touchstart", handleStart); // For touch start
        sliderWrap.addEventListener("touchmove", handleMove); // For touch move
        sliderWrap.addEventListener("touchend", handleEnd); // For touch end
    }

    // Deactivate slider
    function deactivateSlider() {
        isActive = false;
        sliderWrap.style.transform = "translateX(0)"; // Reset to default position
        sliderWrap.style.transition = "none"; // Disable transition

        // Remove event listeners
        sliderWrap.removeEventListener("mousedown", handleStart);
        sliderWrap.removeEventListener("mousemove", handleMove);
        sliderWrap.removeEventListener("mouseup", handleEnd);
        sliderWrap.removeEventListener("mouseleave", handleEnd);

        sliderWrap.removeEventListener("touchstart", handleStart);
        sliderWrap.removeEventListener("touchmove", handleMove);
        sliderWrap.removeEventListener("touchend", handleEnd);
    }

    // Initialize resize handling
    window.addEventListener("resize", handleResize);

    // Initial check on load
    handleResize();
});
