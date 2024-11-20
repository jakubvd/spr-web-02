document.addEventListener("DOMContentLoaded", () => {
    const sliderWrap = document.querySelector(".testimonial_slider_wrap");
    const cards = document.querySelectorAll(".slider_card");
    let currentIndex = 0;
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;

    const updateCardWidth = () => {
        const card = cards[0];
        return card.offsetWidth;
    };

    const moveToIndex = (index) => {
        const cardWidth = updateCardWidth();
        sliderWrap.style.transform = `translateX(${-index * cardWidth}px)`;
        sliderWrap.style.transition = "transform 0.3s ease";
        currentIndex = index;
    };

    sliderWrap.addEventListener("pointerdown", (e) => {
        isDragging = true;
        startX = e.clientX || e.touches[0].clientX;
        sliderWrap.style.transition = "none";
    });

    sliderWrap.addEventListener("pointermove", (e) => {
        if (!isDragging) return;
        const currentX = e.clientX || e.touches[0].clientX;
        const diff = currentX - startX;
        sliderWrap.style.transform = `translateX(${currentTranslate + diff}px)`;
    });

    sliderWrap.addEventListener("pointerup", (e) => {
        isDragging = false;
        const endX = e.clientX || e.changedTouches[0].clientX;
        const cardWidth = updateCardWidth();
        if (endX - startX < -cardWidth / 2 && currentIndex < cards.length - 1) {
            moveToIndex(currentIndex + 1);
        } else if (endX - startX > cardWidth / 2 && currentIndex > 0) {
            moveToIndex(currentIndex - 1);
        } else {
            moveToIndex(currentIndex);
        }
        currentTranslate = -currentIndex * cardWidth;
    });

    window.addEventListener("resize", () => {
        moveToIndex(currentIndex);
    });

    moveToIndex(0); // Initialize slider
});
