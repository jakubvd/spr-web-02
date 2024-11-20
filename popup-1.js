document.addEventListener("DOMContentLoaded", function () {
    // Detect if the screen width is 478px or below and if the device is touch-enabled
    const isMobile = window.matchMedia("(max-width: 478px)").matches && 'ontouchstart' in window;

    if (!isMobile) return; // Exit if not on mobile or breakpoint isn't met

    // Select all triggers and the overlay
    const triggers = document.querySelectorAll("[id^='popup-trig-']");
    const overlay = document.getElementById("popup-overlay");

    // Initialize GSAP timeline for animations
    gsap.registerPlugin();

    let currentPopup = null; // To track the currently open popup card

    // Function to open the popup
    function openPopup(triggerId) {
        const cardId = triggerId.replace("popup-trig-", "popup-card-"); // Map trigger to card
        const card = document.getElementById(cardId);

        if (!card) return; // Exit if the card doesn't exist

        // Show the overlay and the card with fade-in animations
        gsap.set(overlay, { display: "flex" }); // Ensure overlay is visible
        gsap.to(overlay, { opacity: 1, duration: 0.5, ease: "power2.out" }); // Fade in overlay
        gsap.fromTo(
            card,
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
        );

        currentPopup = card; // Store the current popup
    }

    // Function to close the popup
    function closePopup() {
        if (!currentPopup) return; // Exit if no popup is open

        // Fade out animations for card and overlay
        gsap.to(currentPopup, {
            opacity: 0,
            scale: 0.8,
            duration: 0.5,
            ease: "power2.in",
            onComplete: () => {
                currentPopup.style.display = "none"; // Hide card after animation
                currentPopup = null; // Reset current popup
            },
        });

        gsap.to(overlay, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.in",
            onComplete: () => {
                overlay.style.display = "none"; // Hide overlay after animation
            },
        });
    }

    // Add click event listeners to triggers
    triggers.forEach((trigger) => {
        trigger.addEventListener("click", function () {
            const triggerId = this.id; // Get the ID of the clicked trigger
            openPopup(triggerId);
        });
    });

    // Add click event listener to the overlay to close popup
    overlay.addEventListener("click", function (e) {
        if (e.target === overlay) {
            // Close popup only if the click is outside the card
            closePopup();
        }
    });
});
