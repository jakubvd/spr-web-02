document.addEventListener("DOMContentLoaded", () => {
    const sliderWrap = document.querySelector(".slider_home_wrap");
    const cards = document.querySelectorAll(".slider_home_card");
    const swipeThreshold = 50; // Minimum swipe distance to trigger a slide
    let currentIndex = 0; // Track the current visible card
    let startX = 0; // Store the start position of the swipe/drag (X-axis)
    let startY = 0; // Store the start position of the swipe/drag (Y-axis)
    let isDragging = false; // Track if the user is swiping or dragging
    let cardWidth = 0; // Store the width of one card
    let currentTranslate = 0; // Current translateX value
    let prevTranslate = 0; // Previous translateX value
    let isActive = false; // Track whether the slider is active

    // Helper: Get the width of the card dynamically
    const getCardWidth = () => (cards[0] ? cards[0].offsetWidth : 0);

    // Helper: Get the maximum swipe index based on viewport
    const getMaxIndex = () => {
        const viewportWidth = window.innerWidth;

        if (viewportWidth <= 991) {
            return Math.min(cards.length - 1, 2); // Max 2 swipes left for 1.5 cards in view
        }
        if (viewportWidth <= 1349) {
            return Math.min(cards.length - 1, 1); // Max 1 swipe left for 2.5 cards in view
        }
        return 0; // No swipes allowed above 1349px
    };

    // Clamp value to ensure it stays within min and max boundaries
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    // Move the slider by the width of one card using GSAP
    const moveSlider = (direction) => {
        const maxIndex = getMaxIndex();

        if (direction === "left" && currentIndex < maxIndex) {
            currentIndex++;
        } else if (direction === "right" && currentIndex > 0) {
            currentIndex--;
        }

        // Calculate the new translation
        const newTranslate = -currentIndex * cardWidth;

        // Apply the translation using GSAP
        gsap.to(sliderWrap, {
            x: newTranslate,
            duration: 0.25, // Match premium feel with 0.25s duration
            ease: "power1.out",
        });

        prevTranslate = newTranslate;
    };

    // Start drag or touch event
    const handleStart = (e) => {
        isDragging = true;
        const touch = e.type.includes("mouse") ? e : e.touches[0];
        startX = touch.clientX; // Store the starting X position
        startY = touch.clientY; // Store the starting Y position
        gsap.set(sliderWrap, { clearProps: "all" }); // Remove any transition to make dragging responsive
    };

    // Move during drag or touch
    const handleMove = (e) => {
        if (!isDragging) return;

        const touch = e.type.includes("mouse") ? e : e.touches[0];
        const diffX = touch.clientX - startX; // Horizontal movement
        const diffY = touch.clientY - startY; // Vertical movement

        // Cancel if vertical movement is greater than horizontal
        if (Math.abs(diffY) > Math.abs(diffX)) {
            isDragging = false;
            return;
        }

        // Calculate the new translation and clamp it to prevent overscrolling
        const maxTranslate = -(getMaxIndex() * cardWidth);
        const minTranslate = 0;
        currentTranslate = clamp(prevTranslate + diffX, maxTranslate, minTranslate);

        // Apply the translation dynamically
        gsap.set(sliderWrap, { x: currentTranslate });
    };

    // End drag or touch event
    const handleEnd = (e) => {
        if (!isDragging) return;
        isDragging = false;

        const touch = e.type.includes("mouse") ? e : e.changedTouches[0];
        const diff = touch.clientX - startX; // Calculate the swipe/drag distance

        if (diff < -swipeThreshold) {
            // Swipe left
            moveSlider("left");
        } else if (diff > swipeThreshold) {
            // Swipe right
            moveSlider("right");
        } else {
            // Snap back to the current position
            gsap.to(sliderWrap, {
                x: -currentIndex * cardWidth,
                duration: 0.25,
                ease: "power1.out",
            });
        }
    };

    // Handle window resize and activate/deactivate slider
    const handleResize = () => {
        const viewportWidth = window.innerWidth;

        // Recalculate cardWidth and update slider position on resize
        cardWidth = getCardWidth();
        const maxIndex = getMaxIndex();
        currentIndex = clamp(currentIndex, 0, maxIndex); // Clamp currentIndex to new maxIndex
        prevTranslate = -currentIndex * cardWidth; // Update previous translation
        gsap.set(sliderWrap, { x: prevTranslate }); // Adjust slider position

        // Activate or deactivate slider based on viewport width
        if (viewportWidth <= 1349 && !isActive) {
            activateSlider();
        } else if (viewportWidth > 1349 && isActive) {
            deactivateSlider();
        }
    };

    // Activate slider
    const activateSlider = () => {
        isActive = true;
        cardWidth = getCardWidth(); // Recalculate card width
        gsap.set(sliderWrap, { x: -currentIndex * cardWidth }); // Set initial position

        // Add event listeners for touch and pointer (mouse) events
        sliderWrap.addEventListener("mousedown", handleStart); // For mouse down
        sliderWrap.addEventListener("mousemove", handleMove); // For mouse move
        sliderWrap.addEventListener("mouseup", handleEnd); // For mouse up
        sliderWrap.addEventListener("mouseleave", handleEnd); // Handle edge case when mouse leaves

        sliderWrap.addEventListener("touchstart", handleStart); // For touch start
        sliderWrap.addEventListener("touchmove", handleMove); // For touch move
        sliderWrap.addEventListener("touchend", handleEnd); // For touch end
    };

    // Deactivate slider
    const deactivateSlider = () => {
        isActive = false;
        gsap.set(sliderWrap, { x: 0 }); // Reset to default position

        // Remove event listeners
        sliderWrap.removeEventListener("mousedown", handleStart);
        sliderWrap.removeEventListener("mousemove", handleMove);
        sliderWrap.removeEventListener("mouseup", handleEnd);
        sliderWrap.removeEventListener("mouseleave", handleEnd);

        sliderWrap.removeEventListener("touchstart", handleStart);
        sliderWrap.removeEventListener("touchmove", handleMove);
        sliderWrap.removeEventListener("touchend", handleEnd);
    };

    // Initialize resize handling
    window.addEventListener("resize", handleResize);

    // Initial check on load
    handleResize();
});
