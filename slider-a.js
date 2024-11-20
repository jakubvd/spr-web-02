document.addEventListener("DOMContentLoaded", () => {
    const sliderWrap = document.querySelector(".testimonial_slider_wrap");
    const cards = document.querySelectorAll(".slider_card");
    let currentIndex = 0; // Start with the first card
    let cardWidth = cards[0].offsetWidth; // Dynamically calculate the card width
    let isDragging = false; // Flag for dragging
    let startX = 0;
    let currentX = 0;

    // Dynamically adjust card width based on breakpoints
    const updateCardWidth = () => {
        const viewportWidth = window.innerWidth;

        if (viewportWidth <= 478) {
            // Mobile (80vw)
            cardWidth = sliderWrap.offsetWidth * 0.8; // 80% of wrapper width
        } else if (viewportWidth <= 991) {
            // Tablet (75vw)
            cardWidth = sliderWrap.offsetWidth * 0.75; // 75% of wrapper width
        } else if (viewportWidth <= 1439) {
            // Small Desktop (Fixed widths for slider)
            cardWidth = 24.5 * 16; // 24.5rem in pixels
        } else {
            // Large Desktop
            cardWidth = 24 * 16; // 24rem in pixels
        }
        console.log(`Card width updated: ${cardWidth}px`);
    };

    // Move the slider to the correct position
    const moveSlider = (index) => {
        const translateValue = -index * cardWidth; // Calculate translateX value
        sliderWrap.style.transform = `translateX(${translateValue}px)`; // Apply sliding
        sliderWrap.style.transition = "transform 0.3s ease-in-out"; // Smooth transition
    };

    // Reset slider to its initial position
    const resetSliderPosition = () => {
        currentIndex = 0; // Reset to the first card
        sliderWrap.style.transform = `translateX(0px)`; // Move back to the start
        sliderWrap.style.transition = "none"; // Disable animation during reset
    };

    // Attach slider events
    const attachSliderEvents = () => {
        sliderWrap.addEventListener("pointerdown", pointerDownHandler);
        sliderWrap.addEventListener("pointermove", pointerMoveHandler);
        sliderWrap.addEventListener("pointerup", pointerUpHandler);
        sliderWrap.addEventListener("pointerleave", pointerUpHandler);
        sliderWrap.addEventListener("touchstart", pointerDownHandler);
        sliderWrap.addEventListener("touchmove", pointerMoveHandler);
        sliderWrap.addEventListener("touchend", pointerUpHandler);
    };

    // Detach slider events
    const detachSliderEvents = () => {
        sliderWrap.removeEventListener("pointerdown", pointerDownHandler);
        sliderWrap.removeEventListener("pointermove", pointerMoveHandler);
        sliderWrap.removeEventListener("pointerup", pointerUpHandler);
        sliderWrap.removeEventListener("pointerleave", pointerUpHandler);
        sliderWrap.removeEventListener("touchstart", pointerDownHandler);
        sliderWrap.removeEventListener("touchmove", pointerMoveHandler);
        sliderWrap.removeEventListener("touchend", pointerUpHandler);
    };

    // Handle pointer down (start dragging)
    const pointerDownHandler = (event) => {
        isDragging = true;
        startX = event.clientX || event.touches[0].clientX; // Record the starting position
        sliderWrap.style.transition = "none"; // Disable transition while dragging
    };

    // Handle pointer move (dragging)
    const pointerMoveHandler = (event) => {
        if (!isDragging) return;

        currentX = event.clientX || event.touches[0].clientX; // Current pointer position
        const diff = currentX - startX; // Calculate swipe distance

        // Temporarily move the slider (drag effect)
        const temporaryTranslate = -currentIndex * cardWidth + diff;
        sliderWrap.style.transform = `translateX(${temporaryTranslate}px)`;
    };

    // Handle pointer up (end dragging)
    const pointerUpHandler = () => {
        isDragging = false;

        // Calculate swipe direction
        const diff = currentX - startX;
        if (diff > 50 && currentIndex > 0) {
            currentIndex--; // Swipe right
        } else if (diff < -50 && currentIndex < cards.length - 1) {
            currentIndex++; // Swipe left
        }

        // Snap back to the nearest card
        moveSlider(currentIndex);
    };

    // Update card width and enable slider functionality
    const enableSlider = () => {
        updateCardWidth(); // Update card width for the current breakpoint
        attachSliderEvents(); // Add swiping functionality
    };

    // Handle resizing of the viewport
    window.addEventListener("resize", () => {
        updateCardWidth(); // Adjust card width on resize
        moveSlider(currentIndex); // Ensure the slider is properly aligned
    });

    // Initial setup
    enableSlider(); // Enable slider on page load
});
