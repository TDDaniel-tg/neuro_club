// DOM Elements
const progressBar = document.getElementById('progressBar');
const floatingCTA = document.getElementById('floatingCTA');
const header = document.querySelector('.header');
const faqItems = document.querySelectorAll('.faq-item');
const tabBtns = document.querySelectorAll('.tab-btn');
const socialProof = document.getElementById('socialProof');
const priceCountdown = document.getElementById('price-countdown');
const calculateBtn = document.getElementById('calculate-btn');
const calculatorResults = document.getElementById('calculator-results');
const hourlyRateSlider = document.getElementById('hourly-rate');
const hourlyRateValue = document.getElementById('hourly-rate-value');
const businessSphere = document.getElementById('business-sphere');
const finalCtaForm = document.getElementById('final-cta-form');

// Progress Bar
function updateProgressBar() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    const progress = (scrolled / documentHeight) * 100;
    progressBar.style.width = `${progress}%`;
}

// Floating CTA Button
function toggleFloatingCTA() {
    const scrolled = window.scrollY;
    if (scrolled > 800) {
        floatingCTA.classList.add('visible');
    } else {
        floatingCTA.classList.remove('visible');
    }
}

// Header Scroll Effect
function handleHeaderScroll() {
    const scrolled = window.scrollY;
    if (scrolled > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Smooth Scroll for Anchor Links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// FAQ Accordion
function initFAQ() {
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Tabs Navigation
function initTabs() {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            
            // Remove active class from all buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('active');
            });
            
            // Add active class to clicked button and corresponding pane
            btn.classList.add('active');
            const targetPane = document.querySelector(`[data-content="${tabId}"]`);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
}

// Calculator Functionality
function initCalculator() {
    // Update hourly rate display
    hourlyRateSlider.addEventListener('input', (e) => {
        hourlyRateValue.textContent = e.target.value;
    });
    
    // Calculate button click
    calculateBtn.addEventListener('click', () => {
        calculateSavings();
    });
}

function calculateSavings() {
    const hourlyRate = parseInt(hourlyRateSlider.value);
    const selectedTasks = document.querySelectorAll('.checkbox input:checked');
    
    if (selectedTasks.length === 0 || !businessSphere.value) {
        alert('Пожалуйста, выберите сферу деятельности и хотя бы одну задачу');
        return;
    }
    
    // Calculate total hours saved per day
    let totalHoursSaved = 0;
    selectedTasks.forEach(task => {
        const hours = parseFloat(task.dataset.hours);
        totalHoursSaved += hours * 0.7; // AI saves 70% of time
    });
    
    // Calculate monthly savings
    const workDaysPerMonth = 22;
    const monthlyHoursSaved = totalHoursSaved * workDaysPerMonth;
    const monthlyMoneySaved = monthlyHoursSaved * hourlyRate;
    const daysSaved = Math.floor(monthlyHoursSaved / 8);
    const dailySavings = Math.floor(monthlyMoneySaved / 30);
    const roiDays = Math.ceil(990 / dailySavings);
    
    // Update results
    document.getElementById('time-saved').textContent = Math.floor(monthlyHoursSaved);
    document.getElementById('days-saved').textContent = daysSaved;
    document.getElementById('money-saved').textContent = formatNumber(Math.floor(monthlyMoneySaved));
    document.getElementById('roi-days').textContent = roiDays;
    document.getElementById('daily-savings').textContent = formatNumber(dailySavings);
    
    // Show results with animation
    calculatorResults.classList.add('visible');
    
    // Scroll to results
    setTimeout(() => {
        calculatorResults.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
}

// Format numbers with spaces
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

// Countdown Timer
function initCountdown() {
    // Set target date (2 days from now)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 2);
    targetDate.setHours(14, 23, 45);
    
    function updateCountdown() {
        const now = new Date();
        const difference = targetDate - now;
        
        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            
            const countdownText = `${days} ${getDayWord(days)} ${hours}:${padZero(minutes)}:${padZero(seconds)}`;
            priceCountdown.textContent = countdownText;
        } else {
            priceCountdown.textContent = 'Время истекло!';
        }
    }
    
    function getDayWord(days) {
        if (days === 1) return 'день';
        if (days >= 2 && days <= 4) return 'дня';
        return 'дней';
    }
    
    function padZero(num) {
        return num < 10 ? '0' + num : num;
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Social Proof Notifications
function initSocialProof() {
    const names = [
        { name: 'Анна из Москвы', action: 'только что присоединилась к НейроКлубу' },
        { name: 'Сергей из Санкт-Петербурга', action: 'начал изучать маркетинг с ИИ' },
        { name: 'Елена из Казани', action: 'увеличила доход на 150% за месяц' },
        { name: 'Михаил из Екатеринбурга', action: 'автоматизировал продажи с ChatGPT' },
        { name: 'Ольга из Новосибирска', action: 'создала 50 дизайнов за день' }
    ];
    
    let currentIndex = 0;
    
    function showNotification() {
        const notification = names[currentIndex];
        const textElement = socialProof.querySelector('.social-proof__text');
        
        textElement.innerHTML = `
            <strong>${notification.name}</strong>
            <span>${notification.action}</span>
        `;
        
        socialProof.classList.add('show');
        
        setTimeout(() => {
            socialProof.classList.remove('show');
        }, 5000);
        
        currentIndex = (currentIndex + 1) % names.length;
    }
    
    // Start showing notifications after 10 seconds
    setTimeout(() => {
        showNotification();
        setInterval(showNotification, 20000); // Show every 20 seconds
    }, 10000);
    
    // Close button
    const closeBtn = socialProof.querySelector('.social-proof__close');
    closeBtn.addEventListener('click', () => {
        socialProof.classList.remove('show');
    });
}

// Form Validation
function initFormValidation() {
    finalCtaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nameInput = finalCtaForm.querySelector('input[type="text"]');
        const phoneInput = finalCtaForm.querySelector('input[type="tel"]');
        
        // Basic validation
        if (nameInput.value.trim().length < 2) {
            alert('Пожалуйста, введите ваше имя');
            nameInput.focus();
            return;
        }
        
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{4,6}$/;
        if (!phoneRegex.test(phoneInput.value.replace(/\s/g, ''))) {
            alert('Пожалуйста, введите корректный номер телефона');
            phoneInput.focus();
            return;
        }
        
        // Success message
        alert('Спасибо за заявку! Мы свяжемся с вами в течение 15 минут.');
        finalCtaForm.reset();
    });
}

// Testimonials Slider
function initTestimonialsSlider() {
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    const dots = document.querySelectorAll('.dot');
    const testimonials = document.querySelectorAll('.testimonial-card');
    let currentSlide = 0;
    
    function showSlide(index) {
        testimonials.forEach((testimonial, i) => {
            if (window.innerWidth <= 768) {
                testimonial.style.display = i === index ? 'block' : 'none';
            } else {
                testimonial.style.display = 'block';
            }
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
    
    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + testimonials.length) % testimonials.length;
        showSlide(currentSlide);
    });
    
    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % testimonials.length;
        showSlide(currentSlide);
    });
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
    
    // Initialize
    showSlide(currentSlide);
    
    // Auto-play
    setInterval(() => {
        if (window.innerWidth <= 768) {
            currentSlide = (currentSlide + 1) % testimonials.length;
            showSlide(currentSlide);
        }
    }, 5000);
}

