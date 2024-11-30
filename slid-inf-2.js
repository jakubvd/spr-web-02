document.addEventListener("DOMContentLoaded", function () {
    const sliderWrap = document.querySelector(".custom_slider");
    const cards = Array.from(document.querySelectorAll(".custom_card"));
    const totalCards = cards.length;
    let cardWidth = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
  
    // Clone cards for infinite looping
    function cloneCards() {
      const clonedStart = cards.slice(0, totalCards).map((card) => {
        const clone = card.cloneNode(true);
        sliderWrap.appendChild(clone);
        return clone;
      });
  
      const clonedEnd = cards.slice(-totalCards).map((card) => {
        const clone = card.cloneNode(true);
        sliderWrap.insertBefore(clone, cards[0]);
        return clone;
      });
  
      return clonedStart.concat(clonedEnd);
    }
  
    // Calculate card width dynamically
    function calculateCardWidth() {
      cardWidth = cards[0]?.offsetWidth || 0;
    }
  
    // Adjust slider position
    function adjustSliderPosition() {
      const startOffset = -totalCards * cardWidth;
      currentTranslate = startOffset;
      prevTranslate = startOffset;
      sliderWrap.style.transform = `translateX(${startOffset}px)`;
      sliderWrap.style.transition = "none"; // Prevent animation during initialization
    }
  
    // Handle swipe
    function handleSwipe(direction) {
      const maxTranslate = -(totalCards * 2) * cardWidth;
      const minTranslate = -(totalCards * cardWidth);
  
      if (direction === "left") {
        currentTranslate -= cardWidth;
      } else if (direction === "right") {
        currentTranslate += cardWidth;
      }
  
      if (currentTranslate < maxTranslate) {
        currentTranslate = minTranslate;
      } else if (currentTranslate > minTranslate) {
        currentTranslate = maxTranslate;
      }
  
      sliderWrap.style.transform = `translateX(${currentTranslate}px)`;
      sliderWrap.style.transition = "transform 0.4s ease-in-out";
    }
  
    // Initialize the slider
    function initSlider() {
      calculateCardWidth();
      cloneCards();
      adjustSliderPosition();
  
      // Event listeners for resizing
      window.addEventListener("resize", () => {
        calculateCardWidth();
        adjustSliderPosition();
      });
    }
  
    initSlider();
  });
  