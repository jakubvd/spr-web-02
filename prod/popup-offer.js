document.addEventListener("DOMContentLoaded", function () {
    const isMobile = window.matchMedia("(max-width: 478px)").matches && 'ontouchstart' in window;
    if (!isMobile) return;
    const overlay = document.getElementById("popup-overlay");

    function openPopup(cardId) {
        const card = document.getElementById(cardId);
        if (!card) return;
        gsap.set(overlay, { display: "flex" });
        gsap.to(overlay, { opacity: 1, duration: 0.5, ease: "power2.out" });
        gsap.set(card, { display: "block" });
        gsap.fromTo(
            card,
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
        );
    }

    function closePopup() {
        gsap.to(overlay, {
            opacity: 0,
            duration: 0.25,
            ease: "power2.in",
            onComplete: () => {
                overlay.style.display = "none";
                const openCards = overlay.querySelectorAll("div[id^='popup-card-']");
                openCards.forEach((card) => (card.style.display = "none"));
            },
        });
    }

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

    overlay.addEventListener("click", function (e) {
        if (e.target === overlay) {
            closePopup();
        }
    });
});
