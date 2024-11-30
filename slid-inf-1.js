document.addEventListener("DOMContentLoaded", function () {
    const sliderWrap = document.querySelector(".slider_infinite_wrap");
    const cards = Array.from(document.querySelectorAll(".slider_infinite_card"));
    const totalCards = cards.length;

    let cardWidth = 0; // Dynamically calculated width of a single card
    let isAnimating = false; // Prevent multiple animations
    let visibleCards = 0; // Number of visible cards based on breakpoints
    let currentIndex = 0; // Current index of the active card

    // Helper: Set up clones for seamless looping
    function setupClones() {
        // Clone first and last few cards
        const cloneStart = cards.slice(0, visibleCards);
        const cloneEnd = cards.slice(-visibleCards);

        // Append clones to the slider
        cloneStart.forEach(card => sliderWrap.appendChild(card.cloneNode(true)));
        cloneEnd.forEach(card => sliderWrap.insertBefore(card.cloneNode(true), sliderWrap.firstChild));
    }

    // Helper: Update card width and visible cards based on viewport width
    function calculateCardDimensions() {
        if (cards[0]) {
            cardWidth = cards[0].offsetWidth;
        }

        const viewportWidth = window.innerWidth;
        if (viewportWidth <= 768) {
            visibleCards = 1; // Mobile: 1 card visible
        } else if (viewportWidth <= 991) {
            visibleCards = 2; // Tablet: 2 cards visible
        } else {
            visibleCards = 3; // Desktop: 3 cards visible
        }
    }

    // Helper: Move slider to the specified index with animation
    function moveToIndex(index, animate = true) {
        if (isAnimating) return; // Prevent multiple animations
        isAnimating = true;

        const newTranslateX = -(index * cardWidth);

        if (animate) {
            // Animate with GSAP
            gsap.to(sliderWrap, {
                x: newTranslateX,
                duration: 0.4,
                ease: "power1.out",
                onComplete: () => (isAnimating = false),
            });
        } else {
            // Jump directly
            gsap.set(sliderWrap, { x: newTranslateX });
            isAnimating = false;
        }
    }

    // Helper: Handle infinite looping logic
    function handleInfiniteLoop() {
        // If swiping beyond the last card
        if (currentIndex >= totalCards) {
            currentIndex = 0; // Reset to the first original card
            moveToIndex(currentIndex, false); // Jump without animation
        }

        // If swiping before the first card
        if (currentIndex < 0) {
            currentIndex = totalCards - 1; // Reset to the last original card
            moveToIndex(currentIndex, false); // Jump without animation
        }
    }

    // Swipe Left (next card)
    function swipeLeft() {
        currentIndex++;
        moveToIndex(currentIndex);
        setTimeout(handleInfiniteLoop, 450); // Check loop after animation
    }

    // Swipe Right (previous card)
    function swipeRight() {
        currentIndex--;
        moveToIndex(currentIndex);
        setTimeout(handleInfiniteLoop, 450); // Check loop after animation
    }

    // Touch and drag events
    let startX = 0;
    let isDragging = false;

    function handleStart(e) {
        startX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
        isDragging = true;
    }

    function handleMove(e) {
        if (!isDragging) return;

        const currentX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
        const diff = currentX - startX;

        if (diff > 50) {
            isDragging = false;
            swipeRight(); // Swipe Right
        } else if (diff < -50) {
            isDragging = false;
            swipeLeft(); // Swipe Left
        }
    }

    function handleEnd() {
        isDragging = false;
    }

    // Initialize slider
    function initSlider() {
        calculateCardDimensions();
        setupClones();

        // Set initial position
        currentIndex = visibleCards;
        moveToIndex(currentIndex, false); // Jump to the first visible card

        // Event listeners
        sliderWrap.addEventListener("mousedown", handleStart);
        sliderWrap.addEventListener("mousemove", handleMove);
        sliderWrap.addEventListener("mouseup", handleEnd);
        sliderWrap.addEventListener("mouseleave", handleEnd);

        sliderWrap.addEventListener("touchstart", handleStart);
        sliderWrap.addEventListener("touchmove", handleMove);
        sliderWrap.addEventListener("touchend", handleEnd);

        // Adjust on resize
        window.addEventListener("resize", () => {
            calculateCardDimensions();
            moveToIndex(currentIndex, false);
        });
    }

    // Run the initialization
    initSlider();
});
