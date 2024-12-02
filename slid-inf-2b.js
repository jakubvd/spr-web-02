document.addEventListener("DOMContentLoaded", function () {
    const sliderWrap = document.querySelector(".slider_testimonial_wrap");
    const cards = document.querySelectorAll(".slider_testimonial_card_slot");
    let currentIndex = 0; // Track the current visible card
    let startX = 0; // Store the start position of the swipe/drag (X-axis)
    let isDragging = false; // Track if the user is swiping or dragging
    let cardWidth = 0; // Store the width of one card
    let currentTranslate = 0; // Current translateX value
    let prevTranslate = 0; // Previous translateX value
    const swipeThreshold = 50; // Minimum swipe distance to trigger a slide

    // Helper: Get the width of the card dynamically
    function getCardWidth() {
        return cards[0] ? cards[0].offsetWidth : 0;
    }

    // Helper: Check if the first card is fully in view
    function isFirstCardFullyVisible() {
        return currentIndex === 0;
    }

    // Helper: Check if the last card is fully in view
    function isLastCardFullyVisible() {
        const lastCard = cards[cards.length - 1];
        const sliderRect = sliderWrap.getBoundingClientRect();
        const lastCardRect = lastCard.getBoundingClientRect();

        return lastCardRect.right <= sliderRect.right;
    }

    // Move the slider by the width of one card
    function moveSlider(direction) {
        const maxIndex = cards.length - 1;

        if (direction === "left" && !isLastCardFullyVisible()) {
            currentIndex++;
        } else if (direction === "right" && !isFirstCardFullyVisible()) {
            currentIndex--;
        }

        // Apply the translation
        sliderWrap.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
        sliderWrap.style.transition = "transform 0.25s ease"; // Smooth movement
        prevTranslate = -currentIndex * cardWidth;
    }

    // Start drag or touch event
    function handleStart(e) {
        isDragging = true;
        startX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
        sliderWrap.style.transition = "none"; // Disable smooth transition while dragging
    }

    // Move during drag or touch
    function handleMove(e) {
        if (!isDragging) return;

        const currentX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
        const diffX = currentX - startX; // Horizontal movement

        currentTranslate = prevTranslate + diffX;
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
            sliderWrap.style.transition = "transform 0.25s ease"; // Smooth snap-back
        }
    }

    // Handle window resize and recalculate dimensions
    function handleResize() {
        cardWidth = getCardWidth();
        prevTranslate = -currentIndex * cardWidth;
        sliderWrap.style.transform = `translateX(${prevTranslate}px)`;
        sliderWrap.style.transition = "none";
    }

    // Add event listeners
    sliderWrap.addEventListener("mousedown", handleStart);
    sliderWrap.addEventListener("mousemove", handleMove);
    sliderWrap.addEventListener("mouseup", handleEnd);
    sliderWrap.addEventListener("mouseleave", handleEnd);
    sliderWrap.addEventListener("touchstart", handleStart);
    sliderWrap.addEventListener("touchmove", handleMove);
    sliderWrap.addEventListener("touchend", handleEnd);
    window.addEventListener("resize", handleResize);

    // Initialize slider dimensions
    handleResize();
});
