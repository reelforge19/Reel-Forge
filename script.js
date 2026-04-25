// Initialize Lucide Icons
lucide.createIcons();

// Initialize AOS (Animate on Scroll)
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false
});

// Data
const dummyReels = [
    {
        id: 1,
        title: 'Cinematic Baby Story',
        category: 'Baby Shoots',
        thumbnail: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop',
        video: 'media/videos/babyshoot.MOV'
    },
    {
        id: 2,
        title: 'Raj Utsav Highlights',
        category: 'Events',
        thumbnail: '',
        video: 'media/videos/event1.MOV'
    },
    {
        id: 3,
        title: 'Raj Utsav Glimpse',
        category: 'Events',
        thumbnail: '',
        video: 'media/videos/event2.MOV'
    },
    {
        id: 4,
        title: 'Product',
        category: 'Product Shoots',
        thumbnail: '',
        video: 'media/videos/product.MOV'
    },
    {
        id: 5,
        title: 'Brand Storytelling',
        category: 'Brand Storytelling',
        thumbnail: '',
        video: 'media/videos/Storytelling product.MOV'
    },
    {
        id: 6,
        title: 'Masterclass Highlights',
        category: 'Professional Shoots',
        thumbnail: '',
        video: 'media/videos/educational.MOV'
    },
    {
        id: 7,
        title: 'Professional Workflow',
        category: 'Professional Shoots',
        thumbnail: '',
        video: 'media/videos/educational2.MOV'
    },
    {
        id: 8,
        title: 'Vibrant Birthday Celebration',
        category: 'Birthdays',
        thumbnail: '',
        video: 'media/videos/birthday.MOV'
    },
    {
        id: 9,
        title: 'Behind The Scenes: Reelforge',
        category: 'BTS',
        thumbnail: '',
        video: 'media/videos/BTS.MOV'
    },
];

const categories = ['All', 'Baby Shoots', 'Weddings', 'Events', 'Brand Storytelling', 'Product Shoots', 'Professional Shoots', 'Birthdays', 'BTS'];

const services = [
    {
        id: 1,
        title: 'Cinematic Wedding Films',
        icon: 'heart',
        description: 'Capturing the love and raw emotion of your special day with a cinematic eye. We tell your love story in high-definition brilliance.',
    },
    {
        id: 2,
        title: 'Concerts & Live Energy',
        icon: 'music',
        description: 'Preserving the electricity of live performances. Multi-angle captures that bring the audience back to the front row.',
    },
    {
        id: 3,
        title: 'Professional Shoots',
        icon: 'camera',
        description: 'High-end portrait, fashion, and lifestyle shoots. We craft the lighting and composition to make you stand out.',
    },
    {
        id: 4,
        title: 'Event Highlights',
        icon: 'zap',
        description: 'From birthdays to corporate galas, we capture the best moments and deliver high-energy highlights that pop.',
    },
    {
        id: 5,
        title: 'Brand Storytelling',
        icon: 'briefcase',
        description: 'Strategic visual narratives designed to define your brand identity and forge a deep connection with your target audience.',
    },
    {
        id: 6,
        title: 'Product Shoots',
        icon: 'package',
        description: 'High-energy cinematic showcases that bring your products to life with aggressive hooks and high-retention pacing.',
    },
    {
        id: 7,
        title: 'Portfolio & BTS',
        icon: 'film',
        description: 'Showcasing the process and the personality. Perfect for models, artists, and organizers looking for raw, authentic content.',
    },
    {
        id: 8,
        title: 'Cinematic Editing',
        icon: 'scissors',
        description: 'Already have footage? We provide premium color grading, sound design, and pacing to give your content a movie-like feel.',
    }
];

// Elements
const header = document.getElementById('header');
const mobileToggle = document.getElementById('mobile-toggle');
const navMenu = document.getElementById('nav-menu');
const portfolioGrid = document.getElementById('portfolio-grid');
const categoryFilters = document.getElementById('category-filters');
const servicesGrid = document.getElementById('services-grid');
const videoModal = document.getElementById('video-modal');
const closeModal = document.getElementById('close-modal');
const modalVideo = document.getElementById('modal-video');
const contactForm = document.getElementById('contact-form');
const statusMsg = document.getElementById('status-message');
const currentYearSpan = document.getElementById('current-year');
const backToTopBtn = document.getElementById('back-to-top');

// Set Current Year
if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();

// Sticky Header & Back to Top
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    if (window.scrollY > 500) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Mobile Menu
mobileToggle.addEventListener('click', () => {
    mobileToggle.querySelector('.hamburger').classList.toggle('active');
    navMenu.classList.toggle('open');
});

navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileToggle.querySelector('.hamburger').classList.remove('active');
        navMenu.classList.remove('open');
    });
});

// Lazy Loading Setup
let currentPage = 1;
let currentFilter = 'All';
let isLoading = false;
let hasMoreReels = true;

// Intersection Observer for lazy loading videos
const observerOptions = {
    root: null,
    rootMargin: '100px',
    threshold: 0.1
};

