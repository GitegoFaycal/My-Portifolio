
// Get all navigation links and sections
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

// Function to remove active class from all links
function removeActiveClasses() {
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
}

// Function to add active class to current link
function addActiveClass(id) {
    removeActiveClasses();
    const activeLink = document.querySelector(`a[href="#${id}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Intersection Observer to detect which section is in view
const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px',
    threshold: 0
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            addActiveClass(entry.target.id);
        }
    });
}, observerOptions);

// Observe all sections
sections.forEach(section => {
    observer.observe(section);
});

// Smooth scroll on click (backup for browsers without CSS scroll-behavior)
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        targetSection.scrollIntoView({ behavior: 'smooth' });
    });
});