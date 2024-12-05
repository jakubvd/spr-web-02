document.addEventListener("DOMContentLoaded", function () {
    const sliderWrap = document.querySelector(".slider_testimonial_wrap");
    const cards = document.querySelectorAll(".slider_testimonial_card_slot");
    const lastCard = document.querySelector(".slider_testimonial_card_slot.is-last");
    const swipeThreshold = 30; // Minimum swipe distance to trigger slide
    let currentIndex = 0;
    let cardWidth = 0;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let prevTranslate = 0;
    let currentTranslate = 0;

    // Helper: Calculate card width
    function getCardWidth() {
        return cards[0] ? cards[0].offsetWidth : 0;
    }

    // Helper: Check if the last card is fully in view
    function isLastCardFullyInView() {
        if (!lastCard) return false;
        const lastCardRect = lastCard.getBoundingClientRect();
        return (
            lastCardRect.left >= 0 &&
            lastCardRect.right <= window.innerWidth
        );
    }

    // Move slider by card width
    function moveSlider(direction) {
        const maxIndex = cards.length - 1;

        if (direction === "left" && currentIndex < maxIndex) {
            if (!isLastCardFullyInView()) {
                currentIndex++;
            }
        } else if (direction === "right" && currentIndex > 0) {
            currentIndex--;
        }

        // Update slider position
        sliderWrap.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
        sliderWrap.style.transition = "transform 0.3s ease-in-out"; // Smooth movement with sine easing
        prevTranslate = -currentIndex * cardWidth;
    }

    // Start dragging
    function handleStart(e) {
        isDragging = true;
        startX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
        startY = e.type.includes("mouse") ? e.clientY : e.touches[0].clientY;
        sliderWrap.style.transition = "none"; // Disable transition during drag
    }

    // Move slider during drag
    function handleMove(e) {
        if (!isDragging) return;

        const currentX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
        const currentY = e.type.includes("mouse") ? e.clientY : e.touches[0].clientY;

        const diffX = currentX - startX;
        const diffY = currentY - startY;

        // If vertical movement is greater than horizontal, cancel the swipe
        if (Math.abs(diffY) > Math.abs(diffX)) {
            isDragging = false;
            return;
        }

        currentTranslate = prevTranslate + diffX;

        // Allow dragging only if it's within allowed boundaries
        const maxTranslate = -(cards.length - 1) * cardWidth; // Prevent dragging beyond last card
        const minTranslate = 0; // Prevent dragging before first card
        currentTranslate = Math.max(Math.min(currentTranslate, minTranslate), maxTranslate);

        // Prevent dragging to the left if the last card is fully in view
        if (isLastCardFullyInView() && currentTranslate < -(cards.length - 1) * cardWidth) {
            currentTranslate = -(cards.length - 1) * cardWidth;
        }

        sliderWrap.style.transform = `translateX(${currentTranslate}px)`;
    }

    // End dragging
    function handleEnd(e) {
        if (!isDragging) return;
        isDragging = false;

        const endX = e.type.includes("mouse") ? e.clientX : e.changedTouches[0].clientX;
        const diffX = endX - startX;

        // Determine swipe direction
        if (diffX < -swipeThreshold) {
            moveSlider("left");
        } else if (diffX > swipeThreshold) {
            moveSlider("right");
        } else {
            // Snap back to the current position
            sliderWrap.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
            sliderWrap.style.transition = "transform 0.3s ease-in-out"; // Smooth snap-back with sine easing
        }
    }

    // Recalculate on resize
    function handleResize() {
        cardWidth = getCardWidth();
        prevTranslate = -currentIndex * cardWidth;
        sliderWrap.style.transform = `translateX(${prevTranslate}px)`;
        sliderWrap.style.transition = "none"; // Disable transition during resize
    }

    // Add event listeners
    function addEventListeners() {
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
        sliderWrap.style.transform = `translateX(0)`;
        sliderWrap.style.transition = "none";
        addEventListeners();
    }

    initSlider(); // Start the slider
});
