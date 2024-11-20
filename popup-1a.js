document.addEventListener("DOMContentLoaded", function () {
    // Detect if the screen width is 478px or below and if the device is touch-enabled
    const isMobile = window.matchMedia("(max-width: 478px)").matches && 'ontouchstart' in window;

    if (!isMobile) return; // Exit if not on mobile or breakpoint isn't met

    // Select the overlay
    const overlay = document.getElementById("popup-overlay");

    // Function to open the popup
    function openPopup(cardId) {
        const card = document.getElementById(cardId);

        if (!card) return; // Exit if the card doesn't exist

        // Show the overlay and card with fade-in animations
        gsap.set(overlay, { display: "flex" }); // Make overlay visible
        gsap.to(overlay, { opacity: 1, duration: 0.5, ease: "power2.out" }); // Fade in overlay
        gsap.set(card, { display: "block" }); // Make the specific card visible
        gsap.fromTo(
            card,
            { opacity: 0, scale: 0.75 },
            { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" }
        );
    }

    // Function to close the popup
    function closePopup() {
        // Fade out animations for overlay
        gsap.to(overlay, {
            opacity: 0,
            duration: 0.25,
            ease: "power2.in",
            onComplete: () => {
                overlay.style.display = "none"; // Hide overlay after animation
                const openCards = overlay.querySelectorAll("div[id^='popup-card-']");
                openCards.forEach((card) => (card.style.display = "none")); // Hide all cards
            },
        });
    }

    // Manual connections between triggers and cards
    document.getElementById("popup-trig-1").addEventListener("click", function () {
        openPopup("popup-card-1");
    });

    document.getElementById("popup-trig-2").addEventListener("click", function () {
        openPopup("popup-card-2");
    });

    document.getElementById("popup-trig-3").addEventListener("click", function () {
        openPopup("popup-card-3");
    });

    document.getElementById("popup-trig-4").addEventListener("click", function () {
        openPopup("popup-card-4");
    });

    document.getElementById("popup-trig-5").addEventListener("click", function () {
        openPopup("popup-card-5");
    });

    document.getElementById("popup-trig-6").addEventListener("click", function () {
        openPopup("popup-card-6");
    });

    document.getElementById("popup-trig-7").addEventListener("click", function () {
        openPopup("popup-card-7");
    });

    document.getElementById("popup-trig-8").addEventListener("click", function () {
        openPopup("popup-card-8");
    });

    document.getElementById("popup-trig-9").addEventListener("click", function () {
        openPopup("popup-card-9");
    });

    // Add click event listener to the overlay to close popup
    overlay.addEventListener("click", function (e) {
        if (e.target === overlay) {
            // Close popup only if the click is outside the card
            closePopup();
        }
    });
});
