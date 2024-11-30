document.addEventListener("DOMContentLoaded", function () {
    const sliderWrap = document.querySelector(".slider_infinite_wrap");
    const cards = Array.from(document.querySelectorAll(".slider_infinite_card"));
    let currentIndex = 0; // Current visible card index
    let cardWidth = 0; // Width of one card
    let visibleCards = 4; // Default number of visible cards
    let isAnimating = false;

    // Helper: Clone cards for infinite looping
    function setupClones() {
        const cloneStart = cards.slice(0, visibleCards).map(card => card.cloneNode(true));
        const cloneEnd = cards.slice(-visibleCards).map(card => card.cloneNode(true));

        // Append clones to the slider
        cloneStart.forEach(clone => sliderWrap.appendChild(clone));
        cloneEnd.forEach(clone => sliderWrap.insertBefore(clone, sliderWrap.firstChild));
    }

    // Helper: Update card dimensions based on viewport
    function calculateCardDimensions() {
        cardWidth = cards[0]?.offsetWidth || 0;

        const viewportWidth = window.innerWidth;
        if (viewportWidth <= 768) {
            visibleCards = 1; // 1 card visible on mobile
        } else if (viewportWidth <= 991) {
            visibleCards = 2; // 2 cards visible on tablet
        } else {
            visibleCards = 4; // 4 cards visible on desktop
        }
    }

    // Helper: Move slider to a specific index
    function moveToIndex(index, animate = true) {
        if (isAnimating) return;
        isAnimating = true;

        const translateX = -(index * cardWidth);
        if (animate) {
            gsap.to(sliderWrap, {
                x: translateX,
                duration: 0.5,
                ease: "power1.out",
                onComplete: () => {
                    isAnimating = false;
                    handleInfiniteLoop();
                },
            });
        } else {
            gsap.set(sliderWrap, { x: translateX });
            isAnimating = false;
        }
    }

    // Helper: Infinite loop handling
    function handleInfiniteLoop() {
        const totalCards = cards.length;
        if (currentIndex >= totalCards) {
            currentIndex = 0; // Reset to the first original card
            moveToIndex(currentIndex, false);
        } else if (currentIndex < 0) {
            currentIndex = totalCards - 1; // Reset to the last original card
            moveToIndex(currentIndex, false);
        }
    }

    // Swipe left (next card)
    function swipeLeft() {
        currentIndex++;
        moveToIndex(currentIndex);
    }

    // Swipe right (previous card)
    function swipeRight() {
        currentIndex--;
        moveToIndex(currentIndex);
    }

    // Event listeners for drag/swipe
    let startX = 0;
    let isDragging = false;

    function handleStart(e) {
        isDragging = true;
        startX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
    }

    function handleMove(e) {
        if (!isDragging) return;

        const currentX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
        const diff = currentX - startX;

        if (diff > 50) {
            isDragging = false;
            swipeRight();
        } else if (diff < -50) {
            isDragging = false;
            swipeLeft();
        }
    }

    function handleEnd() {
        isDragging = false;
    }

    // Initialize the slider
    function initSlider() {
        calculateCardDimensions();
        setupClones();

        // Set initial position to show the first visible card
        currentIndex = visibleCards;
        moveToIndex(currentIndex, false);

        // Event listeners for swipe
        sliderWrap.addEventListener("mousedown", handleStart);
        sliderWrap.addEventListener("mousemove", handleMove);
        sliderWrap.addEventListener("mouseup", handleEnd);
        sliderWrap.addEventListener("mouseleave", handleEnd);

        sliderWrap.addEventListener("touchstart", handleStart);
        sliderWrap.addEventListener("touchmove", handleMove);
        sliderWrap.addEventListener("touchend", handleEnd);

        // Update dimensions on resize
        window.addEventListener("resize", () => {
            calculateCardDimensions();
            moveToIndex(currentIndex, false);
        });
    }

    initSlider(); // Run initialization
});
