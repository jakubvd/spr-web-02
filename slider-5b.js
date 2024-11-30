document.addEventListener("DOMContentLoaded", function () {
    const sliderWrap = document.querySelector(".slider_home_wrap");
    const cards = document.querySelectorAll(".slider_home_card");
    let currentIndex = 0; // Track the current visible card
    let startX = 0; // Store the start position of the swipe/drag (X-axis)
    let startY = 0; // Store the start position of the swipe/drag (Y-axis)
    let isDragging = false; // Track if the user is swiping or dragging
    let isClicking = true; // Track whether the interaction is a click/tap
    let cardWidth = 0; // Store the width of one card
    let currentTranslate = 0; // Current translateX value
    let prevTranslate = 0; // Previous translateX value
    let isActive = false; // Track whether the slider is active
    const swipeThreshold = 50; // Minimum swipe distance to trigger a slide

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
        return 0; // No swipes allowed above 1349px
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
        isClicking = true; // Assume it's a click until proven otherwise
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

        // If the movement is significant, it's no longer a click
        if (Math.abs(diffX) > 5 || Math.abs(diffY) > 5) {
            isClicking = false; // Mark interaction as a swipe/drag
        }

        // If vertical movement is greater than horizontal, cancel the swipe
        if (Math.abs(diffY) > Math.abs(diffX)) {
            isDragging = false;
            return;
        }

        // Calculate the new translation and clamp it to prevent overscrolling
        const maxTranslate = -(getMaxIndex() * cardWidth);
        const minTranslate = 0;
        currentTranslate = clamp(prevTranslate + diffX, maxTranslate, minTranslate);

        sliderWrap.style.transform = `translateX(${currentTranslate}px)`; // Translate dynamically as the user drags
    }

    // End drag or touch event
    function handleEnd(e) {
        if (!isDragging) return;
        isDragging = false;

        // If it's a click/tap, do nothing
        if (isClicking) return;

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
    }

    // Handle window resize and activate/deactivate slider
    function handleResize() {
        const viewportWidth = window.innerWidth;

        // Recalculate cardWidth and update slider position on resize
        cardWidth = getCardWidth();
        const maxIndex = getMaxIndex();
        currentIndex = clamp(currentIndex, 0, maxIndex);
        prevTranslate = -currentIndex * cardWidth;
        sliderWrap.style.transform = `translateX(${prevTranslate}px)`;
        sliderWrap.style.transition = "none";

        // Activate or deactivate slider based on viewport width
        if (viewportWidth <= 1349 && !isActive) {
            activateSlider();
        } else if (viewportWidth > 1349 && isActive) {
            deactivateSlider();
        }
    }

    // Activate slider
    function activateSlider() {
        isActive = true;
        cardWidth = getCardWidth();
        sliderWrap.style.transform = `translateX(${-currentIndex * cardWidth}px)`;

        sliderWrap.addEventListener("mousedown", handleStart);
        sliderWrap.addEventListener("mousemove", handleMove);
        sliderWrap.addEventListener("mouseup", handleEnd);
        sliderWrap.addEventListener("mouseleave", handleEnd);

        sliderWrap.addEventListener("touchstart", handleStart);
        sliderWrap.addEventListener("touchmove", handleMove);
        sliderWrap.addEventListener("touchend", handleEnd);
    }

    // Deactivate slider
    function deactivateSlider() {
        isActive = false;
        sliderWrap.style.transform = "translateX(0)";
        sliderWrap.style.transition = "none";

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
