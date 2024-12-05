document.addEventListener('DOMContentLoaded', function () {

    gsap.registerPlugin(ScrollToPlugin);

    const trigger = document.getElementById('contact-scroll-trigger');
    const target = document.getElementById('contact-scroll-to');

    function scrollToTarget() {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const isTablet = window.matchMedia('(max-width: 991px)').matches;

        let offsetY = 92;
        if (isTablet) offsetY = 72;
        if (isMobile) offsetY = 72;

        const duration = isMobile ? 1.2 : 1.0;

        gsap.to(window, {
            duration: duration,
            scrollTo: {
                y: target,
                offsetY: offsetY
            },
            ease: 'power1.out'
        });
    }

    trigger.addEventListener('click', scrollToTarget);
});