document.addEventListener("DOMContentLoaded", () => {
    const sliderWrap = document.querySelector(".testimonial_slider_wrap");
    const cards = document.querySelectorAll(".slider_card");
    const totalCards = cards.length;
    let currentIndex = 0;
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

    // Calculate card width based on current breakpoint
    const getCardWidth = () => cards[0]?.offsetWidth || 0;

    // Move slider wrapper to a specific card
    const moveToIndex = (index) => {
        const cardWidth = getCardWidth();
        if (index < 0) {
            currentIndex = 0; // Prevent swiping left past the first card
        } else if (index >= totalCards) {
            currentIndex = totalCards - 1; // Prevent swiping right past the last card
        } else {
            currentIndex = index;
        }
        sliderWrap.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
        sliderWrap.style.transition = "transform 0.3s ease";
        prevTranslate = -currentIndex * cardWidth;
    };

    // Handle pointer down (dragging starts)
    sliderWrap.addEventListener("pointerdown", (e) => {
        isDragging = true;
        startX = e.clientX;
        sliderWrap.style.transition = "none"; // Disable smooth transition during drag
    });

    // Handle pointer move (dragging in progress)
    sliderWrap.addEventListener("pointermove", (e) => {
        if (!isDragging) return;
        const currentX = e.clientX;
        const diff = currentX - startX;
        sliderWrap.style.transform = `translateX(${prevTranslate + diff}px)`;
    });

    // Handle pointer up (dragging ends)
    sliderWrap.addEventListener("pointerup", (e) => {
        if (!isDragging) return;
        isDragging = false;
        const endX = e.clientX;
        const diff = endX - startX;
        const cardWidth = getCardWidth();

        if (diff < -cardWidth / 4 && currentIndex < totalCards - 1) {
            moveToIndex(currentIndex + 1); // Swipe to the next card
        } else if (diff > cardWidth / 4 && currentIndex > 0) {
            moveToIndex(currentIndex - 1); // Swipe to the previous card
        } else {
            moveToIndex(currentIndex); // Stay on the current card
        }
    });

    // Handle window resize to recalculate positions
    window.addEventListener("resize", () => {
        moveToIndex(currentIndex);
    });

    // Initialize slider at the first card
    moveToIndex(0);
});
