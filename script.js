// UniversityMatch Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();
});

function initializeApp() {
    // Set up event listeners
    setupSearchFunctionality();
    setupNavigation();
    setupLanguageSelector();
    setupCharacterInteraction();
    setupBottomNavigation();
    setupScrollEffects();
}

// Search functionality
function setupSearchFunctionality() {
    const searchInput = document.querySelector('.search-container input');
    const searchIcon = document.querySelector('.search-container i');
    
    if (searchInput) {
        searchInput.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.transition = 'transform 0.3s ease';
        });
        
        searchInput.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
        
        searchInput.addEventListener('input', function() {
            if (this.value.length > 0) {
                searchIcon.style.color = '#60a5fa';
            } else {
                searchIcon.style.color = '#94a3b8';
            }
        });
        
        // Handle search submission
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(this.value);
            }
        });
    }
    
    // CTA Button functionality
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            showSignUpModal();
        });
    }
}

// Navigation functionality
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            } else {
                // Handle external links or different pages
                handleNavigation(href);
            }
        });
    });
}

// Language selector functionality
function setupLanguageSelector() {
    const languageSpans = document.querySelectorAll('.language-selector span');
    
    languageSpans.forEach(span => {
        if (!span.textContent.includes('/')) {
            span.addEventListener('click', function() {
                // Remove active class from all language options
                languageSpans.forEach(s => s.classList.remove('active'));
                
                // Add active class to clicked option
                this.classList.add('active');
                
                // Change language
                changeLanguage(this.textContent);
            });
        }
    });
}

// Character interaction
function setupCharacterInteraction() {
    const character = document.querySelector('.character');
    const speechBubble = document.querySelector('.speech-bubble');
    
    if (character && speechBubble) {
        character.addEventListener('click', function() {
            showCharacterMessage();
        });
        
        // Add hover effect
        character.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        character.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
}

// Bottom navigation functionality
function setupBottomNavigation() {
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
    
    navItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            navItems.forEach(navItem => navItem.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Handle navigation based on index
            handleBottomNavigation(index);
        });
    });
    
    // Set home as active by default
    if (navItems.length > 0) {
        navItems[0].classList.add('active');
    }
}

// Scroll effects
function setupScrollEffects() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        // Header background opacity based on scroll
        if (currentScrollY > 100) {
            header.style.background = 'rgba(15, 23, 42, 0.98)';
        } else {
            header.style.background = 'rgba(15, 23, 42, 0.95)';
        }
        
        // Hide/show header on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
        
        // Parallax effect for hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            hero.style.transform = `translateY(${parallax}px)`;
        }
    });
}

// University card interactions
function setupUniversityCards() {
    const universityCards = document.querySelectorAll('.university-card');
    
    universityCards.forEach(card => {
        const tourButton = card.querySelector('.tour-button');
        
        if (tourButton) {
            tourButton.addEventListener('click', function() {
                const universityName = card.querySelector('h3').textContent;
                startVirtualTour(universityName);
            });
        }
    });
}

// Scholarship stats animation
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const finalValue = parseInt(stat.textContent);
        if (!isNaN(finalValue)) {
            animateNumber(stat, 0, finalValue, 2000);
        }
    });
}

// Utility functions
function performSearch(query) {
    console.log('Searching for:', query);
    // Here you would implement actual search functionality
    showNotification(`Searching for: ${query}`);
}

function showSignUpModal() {
    showNotification('Sign up modal would open here!');
}

function changeLanguage(lang) {
    console.log('Changing language to:', lang);
    showNotification(`Language changed to ${lang}`);
}

function showCharacterMessage() {
    const messages = [
        "Hi! I'm here to help you find the perfect university!",
        "Ask me about scholarships, programs, or admission requirements!",
        "I can help you compare different universities!",
        "Need help with your application? Just ask!"
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    showNotification(randomMessage);
}

function handleNavigation(href) {
    console.log('Navigating to:', href);
    showNotification(`Navigating to ${href}`);
}

function handleBottomNavigation(index) {
    const sections = ['home', 'search', 'matches', 'profile'];
    const section = sections[index];
    
    if (section === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        showNotification(`Opening ${section} section`);
    }
}

function startVirtualTour(universityName) {
    showNotification(`Starting virtual tour for ${universityName}`);
}

function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * progress);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Initialize university cards and stats animation when page loads
document.addEventListener('DOMContentLoaded', function() {
    setupUniversityCards();
    
    // Animate stats when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    });
    
    const statsSection = document.querySelector('.top-scholarships');
    if (statsSection) {
        observer.observe(statsSection);
    }
});

// Add some CSS for smooth transitions
const style = document.createElement('style');
style.textContent = `
    .header {
        transition: transform 0.3s ease, background 0.3s ease;
    }
    
    .language-selector span.active {
        color: #60a5fa !important;
        font-weight: bold;
    }
    
    .notification {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-weight: 500;
    }
`;
document.head.appendChild(style);
