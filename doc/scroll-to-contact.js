document.addEventListener('DOMContentLoaded', function () {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollToPlugin);

    // Select the trigger and target elements
    const trigger = document.getElementById('contact-scroll-trigger');
    const target = document.getElementById('contact-scroll-to');

    // Function to handle smooth scrolling for desktop
    function scrollToTargetDesktop() {
        gsap.to(window, {
            duration: 0.8, // Slower scroll duration for a premium feel
            scrollTo: {
                y: target, // Scroll to the target element
                offsetY: '5.5rem' // Account for sticky headers or spacing
            },
            ease: 'power2.out' // Smooth easing
        });
    }

    // Add click event listener to the trigger
    trigger.addEventListener('click', scrollToTargetDesktop);
});
