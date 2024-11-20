document.addEventListener("DOMContentLoaded", function () {
    const sliderWrap = document.querySelector(".slider_home_wrap");
    const cards = document.querySelectorAll(".slider_home_card");
    let currentIndex = 0; // Track the current visible card
    let startX = 0; // Store the start position of the swipe/drag
    let isDragging = false; // Track if the user is swiping or dragging
    let currentTranslate = 0; // Track the current translation value
    let prevTranslate = 0; // Store the previous translation value

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

        currentTranslate = prevTranslate + diff;
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
            sliderWrap.style.transform = `translateX(${prevTranslate}px)`;
            sliderWrap.style.transition = "transform 0.4s ease";
        }
    }

    // Add event listeners for touch and pointer (mouse) events
    sliderWrap.addEventListener("mousedown", handleStart); // For mouse down
    sliderWrap.addEventListener("mousemove", handleMove); // For mouse move
    sliderWrap.addEventListener("mouseup", handleEnd); // For mouse up
    sliderWrap.addEventListener("mouseleave", handleEnd); // Handle edge case when mouse leaves

    sliderWrap.addEventListener("touchstart", handleStart); // For touch start
    sliderWrap.addEventListener("touchmove", handleMove); // For touch move
    sliderWrap.addEventListener("touchend", handleEnd); // For touch end

    // Adjust slider on window resize
    window.addEventListener("resize", function () {
        const cardWidth = getCardWidth();
        sliderWrap.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
    });
});
