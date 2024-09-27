const track = document.querySelector('.carousel-track');
const slides = Array.from(track.children);
const paginationContainer = document.querySelector('.carousel-pagination');
const slideWidth = slides[0].getBoundingClientRect().width;
let currentIndex = 0;
let isSwiping = false; // To track whether the user is swiping horizontally
let startX, moveX;

// Dynamically create pagination dots based on number of slides
const createPaginationDots = () => {
  slides.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active'); // Activate the first dot initially
    paginationContainer.appendChild(dot);

    // Add event listener to each dot for navigation
    dot.addEventListener('click', () => {
      moveToSlide(index);
    });
  });
};

// Arrange the slides next to one another
const setSlidePosition = (slide, index) => {
  slide.style.left = slideWidth * index + 'px';
};
slides.forEach(setSlidePosition);

// Move to the specific slide by index
const moveToSlide = (index) => {
  const targetSlide = slides[index];
  const amountToMove = targetSlide.style.left;

  track.style.transition = 'transform 0.5s ease-in-out';
  track.style.transform = 'translateX(-' + amountToMove + ')';

  // Update current slide class
  updatePagination(index);
  currentIndex = index;
};

// Update pagination dots
const updatePagination = (index) => {
  const allDots = document.querySelectorAll('.dot');
  allDots.forEach(dot => dot.classList.remove('active'));
  allDots[index].classList.add('active');
};

// Enable swiping functionality for touch devices
const handleSwipe = () => {

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isSwiping = true;
    // Prevent default touch behavior when swiping
    e.preventDefault();
  });

  track.addEventListener('touchmove', (e) => {
    if (!isSwiping) return;
    moveX = e.touches[0].clientX;
    // Prevent vertical scrolling when swiping horizontally
    if (Math.abs(startX - moveX) > 20) {
      e.preventDefault();
    }
  });

  track.addEventListener('touchend', () => {
    if (!isSwiping) return;
    const distanceMoved = startX - moveX;

    // Swipe left
    if (distanceMoved > 50 && currentIndex < slides.length - 1) {
      moveToSlide(currentIndex + 1);
    }
    // Swipe right
    else if (distanceMoved < -50 && currentIndex > 0) {
      moveToSlide(currentIndex - 1);
    }
    // Loop to the first slide
    else if (distanceMoved > 50 && currentIndex === slides.length - 1) {
      moveToSlide(0);
    }
    // Loop to the last slide
    else if (distanceMoved < -50 && currentIndex === 0) {
      moveToSlide(slides.length - 1);
    }
    isSwiping = false;
  });
};

// Initialize the carousel
createPaginationDots();
handleSwipe();
