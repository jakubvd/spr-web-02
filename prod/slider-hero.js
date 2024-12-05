document.addEventListener("DOMContentLoaded", function () {
    const sliderWrap = document.querySelector(".slider_home_wrap");
    const cards = document.querySelectorAll(".slider_home_card");
    let currentIndex = 0;
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    let isClicking = true;
    let cardWidth = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let isActive = false;
    const swipeThreshold = 10;

    function getCardWidth() {
        return cards[0] ? cards[0].offsetWidth : 0;
    }

    function getMaxIndex() {
        const viewportWidth = window.innerWidth;
        if (viewportWidth <= 991) {
            return Math.min(cards.length - 1, 2);
        }
        if (viewportWidth <= 1349) {
            return Math.min(cards.length - 1, 1);
        }
        return 0;
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function moveSlider(direction) {
        const maxIndex = getMaxIndex();
        if (direction === "left" && currentIndex < maxIndex) {
            currentIndex++;
        } else if (direction === "right" && currentIndex > 0) {
            currentIndex--;
        }
        sliderWrap.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
        sliderWrap.style.transition = "transform 0.25s ease";
        prevTranslate = -currentIndex * cardWidth;
    }

    function handleStart(e) {
        isDragging = true;
        isClicking = true;
        startX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
        startY = e.type.includes("mouse") ? e.clientY : e.touches[0].clientY;
        sliderWrap.style.transition = "none";
    }

    function handleMove(e) {
        if (!isDragging) return;
        const currentX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
        const currentY = e.type.includes("mouse") ? e.clientY : e.touches[0].clientY;
        const diffX = currentX - startX;
        const diffY = currentY - startY;

        if (Math.abs(diffX) > 5 || Math.abs(diffY) > 5) {
            isClicking = false;
        }

        if (Math.abs(diffY) > Math.abs(diffX)) {
            isDragging = false;
            return;
        }

        const maxTranslate = -(getMaxIndex() * cardWidth);
        const minTranslate = 0;
        currentTranslate = clamp(prevTranslate + diffX, maxTranslate, minTranslate);

        sliderWrap.style.transform = `translateX(${currentTranslate}px)`;
    }

    function handleEnd(e) {
        if (!isDragging) return;
        isDragging = false;

        if (isClicking) return;

        const endX = e.type.includes("mouse") ? e.clientX : e.changedTouches[0].clientX;
        const diff = endX - startX;

        if (diff < -swipeThreshold) {
            moveSlider("left");
        } else if (diff > swipeThreshold) {
            moveSlider("right");
        } else {
            sliderWrap.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
            sliderWrap.style.transition = "transform 0.25s ease";
        }
    }

    function handleResize() {
        const viewportWidth = window.innerWidth;
        cardWidth = getCardWidth();
        const maxIndex = getMaxIndex();
        currentIndex = clamp(currentIndex, 0, maxIndex);
        prevTranslate = -currentIndex * cardWidth;
        sliderWrap.style.transform = `translateX(${prevTranslate}px)`;
        sliderWrap.style.transition = "none";

        if (viewportWidth <= 1349 && !isActive) {
            activateSlider();
        } else if (viewportWidth > 1349 && isActive) {
            deactivateSlider();
        }
    }

    function activateSlider() {
        isActive = true;
        cardWidth = getCardWidth();
        sliderWrap.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
        sliderWrap.addEventListener("mousedown", handleStart);
        sliderWrap.addEventListener("mousemove", handleMove);
        sliderWrap.addEventListener("mouseup", handleEnd);
        sliderWrap.addEventListener("mouseleave", handleEnd);
        sliderWrap.addEventListener("touchstart", handleStart);
        sliderWrap.addEventListener("touchmove", handleMove);
        sliderWrap.addEventListener("touchend", handleEnd);
    }

    function deactivateSlider() {
        isActive = false;
        sliderWrap.style.transform = "translateX(0)";
        sliderWrap.style.transition = "none";
        sliderWrap.removeEventListener("mousedown", handleStart);
        sliderWrap.removeEventListener("mousemove", handleMove);
        sliderWrap.removeEventListener("mouseup", handleEnd);
        sliderWrap.removeEventListener("mouseleave", handleEnd);
        sliderWrap.removeEventListener("touchstart", handleStart);
        sliderWrap.removeEventListener("touchmove", handleMove);
        sliderWrap.removeEventListener("touchend", handleEnd);
    }

    window.addEventListener("resize", handleResize);
    handleResize();
});
