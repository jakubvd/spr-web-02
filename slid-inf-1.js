document.addEventListener("DOMContentLoaded", function () {
    const sliderWrap = document.querySelector(".slider_infinite_wrap");
    const cards = Array.from(document.querySelectorAll(".slider_infinite_card"));
    const totalCards = cards.length;
    let clonedCards = []; // Array to store cloned cards
    let cardWidth = 0;
    let currentIndex = 0; // Track the current visible card
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    const swipeThreshold = 50; // Minimum swipe distance to trigger a slide

    // Clone the cards for infinite scrolling
    function cloneCards() {
        clonedCards = [];
        cards.forEach((card) => {
            const cloneBefore = card.cloneNode(true);
            const cloneAfter = card.cloneNode(true);
            cloneBefore.classList.add("clone");
            cloneAfter.classList.add("clone");
            sliderWrap.insertBefore(cloneBefore, cards[0]);
            sliderWrap.appendChild(cloneAfter);
            clonedCards.push(cloneBefore, cloneAfter);
        });
    }

    // Calculate card width dynamically
    function calculateCardWidth() {
        cardWidth = cards[0]?.offsetWidth || 0;
    }

    // Adjust slider position
    function adjustSliderPosition() {
        const startOffset = -totalCards * cardWidth;
        sliderWrap.style.transform = `translateX(${startOffset}px)`;
        sliderWrap.style.transition = "none";
        currentTranslate = startOffset;
        prevTranslate = startOffset;
    }

    // Move the slider
    function moveSlider(direction) {
        const maxTranslate = -(totalCards * 2) * cardWidth; // Account for cloned cards
        const minTranslate = -(totalCards * cardWidth);
        if (direction === "left") {
            currentTranslate -= cardWidth;
        } else if (direction === "right") {
            currentTranslate += cardWidth;
        }
        if (currentTranslate < maxTranslate) {
            currentTranslate = minTranslate;
        } else if (currentTranslate > minTranslate) {
            currentTranslate = maxTranslate;
        }

        sliderWrap.style.transform = `translateX(${currentTranslate}px)`;
        sliderWrap.style.transition = "transform 0.4s ease-in-out";
    }

    // Start drag or touch
    function handleStart(e) {
        isDragging = true;
        startX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
        sliderWrap.style.transition = "none"; // Disable transition during drag
    }

    // Handle move
    function handleMove(e) {
        if (!isDragging) return;
        const currentX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
        const diffX = currentX - startX;

        sliderWrap.style.transform = `translateX(${currentTranslate + diffX}px)`;
    }

    // End drag or touch
    function handleEnd(e) {
        if (!isDragging) return;
        isDragging = false;

        const endX = e.type.includes("mouse") ? e.clientX : e.changedTouches[0].clientX;
        const diffX = endX - startX;

        if (diffX < -swipeThreshold) {
            moveSlider("left");
        } else if (diffX > swipeThreshold) {
            moveSlider("right");
        } else {
            // Snap back to the current position
            sliderWrap.style.transform = `translateX(${currentTranslate}px)`;
            sliderWrap.style.transition = "transform 0.4s ease-in-out";
        }
    }

    // Handle resize
    function handleResize() {
        calculateCardWidth();
        adjustSliderPosition();
    }

    // Initialize the slider
    function initSlider() {
        calculateCardWidth();
        cloneCards();
        adjustSliderPosition();

        // Add event listeners
        sliderWrap.addEventListener("mousedown", handleStart);
        sliderWrap.addEventListener("mousemove", handleMove);
        sliderWrap.addEventListener("mouseup", handleEnd);
        sliderWrap.addEventListener("mouseleave", handleEnd);

        sliderWrap.addEventListener("touchstart", handleStart);
        sliderWrap.addEventListener("touchmove", handleMove);
        sliderWrap.addEventListener("touchend", handleEnd);

        window.addEventListener("resize", handleResize);
    }

    initSlider();
});
