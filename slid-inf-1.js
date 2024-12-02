document.addEventListener("DOMContentLoaded", function () {
    const sliderWrap = document.querySelector(".slider_infinite_wrap");
    const cards = Array.from(document.querySelectorAll(".slider_infinite_card"));
    let currentIndex = 0; // Track the current visible card
    let startX = 0; // Store the start position of the swipe/drag (X-axis)
    let startY = 0; // Store the start position of the swipe/drag (Y-axis)
    let isDragging = false; // Track if the user is swiping or dragging
    let cardWidth = 0; // Store the width of one card
    let currentTranslate = 0; // Current translateX value
    let prevTranslate = 0; // Previous translateX value
    let isClicking = true; // Track if it's a click/tap
    const swipeThreshold = 50; // Minimum swipe distance to trigger a slide

    // Helper: Calculate card width dynamically
    function getCardWidth() {
        return cards[0]?.offsetWidth || 0;
    }

    // Clone cards for infinite effect
    function cloneCards() {
        const cloneBefore = cards.map(card => {
            const clone = card.cloneNode(true);
            clone.classList.add("clone");
            sliderWrap.insertBefore(clone, cards[0]);
            return clone;
        });

        const cloneAfter = cards.map(card => {
            const clone = card.cloneNode(true);
            clone.classList.add("clone");
            sliderWrap.appendChild(clone);
            return clone;
        });

        return [...cloneBefore, ...cloneAfter];
    }

    // Adjust slider position for infinite effect
    function adjustSliderPosition() {
        const initialOffset = -cards.length * cardWidth;
        currentTranslate = initialOffset;
        prevTranslate = initialOffset;
        sliderWrap.style.transform = `translateX(${initialOffset}px)`;
        sliderWrap.style.transition = "none"; // No animation on initialization
    }

    // Move the slider by the width of one card
    function moveSlider(direction) {
        const totalCards = cards.length;

        if (direction === "left") {
            currentIndex++;
        } else if (direction === "right") {
            currentIndex--;
        }

        // Adjust for infinite looping
        if (currentIndex >= totalCards) {
            currentIndex = 0;
            prevTranslate = -cardWidth * currentIndex;
            sliderWrap.style.transform = `translateX(${prevTranslate}px)`;
            sliderWrap.style.transition = "none"; // No animation for reset
            requestAnimationFrame(() => {
                sliderWrap.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
                sliderWrap.style.transition = "transform 0.25s ease";
            });
        } else if (currentIndex < 0) {
            currentIndex = totalCards - 1;
            prevTranslate = -cardWidth * currentIndex;
            sliderWrap.style.transform = `translateX(${prevTranslate}px)`;
            sliderWrap.style.transition = "none";
            requestAnimationFrame(() => {
                sliderWrap.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
                sliderWrap.style.transition = "transform 0.25s ease";
            });
        } else {
            sliderWrap.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
            sliderWrap.style.transition = "transform 0.25s ease"; // Smooth movement
        }
        prevTranslate = -currentIndex * cardWidth;
    }

    // Start drag or touch event
    function handleStart(e) {
        isDragging = true;
        isClicking = true; // Assume it's a click until proven otherwise
        startX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
        startY = e.type.includes("mouse") ? e.clientY : e.touches[0].clientY;
        sliderWrap.style.transition = "none"; // Disable smooth transition while dragging
    }

    // Move during drag or touch
    function handleMove(e) {
        if (!isDragging) return;

        const currentX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
        const currentY = e.type.includes("mouse") ? e.clientY : e.touches[0].clientY;

        const diffX = currentX - startX;
        const diffY = currentY - startY;

        // If the movement is significant, it's no longer a click
        if (Math.abs(diffX) > 5 || Math.abs(diffY) > 5) {
            isClicking = false;
        }

        // If vertical movement is greater than horizontal, cancel the swipe
        if (Math.abs(diffY) > Math.abs(diffX)) {
            isDragging = false;
            return;
        }

        currentTranslate = prevTranslate + diffX;
        sliderWrap.style.transform = `translateX(${currentTranslate}px)`;
    }

    // End drag or touch event
    function handleEnd(e) {
        if (!isDragging) return;
        isDragging = false;

        // If it's a click/tap, do nothing
        if (isClicking) return;

        const endX = e.type.includes("mouse") ? e.clientX : e.changedTouches[0].clientX;
        const diffX = endX - startX;

        if (diffX < -swipeThreshold) {
            moveSlider("left");
        } else if (diffX > swipeThreshold) {
            moveSlider("right");
        } else {
            // Snap back to the current position
            sliderWrap.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
            sliderWrap.style.transition = "transform 0.25s ease";
        }
    }

    // Initialize the slider
    function initSlider() {
        cardWidth = getCardWidth();
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

        // Handle window resize
        window.addEventListener("resize", () => {
            cardWidth = getCardWidth();
            adjustSliderPosition();
        });
    }

    initSlider();
});