// Intersection Observer for Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.6s ease';
        observer.observe(section);
    });
}

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            nav.classList.toggle('mobile-active');
            mobileMenuToggle.classList.toggle('active');
        });
    }
}

// CTA Button Actions
function initCTAActions() {
    const ctaButtons = document.querySelectorAll('.btn--primary');
    
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Skip if it's a form submit button
            if (btn.type === 'submit') return;
            
            e.preventDefault();
            // Scroll to final CTA form
            const finalCTA = document.getElementById('final-cta');
            if (finalCTA) {
                finalCTA.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Focus on first input after scroll
                setTimeout(() => {
                    const firstInput = finalCTA.querySelector('input');
                    if (firstInput) firstInput.focus();
                }, 1000);
            }
        });
    });
    
    // Floating CTA specific action
    floatingCTA.addEventListener('click', () => {
        const finalCTA = document.getElementById('final-cta');
        if (finalCTA) {
            finalCTA.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initFAQ();
    initTabs();
    initCalculator();
    initCountdown();
    initSocialProof();
    initFormValidation();
    initTestimonialsSlider();
    initScrollAnimations();
    initMobileMenu();
    initCTAActions();
});

// Window scroll events
window.addEventListener('scroll', () => {
    updateProgressBar();
    toggleFloatingCTA();
    handleHeaderScroll();
});

// Window resize events
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Reinitialize testimonials slider on resize
        initTestimonialsSlider();
    }, 250);
}); 