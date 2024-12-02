document.addEventListener("DOMContentLoaded", function () {
    const sliderWrap = document.querySelector(".slider_infinite_wrap");
    const cards = document.querySelectorAll(".slider_infinite_card");
    let currentIndex = 0; // Track the current visible card
    let startX = 0; // Start position of the swipe
    let startY = 0; // Vertical start position to detect vertical swipes
    let isDragging = false; // Track if the user is dragging
    let cardWidth = 0; // Store the width of a single card
    const swipeThreshold = 50; // Minimum swipe distance to trigger movement

    // Helper: Get the width of the card dynamically
    function getCardWidth() {
        return cards[0] ? cards[0].offsetWidth : 0;
    }

    // Helper: Clamp the currentIndex to ensure valid card range
    function clampIndex(index, min, max) {
        return Math.max(min, Math.min(index, max));
    }

    // Helper: Move the slider to the appropriate position
    function moveSlider() {
        sliderWrap.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
        sliderWrap.style.transition = "transform 0.3s ease"; // Smooth animation
    }

    // Start touch or mouse drag
    function handleStart(e) {
        isDragging = true;
        startX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
        startY = e.type.includes("mouse") ? e.clientY : e.touches[0].clientY;
        sliderWrap.style.transition = "none"; // Disable smooth transition while dragging
    }

    // During touch or mouse drag
    function handleMove(e) {
        if (!isDragging) return;

        const currentX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
        const currentY = e.type.includes("mouse") ? e.clientY : e.touches[0].clientY;

        const diffX = currentX - startX;
        const diffY = currentY - startY;

        // Prevent horizontal movement if vertical swipe is detected
        if (Math.abs(diffY) > Math.abs(diffX)) {
            isDragging = false;
            return;
        }

        // Move slider dynamically as user drags
        const translateX = -currentIndex * cardWidth + diffX;
        sliderWrap.style.transform = `translateX(${translateX}px)`;
    }

    // End touch or mouse drag
    function handleEnd(e) {
        if (!isDragging) return;
        isDragging = false;

        const endX = e.type.includes("mouse") ? e.clientX : e.changedTouches[0].clientX;
        const diffX = endX - startX;

        if (diffX < -swipeThreshold) {
            // Swipe left
            currentIndex = clampIndex(currentIndex + 1, 0, cards.length - 1);
        } else if (diffX > swipeThreshold) {
            // Swipe right
            currentIndex = clampIndex(currentIndex - 1, 0, cards.length - 1);
        }

        // Snap to the nearest card
        moveSlider();
    }

    // Handle window resize and recalculate cardWidth
    function handleResize() {
        cardWidth = getCardWidth();
        moveSlider(); // Adjust slider position based on current index
    }

    // Add event listeners
    function addListeners() {
        sliderWrap.addEventListener("mousedown", handleStart);
        sliderWrap.addEventListener("mousemove", handleMove);
        sliderWrap.addEventListener("mouseup", handleEnd);
        sliderWrap.addEventListener("mouseleave", handleEnd);
        sliderWrap.addEventListener("touchstart", handleStart);
        sliderWrap.addEventListener("touchmove", handleMove);
        sliderWrap.addEventListener("touchend", handleEnd);
        window.addEventListener("resize", handleResize);
    }

    // Initialize slider
    function initSlider() {
        cardWidth = getCardWidth();
        moveSlider();
        addListeners();
    }

    // Initialize on DOM load
    initSlider();
});
