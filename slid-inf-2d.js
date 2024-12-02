document.addEventListener("DOMContentLoaded", function () {
    const sliderWrap = document.querySelector(".slider_testimonial_wrap");
    const cards = document.querySelectorAll(".slider_testimonial_card_slot");
    const lastCard = document.querySelector(".slider_testimonial_card_slot.is-last"); // Select last card with 'is-last' class
    let currentIndex = 0; // Track the current visible card
    let startX = 0; // Store the start position of the swipe/drag (X-axis)
    let startY = 0; // Store the start position of the swipe/drag (Y-axis)
    let isDragging = false; // Track if the user is swiping or dragging
    let cardWidth = 0; // Store the width of one card
    let currentTranslate = 0; // Current translateX value
    let prevTranslate = 0; // Previous translateX value
    const swipeThreshold = 50; // Minimum swipe distance to trigger a slide

    // Helper: Get the width of the card dynamically
    function getCardWidth() {
        return cards[0] ? cards[0].offsetWidth : 0;
    }

    // Helper: Check if the last card is fully in view
    function isLastCardInView() {
        if (!lastCard) return false;
        const rect = lastCard.getBoundingClientRect();
        return rect.left >= 0 && rect.right <= window.innerWidth;
    }

    // Clamp value to ensure it stays within min and max boundaries
    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    // Move the slider by the width of one card
    function moveSlider(direction) {
        const maxIndex = cards.length - 1; // Maximum index is the last card

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
        startX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
        startY = e.type.includes("mouse") ? e.clientY : e.touches[0].clientY;
        sliderWrap.style.transition = "none"; // Disable smooth transition while dragging
    }

    // Move during drag or touch
    function handleMove(e) {
        if (!isDragging) return;

        const currentX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
        const currentY = e.type.includes("mouse") ? e.clientY : e.touches[0].clientY;

        const diffX = currentX - startX; // Horizontal movement
        const diffY = currentY - startY; // Vertical movement

        // If vertical movement is greater than horizontal, cancel the swipe
        if (Math.abs(diffY) > Math.abs(diffX)) {
            isDragging = false;
            return;
        }

        // Prevent swiping beyond the last card
        if (isLastCardInView() && diffX < 0) {
            return; // Block further swiping left
        }

        // Calculate the new translation and clamp it to prevent overscrolling
        const maxTranslate = -(cards.length - 1) * cardWidth; // Maximum left position
        const minTranslate = 0; // Minimum right position (first card)
        currentTranslate = clamp(prevTranslate + diffX, maxTranslate, minTranslate);

        sliderWrap.style.transform = `translateX(${currentTranslate}px)`; // Translate dynamically as the user drags
    }

    // End drag or touch event
    function handleEnd(e) {
        if (!isDragging) return;
        isDragging = false;

        const endX = e.type.includes("mouse") ? e.clientX : e.changedTouches[0].clientX;
        const diff = endX - startX; // Calculate the swipe/drag distance

        if (diff < -swipeThreshold) {
            // Swipe left
            moveSlider("left");
        } else if (diff > swipeThreshold) {
            // Swipe right
            moveSlider("right");
        } else {
            // Snap back to the current position
            sliderWrap.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
            sliderWrap.style.transition = "transform 0.25s ease"; // Smooth snap-back (duration: 0.25s)
        }

        console.log("Last card fully in view:", isLastCardInView());
    }

    // Handle window resize to recalculate card width
    function handleResize() {
        cardWidth = getCardWidth(); // Update card width dynamically
        prevTranslate = -currentIndex * cardWidth; // Adjust current position based on new card width
        sliderWrap.style.transform = `translateX(${prevTranslate}px)`; // Maintain current position after resize
        sliderWrap.style.transition = "none"; // Disable transition during resize
    }

    // Add event listeners
    function addEventListeners() {
        sliderWrap.addEventListener("mousedown", handleStart); // For mouse down
        sliderWrap.addEventListener("mousemove", handleMove); // For mouse move
        sliderWrap.addEventListener("mouseup", handleEnd); // For mouse up
        sliderWrap.addEventListener("mouseleave", handleEnd); // Handle edge case when mouse leaves

        sliderWrap.addEventListener("touchstart", handleStart); // For touch start
        sliderWrap.addEventListener("touchmove", handleMove); // For touch move
        sliderWrap.addEventListener("touchend", handleEnd); // For touch end

        window.addEventListener("resize", handleResize); // Handle resizing
    }

    // Initialize the slider
    function initSlider() {
        cardWidth = getCardWidth(); // Set initial card width
        sliderWrap.style.transform = `translateX(0)`; // Reset to starting position
        sliderWrap.style.transition = "none"; // Disable transition initially
        addEventListeners(); // Add necessary event listeners
    }

    // Start the slider
    initSlider();
});
