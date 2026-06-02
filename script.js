// --- DOM Elements ---
const galleryItems = document.querySelectorAll('.gallery-item');
const filterBtns = document.querySelectorAll('.filter-btn');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const closeBtn = document.getElementById('closeBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let activeItems = Array.from(galleryItems); // Tracks filtered items available for lightbox navigation
let currentIndex = 0;

// --- Category Filtering Implementation ---
filterBtns.forEach(button => {
    button.addEventListener('click', () => {
        // Toggle Active Button Class styling
        document.querySelector('.filter-btn.active').classList.remove('active');
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        // Apply display rules
        galleryItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.classList.remove('hide');
            } else {
                item.classList.add('hide');
            }
        });

        // Remap lightbox sequence list dynamically to skip filtered-out images
        activeItems = Array.from(galleryItems).filter(item => !item.classList.contains('hide'));
    });
});

// --- Lightbox Functions ---
function openLightbox(index) {
    currentIndex = index;
    const targetImgSrc = activeItems[currentIndex].querySelector('img').src;
    lightboxImg.src = targetImgSrc;
    lightbox.classList.add('active');
}

function closeLightbox() {
    lightbox.classList.remove('active');
}

function navigateLightbox(direction) {
    currentIndex += direction;
    
    // Boundary checks loop around back to start/end
    if (currentIndex >= activeItems.length) currentIndex = 0;
    if (currentIndex < 0) currentIndex = activeItems.length - 1;

    lightboxImg.src = activeItems[currentIndex].querySelector('img').src;
}

// --- Event Triggers ---

// Bind click indexes mapped dynamically through visible references
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const visibleIndex = activeItems.indexOf(item);
        if (visibleIndex !== -1) openLightbox(visibleIndex);
    });
});

closeBtn.addEventListener('click', closeLightbox);
nextBtn.addEventListener('click', () => navigateLightbox(1));
prevBtn.addEventListener('click', () => navigateLightbox(-1));

// Close if backdrop click triggers
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

// Accessible key bindings
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') navigateLightbox(1);
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
});