document.addEventListener("DOMContentLoaded", () => {
    const sliderWrap = document.querySelector(".testimonial_slider_wrap");
    const cards = document.querySelectorAll(".slider_card");
    const totalCards = cards.length;
    let currentIndex = 0; // Track the current card
    let startX = 0; // Track the start position of the drag
    let isDragging = false;

    // Helper: Get the card width dynamically
    const getCardWidth = () => cards[0]?.offsetWidth || 0;

    // Helper: Move the slider to the correct position
    const moveSlider = (index) => {
        const cardWidth = getCardWidth();
        sliderWrap.style.transform = `translateX(${-index * cardWidth}px)`;
        sliderWrap.style.transition = "transform 0.3s ease";
        currentIndex = index; // Update the current index
    };

    // Enable slider only for breakpoints <= 1304px
    const isBreakpointActive = () => window.innerWidth <= 1304;

    // Start dragging
    const startDrag = (clientX) => {
        if (!isBreakpointActive()) return; // Do nothing if above breakpoint
        isDragging = true;
        startX = clientX;
        sliderWrap.style.transition = "none"; // Disable smooth transition while dragging
    };

    // Handle dragging
    const dragMove = (clientX) => {
        if (!isDragging) return;
        const diff = clientX - startX;

        // Visual feedback during drag
        sliderWrap.style.transform = `translateX(calc(${-currentIndex * 100}% + ${diff}px))`;
    };

    // End dragging
    const endDrag = (clientX) => {
        if (!isDragging || !isBreakpointActive()) return;
        isDragging = false;

        const diff = clientX - startX;
        const cardWidth = getCardWidth();

        // Determine swipe direction and move slider
        if (diff < -cardWidth / 4 && currentIndex < totalCards - 1) {
            // Swipe left
            moveSlider(currentIndex + 1);
        } else if (diff > cardWidth / 4 && currentIndex > 0) {
            // Swipe right
            moveSlider(currentIndex - 1);
        } else {
            // Snap back to current position
            moveSlider(currentIndex);
        }
    };

    // Add event listeners
    sliderWrap.addEventListener("pointerdown", (e) => startDrag(e.clientX));
    sliderWrap.addEventListener("pointermove", (e) => dragMove(e.clientX));
    sliderWrap.addEventListener("pointerup", (e) => endDrag(e.clientX));
    sliderWrap.addEventListener("pointerleave", (e) => endDrag(e.clientX));

    sliderWrap.addEventListener("touchstart", (e) => startDrag(e.touches[0].clientX));
    sliderWrap.addEventListener("touchmove", (e) => dragMove(e.touches[0].clientX));
    sliderWrap.addEventListener("touchend", (e) => endDrag(e.changedTouches[0].clientX));

    // Adjust slider position on window resize
    window.addEventListener("resize", () => {
        if (!isBreakpointActive()) {
            // Reset slider for larger screens
            sliderWrap.style.transform = "translateX(0)";
            sliderWrap.style.transition = "none";
            currentIndex = 0;
        } else {
            // Recalculate position
            moveSlider(currentIndex);
        }
    });

    // Initialize the slider at the first card
    moveSlider(0);
});
