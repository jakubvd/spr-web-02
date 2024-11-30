document.addEventListener("DOMContentLoaded", () => {
    const sliderWrap = document.querySelector(".slider_home_wrap");
    const cards = document.querySelectorAll(".slider_home_card");
    const swipeThreshold = 50; // Minimum swipe distance to trigger a slide
    let currentIndex = 0; // Track the current visible card
    let startX = 0; // Store the start position of the swipe/drag (X-axis)
    let startY = 0; // Store the start position of the swipe/drag (Y-axis)
    let isDragging = false; // Track if the user is swiping or dragging
    let isClicking = true; // Track whether the interaction is a click
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
            duration: 0.25,
            ease: "power1.out",
        });

        prevTranslate = newTranslate;
    };

    // Start drag or touch event
    const handleStart = (e) => {
        isDragging = true;
        isClicking = true; // Assume it's a click until proven otherwise
        const touch = e.type.includes("mouse") ? e : e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        gsap.set(sliderWrap, { clearProps: "all" }); // Remove transitions during dragging
    };

    // Move during drag or touch
    const handleMove = (e) => {
        if (!isDragging) return;

        isClicking = false; // Mark interaction as a drag/swipe
        const touch = e.type.includes("mouse") ? e : e.touches[0];
        const diffX = touch.clientX - startX;
        const diffY = touch.clientY - startY;

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

        // Exit if it's a click/tap, do nothing
        if (isClicking) return;

        const touch = e.type.includes("mouse") ? e : e.changedTouches[0];
        const diff = touch.clientX - startX;

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
        currentIndex = clamp(currentIndex, 0, maxIndex);
        prevTranslate = -currentIndex * cardWidth;
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
        cardWidth = getCardWidth();
        gsap.set(sliderWrap, { x: -currentIndex * cardWidth });

        sliderWrap.addEventListener("mousedown", handleStart);
        sliderWrap.addEventListener("mousemove", handleMove);
        sliderWrap.addEventListener("mouseup", handleEnd);
        sliderWrap.addEventListener("mouseleave", handleEnd);

        sliderWrap.addEventListener("touchstart", handleStart);
        sliderWrap.addEventListener("touchmove", handleMove);
        sliderWrap.addEventListener("touchend", handleEnd);
    };

    // Deactivate slider
    const deactivateSlider = () => {
        isActive = false;
        gsap.set(sliderWrap, { x: 0 });

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
