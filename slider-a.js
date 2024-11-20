document.addEventListener("DOMContentLoaded", () => {
    const sliderWrap = document.querySelector(".testimonial_slider_wrap");
    const cards = document.querySelectorAll(".slider_card");
    const totalCards = cards.length;
    let currentIndex = 0;
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

    // Helper: Calculate card width dynamically
    const getCardWidth = () => cards[0]?.offsetWidth || 0;

    // Helper: Move slider to the target card
    const moveToIndex = (index) => {
        const cardWidth = getCardWidth();

        if (index < 0) {
            currentIndex = 0; // Prevent overscrolling to the left (first card)
        } else if (index >= totalCards) {
            currentIndex = totalCards - 1; // Allow swiping to the right edge only
        } else {
            currentIndex = index;
        }

        sliderWrap.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
        sliderWrap.style.transition = "transform 0.3s ease";
        prevTranslate = -currentIndex * cardWidth;
    };

    // Handle drag start (for both touch and pointer)
    const startDrag = (clientX) => {
        isDragging = true;
        startX = clientX;
        sliderWrap.style.transition = "none"; // Disable smooth transition while dragging
    };

    // Handle dragging (for both touch and pointer)
    const dragMove = (clientX) => {
        if (!isDragging) return;

        const diff = clientX - startX;
        const potentialTranslate = prevTranslate + diff;

        // Allow movement, but clamp to the left edge on the first card
        if (currentIndex === 0 && potentialTranslate > 0) {
            sliderWrap.style.transform = `translateX(0px)`; // Lock at the first card
        } else if (currentIndex === totalCards - 1 && potentialTranslate < -prevTranslate) {
            sliderWrap.style.transform = `translateX(${-prevTranslate}px)`; // Lock at the last card's position
        } else {
            sliderWrap.style.transform = `translateX(${potentialTranslate}px)`;
        }
    };

    // Handle drag end (for both touch and pointer)
    const endDrag = (clientX) => {
        if (!isDragging) return;
        isDragging = false;

        const diff = clientX - startX;
        const cardWidth = getCardWidth();

        // Logic for last card
        if (currentIndex === totalCards - 1) {
            if (diff < -cardWidth / 4) {
                moveToIndex(0); // Swipe right: loop back to the first card
            } else {
                moveToIndex(currentIndex); // Stay on the last card
            }
            return;
        }

        // Logic for other cards
        if (diff < -cardWidth / 4 && currentIndex < totalCards - 1) {
            moveToIndex(currentIndex + 1); // Swipe left: move to the next card
        } else if (diff > cardWidth / 4 && currentIndex > 0) {
            moveToIndex(currentIndex - 1); // Swipe right: move to the previous card
        } else {
            moveToIndex(currentIndex); // Snap back to the current card
        }
    };

    // Add event listeners for desktop and mobile
    sliderWrap.addEventListener("pointerdown", (e) => startDrag(e.clientX));
    sliderWrap.addEventListener("pointermove", (e) => dragMove(e.clientX));
    sliderWrap.addEventListener("pointerup", (e) => endDrag(e.clientX));
    sliderWrap.addEventListener("pointerleave", (e) => endDrag(e.clientX));

    sliderWrap.addEventListener("touchstart", (e) => startDrag(e.touches[0].clientX));
    sliderWrap.addEventListener("touchmove", (e) => dragMove(e.touches[0].clientX));
    sliderWrap.addEventListener("touchend", (e) => endDrag(e.changedTouches[0].clientX));

    // Update slider on resize
    window.addEventListener("resize", () => {
        moveToIndex(currentIndex);
    });

    // Initialize slider
    moveToIndex(0);
});