const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const video = entry.target;
            if (!video.src) {
                video.src = video.dataset.src;
                video.load();
                videoObserver.unobserve(video);
            }
        }
    });
}, observerOptions);

// Portfolio Rendering with Pagination & Lazy Loading
function renderPortfolio(filter = 'All', page = 1, append = false) {
    if (isLoading) return;
    isLoading = true;

    if (!append) {
        portfolioGrid.innerHTML = '';
        currentPage = 1;
        currentFilter = filter;
        hasMoreReels = true;
    }

    const filteredItems = filter === 'All' 
        ? dummyReels.filter(item => item.id !== 3) 
        : dummyReels.filter(item => item.category === filter);

    // Pagination - load 6 items at a time
    const pageSize = 6;
    const startIdx = (page - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    const itemsToRender = filteredItems.slice(startIdx, endIdx);

    if (itemsToRender.length < pageSize) {
        hasMoreReels = false;
    }

    itemsToRender.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'reel-card';
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', (index % 3) * 100);

        card.innerHTML = `
            <video class="reel-video-preview" muted loop playsinline data-src="${item.video}">
                <source type="video/mp4">
                <source type="video/quicktime">
            </video>
            <div class="reel-overlay">
                <div class="play-btn">
                    <i data-lucide="maximize-2"></i>
                </div>
                <div class="reel-info">
                    <span class="reel-category">${item.category}</span>
                    <h3 class="reel-title">${item.title}</h3>
                </div>
            </div>
        `;

        const video = card.querySelector('video');
        videoObserver.observe(video);

        card.addEventListener('click', () => openVideoModal(item));
        portfolioGrid.appendChild(card);
    });

    // Create icons for new elements
    lucide.createIcons();
    
    // Update AOS for new elements
    AOS.refresh();
    
    isLoading = false;
    currentPage++;
}

// Infinite Scroll Implementation
window.addEventListener('scroll', () => {
    if (!isLoading && hasMoreReels) {
        const scrollPercentage = (window.innerHeight + window.scrollY) / document.documentElement.scrollHeight;
        
        if (scrollPercentage > 0.8) { // Load more when 80% scrolled down
            renderPortfolio(currentFilter, currentPage, true);
        }
    }
});

function renderFilters() {
    categoryFilters.innerHTML = '';
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `filter-btn ${cat === 'All' ? 'active' : ''}`;
        btn.textContent = cat;
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderPortfolio(cat, 1, false); // Reset pagination when filter changes
        });
        categoryFilters.appendChild(btn);
    });
}

// Services Rendering
function renderServices() {
    servicesGrid.innerHTML = '';
    services.forEach((service, index) => {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', index * 100);

        card.innerHTML = `
            <div class="service-icon-wrapper">
                <i data-lucide="${service.icon}" size="32"></i>
            </div>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
            <div class="service-hover-effect"></div>
        `;
        servicesGrid.appendChild(card);
    });
    lucide.createIcons();
}

// Video Modal
function openVideoModal(item) {
    modalVideo.src = item.video;
    modalVideo.poster = item.thumbnail;
    videoModal.classList.add('active');
    modalVideo.play();

    document.body.style.overflow = 'hidden'; // Prevent scroll
}

function closeVideoModalFunc() {
    videoModal.classList.remove('active');
    modalVideo.pause();
    modalVideo.src = '';
    document.body.style.overflow = 'auto';
}

closeModal.addEventListener('click', closeVideoModalFunc);
videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) closeVideoModalFunc();
});

// Form Submission
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    statusMsg.textContent = 'Sending message...';
    statusMsg.className = 'status-message loading';

    const submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = 'Sending...';

    try {
        // Same backend as the React app
        // Detect if running locally (localhost, 127.0.0.1, or opening file directly)
        const isLocal = window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1' ||
            window.location.hostname === '' ||
            window.location.protocol === 'file:';

        const apiUrl = isLocal ? 'http://localhost:5000' : 'https://reel-forge-backend.vercel.app';
        // Actually, let's use a placeholder or the one from the React app if I can find it.
        // In the React app it was: const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

        const response = await fetch(`${apiUrl}/api/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            statusMsg.textContent = 'Message sent successfully! We will get back to you soon.';
            statusMsg.className = 'status-message success';
            contactForm.reset();
        } else {
            statusMsg.textContent = 'Failed to send message. Please try again later.';
            statusMsg.className = 'status-message error';
        }
    } catch (error) {
        statusMsg.textContent = 'Something went wrong. Is your backend running?';
        statusMsg.className = 'status-message error';
    } finally {
        submitBtn.disabled = false;
        submitBtn.querySelector('span').textContent = 'Send Message';
    }
});

// Init
renderFilters();
renderPortfolio();
renderServices();

// Background Orb Mouse Tracking
const orbs = document.querySelectorAll('.bg-orb');
document.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    orbs.forEach((orb, index) => {
        const factor = (index + 1) * 0.015;
        const x = (clientX - centerX) * factor;
        const y = (clientY - centerY) * factor;
        orb.style.transform = `translate(${x}px, ${y}px)`;
    });
});
