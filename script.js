const track = document.querySelector(".carousel-track");
const slides = Array.from(track.children);
const prevButton = document.querySelector(".carousel-button--left");
const nextButton = document.querySelector(".carousel-button--right");
const carouselContainer = document.querySelector(".carousel");
const heading = document.querySelector("h1.heading");

let currentIndex = 1; // Start at the first 'real' slide (after the prepended duplicate)
let isDragging = false;
let startPos = 0;
let slideWidth = slides[0].getBoundingClientRect().width;
let isTransitioning = false; // Prevent multiple transitions at once

// Set initial position based on currentIndex
track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;

// Function to update the heading color based on current slide image
function updateHeadingColor() {
  const currentSlide = slides[currentIndex];
  const img = currentSlide.querySelector("img");
  if (img) {
    // Assumes alt text format: "Color Slide"
    const color = img.alt.split(" ")[0].toLowerCase();
    heading.style.color = color;
  }
}

// Function to move to a specific slide
function moveToSlide(index) {
  if (isTransitioning) return; // Prevent new transition if one is in progress
  isTransitioning = true;
  track.style.transition = "transform 0.5s ease-in-out";
  track.style.transform = `translateX(-${slideWidth * index}px)`;
  currentIndex = index;
  lazyLoadImage(slides[currentIndex]);
}

// Handle infinite scroll transition end
track.addEventListener("transitionend", () => {
  if (slides[currentIndex].id === "last-clone") {
    currentIndex = slides.length - 2;
    track.style.transition = "none";
    track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
  }
  if (slides[currentIndex].id === "first-clone") {
    currentIndex = 1;
    track.style.transition = "none";
    track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
  }
  lazyLoadImage(slides[currentIndex]);
  updateHeadingColor(); // Update heading color when transition completes
  isTransitioning = false; // Unlock transitions
});

// Navigation Buttons
nextButton.addEventListener("click", () => {
  moveToSlide(currentIndex + 1);
});
prevButton.addEventListener("click", () => {
  moveToSlide(currentIndex - 1);
});

// Keyboard Navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    moveToSlide(currentIndex + 1);
  } else if (e.key === "ArrowLeft") {
    moveToSlide(currentIndex - 1);
  }
});

// Swipe Gesture Handling (for mobile users)
track.addEventListener("touchstart", (e) => {
  startPos = e.touches[0].clientX;
  isDragging = true;
});

track.addEventListener("touchmove", (e) => {
  if (!isDragging) return;
  const currentPos = e.touches[0].clientX;
  // Optionally, you can add a visual drag effect here
});

track.addEventListener("touchend", (e) => {
  isDragging = false;
  const endPos = e.changedTouches[0].clientX;
  const diff = startPos - endPos;
  if (Math.abs(diff) > 50) {
    // threshold for swipe
    if (diff > 0) {
      moveToSlide(currentIndex + 1);
    } else {
      moveToSlide(currentIndex - 1);
    }
  }
});

// Lazy Load Images
function lazyLoadImage(slide) {
  const img = slide.querySelector("img.lazy");
  if (img && !img.src) {
    img.src = img.getAttribute("data-src");
  }
}

// Initial lazy loading for the first few slides
lazyLoadImage(slides[currentIndex]);
if (slides[currentIndex - 1]) lazyLoadImage(slides[currentIndex - 1]);
if (slides[currentIndex + 1]) lazyLoadImage(slides[currentIndex + 1]);

// Set initial heading color
updateHeadingColor();

// Auto-Play Functionality
let autoPlayInterval = setInterval(() => {
  moveToSlide(currentIndex + 1);
}, 5000); // Change slide every 5 seconds

// Pause auto-play when mouse enters the carousel
carouselContainer.addEventListener("mouseenter", () => {
  clearInterval(autoPlayInterval);
});

// Resume auto-play when mouse leaves the carousel
carouselContainer.addEventListener("mouseleave", () => {
  autoPlayInterval = setInterval(() => {
    moveToSlide(currentIndex + 1);
  }, 5000);
});

// Handle Resize to Adjust Slide Width
window.addEventListener("resize", () => {
  slideWidth = slides[0].getBoundingClientRect().width;
  track.style.transition = "none"; // Prevent animation during resize
  track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
});
