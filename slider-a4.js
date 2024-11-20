document.addEventListener("DOMContentLoaded", function () {
    // Base Slider Logic
    function initializeSlider(wrapperClass, cardClass, options = {}) {
        const sliderWrap = document.querySelector(`.${wrapperClass}`);
        const cards = document.querySelectorAll(`.${cardClass}`);
        if (!sliderWrap || cards.length === 0) return;

        let currentIndex = 0; // Track the current visible card
        let startX = 0; // Store the start position of the swipe
        let isDragging = false; // Track if the user is swiping

        const cardWidth = cards[0].offsetWidth; // Get the width of one card
        const totalCards = cards.length;

        // Clone first and last cards for infinite loop
        if (options.loop) {
            const firstCardClone = cards[0].cloneNode(true);
            const lastCardClone = cards[totalCards - 1].cloneNode(true);
            sliderWrap.appendChild(firstCardClone);
            sliderWrap.insertBefore(lastCardClone, cards[0]);
        }

        // Move the slider
        function moveSlider(direction) {
            const maxIndex = options.loop ? totalCards : totalCards - 1;

            if (direction === "left") {
                currentIndex++;
                if (currentIndex > maxIndex) {
                    currentIndex = 1; // Reset to the first real card
                    gsap.set(sliderWrap, { x: 0 }); // Jump to start without animation
                }
            } else if (direction === "right") {
                currentIndex--;
                if (currentIndex < 0) {
                    currentIndex = totalCards - 1; // Reset to the last real card
                    gsap.set(sliderWrap, { x: -totalCards * cardWidth }); // Jump to end without animation
                }
            }

            // Animate slider to the new position with premium easing
            gsap.to(sliderWrap, {
                x: -currentIndex * cardWidth,
                duration: 0.7, // Premium feel with longer duration
                ease: "power3.out", // Luxurious smooth easing
            });
        }

        // Start touch event
        function handleTouchStart(e) {
            isDragging = true;
            startX = e.touches[0].clientX; // Record the starting X position
        }

        // End touch event
        function handleTouchEnd(e) {
            if (!isDragging) return;
            isDragging = false;

            const endX = e.changedTouches[0].clientX; // Get the end X position
            const diff = endX - startX; // Calculate the swipe difference

            if (diff < -50) {
                // Swipe left
                moveSlider("left");
            } else if (diff > 50) {
                // Swipe right
                moveSlider("right");
            }
        }

        // Add touch event listeners to the slider wrapper
        sliderWrap.addEventListener("touchstart", handleTouchStart);
        sliderWrap.addEventListener("touchend", handleTouchEnd);

        // Recalculate on window resize
        window.addEventListener("resize", function () {
            gsap.set(sliderWrap, { x: -currentIndex * cardWidth });
        });
    }

    // Initialize Slider 1
    initializeSlider("testimonial_slider_wrap", "testimonial_card", {
        loop: false, // No infinite loop for the first slider
    });

    // Initialize Slider 2 (infinite loop)
    initializeSlider("testimonial_slider_wrap-2", "testimonial_card", {
        loop: true, // Enable infinite loop for the second slider
    });
});
