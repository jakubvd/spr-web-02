document.addEventListener('DOMContentLoaded', function () {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollToPlugin);

    // Select the trigger and target elements
    const trigger = document.getElementById('contact-scroll-trigger');
    const target = document.getElementById('contact-scroll-to');

    // Function to handle scrolling
    function scrollToTarget() {
        const isMobile = window.matchMedia('(max-width: 768px)').matches; // Mobile breakpoint
        const duration = isMobile ? 0.2 : 0.3; // Set duration based on viewport size

        gsap.to(window, {
            duration: duration,
            scrollTo: {
                y: target, // Scroll to the target element
                offsetY: 10 // Adjust for any sticky headers or padding
            },
            ease: 'power2.out' // Smooth easing function
        });
    }

    // Add click event listener to the trigger
    trigger.addEventListener('click', scrollToTarget);
});
