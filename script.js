// The UnderGrads - Main JavaScript File
(function () {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function () {
        initializeApp();
    });

    // script.js

    function initializeApp() {
        // Initialize original site features
        initializeScrollAnimations();
        initializeSmoothScroll();
        handlePageLoad();
        initializeResponsiveText();
        initializeNavigationActiveStates();
        initializeScrollEffects();
        initializeParallaxCards();
        initializeAboutNavigation();

        // Initialize the new quote form functionality
        initializeQuoteForm();
        initializeLightbox();
        initializeAboutScrollSpy(); // <--- ADD THIS LINE
    }

    // =================================================================
    // == ORIGINAL SITE FUNCTIONS (Scroll, Parallax, etc.)
    // =================================================================

    function initializeScrollAnimations() {
        if (!window.IntersectionObserver) { return; }
        const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        const storyBlocks = document.querySelectorAll('.story-text-block');
        storyBlocks.forEach(block => observer.observe(block));
        const serviceItems = document.querySelectorAll('.service-item');
        serviceItems.forEach(item => observer.observe(item));
        const workSection = document.querySelector('.work-section');
        if (workSection) { observer.observe(workSection); }
    }

    function initializeSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', function (e) {
                // Do not interfere with form trigger buttons
                if (this.classList.contains('get-quote-btn')) {
                    return;
                }
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    history.pushState(null, null, targetId);
                }
            });
        });
    }

    function handlePageLoad() {
        window.addEventListener('load', function () {
            var sun = document.querySelector('.glow-background');
            if (sun) { sun.classList.add('sun-drop-in'); }

            var heading = document.querySelector('.main-heading');
            if (heading) { heading.classList.add('animate-in'); }

            var subtitle = document.querySelector('.hero-subtitle');
            if (subtitle) {
                setTimeout(() => subtitle.classList.add('animate-in'), 400);
            }

            // ▼▼▼ ADD THIS CODE BLOCK ▼▼▼
            var heroButton = document.querySelector('.hero-section .build-button');
            if (heroButton) {
                setTimeout(() => heroButton.classList.add('animate-in'), 1800);
            }
            // ▲▲▲ END OF ADDED CODE ▲▲▲

            document.body.classList.add('loaded');
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) { heroContent.classList.add('fade-in'); }
        });
    }

    function initializeResponsiveText() {
        function updateTextScale() {
            const viewportWidth = window.innerWidth;
            const baseWidth = 1200;
            const scale = Math.min(Math.max(viewportWidth / baseWidth, 0.7), 1.2);
            document.documentElement.style.setProperty('--text-scale', scale);
        }
        updateTextScale();
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(updateTextScale, 150);
        });
    }

    // ... (other original functions like parallax, navigation, etc. remain here) ...

    function initializeNavigationActiveStates() {
        const sections = document.querySelectorAll('section[id], main[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        if (!sections.length || !navLinks.length) { return; }
        const observerOptions = { threshold: 0.1, rootMargin: '-20% 0px -20% 0px' };
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        link.style.transform = '';
                    });
                    const activeLink = document.querySelector('.nav-link[href="#' + entry.target.id + '"]');
                    if (activeLink) {
                        activeLink.classList.add('active');
                        setTimeout(() => {
                            if (activeLink.classList.contains('active')) {
                                activeLink.style.transform = 'translateX(4px) scale(1.02)';
                            }
                        }, 100);
                    }
                }
            });
        }, observerOptions);
        sections.forEach(section => observer.observe(section));
    }

    function initializeScrollEffects() {
        let scrollTimer;
        let lastScrollY = window.scrollY;
        let isScrolling = false;
        const textElements = document.querySelectorAll('.story-paragraph, .main-heading, .hero-subtitle');
        const navLinks = document.querySelectorAll('.nav-link');
        function handleScrollStart() {
            if (!isScrolling) {
                isScrolling = true;
                textElements.forEach(element => {
                    element.classList.add('text-blur-on-scroll');
                    element.classList.add('scrolling');
                });
                navLinks.forEach(link => {
                    if (!link.classList.contains('active')) { link.style.opacity = '0.6'; }
                });
            }
        }
        function handleScrollEnd() {
            isScrolling = false;
            textElements.forEach(element => element.classList.remove('scrolling'));
            navLinks.forEach(link => { link.style.opacity = ''; });
        }
        window.addEventListener('scroll', () => {
            handleScrollStart();
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(handleScrollEnd, 150);
            lastScrollY = window.scrollY;
        }, { passive: true });
    }

    function initializeParallaxCards() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }
        const serviceCards = document.querySelectorAll('[data-parallax="service-card"]');
        if (!serviceCards.length) { return; }
        function updateParallax() {
            serviceCards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                if (rect.bottom >= -200 && rect.top <= windowHeight + 200) {
                    const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
                    const baseOffset = 100;
                    const parallaxOffset = scrollProgress * 200;
                    card.style.transform = `translateX(-50%) translateY(-${baseOffset + parallaxOffset}px)`;
                    card.style.opacity = 1;
                }
            });
        }
        let ticking = false;
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateParallax();
                    ticking = false;
                });
                ticking = true;
            }
        }
        window.addEventListener('scroll', requestTick, { passive: true });
        updateParallax();
    }

    function initializeAboutNavigation() {
        const navLinks = document.querySelectorAll('.about-nav-link');
        const contentSections = document.querySelectorAll('.about-content-section');
        if (!navLinks.length || !contentSections.length) { return; }
        function switchToSection(targetSection) {
            navLinks.forEach(link => link.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));
            const activeLink = document.querySelector(`.about-nav-link[data-section="${targetSection}"]`);
            if (activeLink) { activeLink.classList.add('active'); }
            const targetContent = document.querySelector(`.about-content-section[data-content="${targetSection}"]`);
            if (targetContent) { targetContent.classList.add('active'); }
        }
        navLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const targetSection = this.getAttribute('data-section');
                if (targetSection) { switchToSection(targetSection); }
            });
        });
        switchToSection('about');
    }

    function initializeAboutScrollSpy() {
        const contentSections = document.querySelectorAll('.about-main-content .about-content-section');
        const navLinks = document.querySelectorAll('.about-nav-link');

        if (contentSections.length === 0 || navLinks.length === 0) {
            return; // Don't run if the section doesn't exist
        }

        const observerOptions = {
            root: null, // Observing relative to the viewport
            rootMargin: "-50% 0px -50% 0px", // Triggers when a section is in the vertical center of the screen
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.dataset.content;

                    // First, remove 'active' from all links
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                    });

                    // Then, add 'active' to the correct one
                    const activeLink = document.querySelector(`.about-nav-link[data-section="${id}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }, observerOptions);

        contentSections.forEach(section => {
            observer.observe(section);
        });
    }

    // =================================================================
    // == NEW QUOTE FORM LOGIC
    // =================================================================

    function initializeQuoteForm() {
        class QuoteModal {
            constructor() {
                this.init();
            }

            init() {
                this.setupEventListeners();
                this.initMultiSelect();
                this.handleFormSubmission();
                this.setupLiveValidation();
            }

            initMultiSelect() {
                const selectBox = document.querySelector('.select-box');
                const checkboxOptions = document.querySelector('.checkbox-options');
                const selectText = document.querySelector('.select-text');
                if (!selectBox || !checkboxOptions) return;

                selectBox.addEventListener('click', () => {
                    checkboxOptions.classList.toggle('active');
                });

                checkboxOptions.addEventListener('change', () => {
                    const checkedItems = checkboxOptions.querySelectorAll('input[type="checkbox"]:checked');
                    if (checkedItems.length === 0) {
                        selectText.textContent = 'Select Services...';
                    } else if (checkedItems.length === 1) {
                        selectText.textContent = '1 Service Selected';
                    } else {
                        selectText.textContent = `${checkedItems.length} Services Selected`;
                    }
                });

                document.addEventListener('click', (e) => {
                    if (!e.target.closest('.multi-select-container')) {
                        checkboxOptions.classList.remove('active');
                    }
                });
            }

            setupEventListeners() {
                document.addEventListener('click', (e) => {
                    const triggerButton = e.target.closest('.get-quote-btn');
                    if (triggerButton) {
                        e.preventDefault();
                        const serviceItem = triggerButton.closest('.service-item');
                        this.openQuoteModal(serviceItem);
                    }
                });

                const closeButton = document.getElementById('closeQuote');
                const quoteOverlay = document.getElementById('quoteOverlay');

                if (closeButton) {
                    closeButton.addEventListener('click', () => this.closeQuoteModal());
                }
                if (quoteOverlay) {
                    quoteOverlay.addEventListener('click', (e) => {
                        if (e.target.id === 'quoteOverlay') {
                            this.closeQuoteModal();
                        }
                    });
                }
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && quoteOverlay.classList.contains('active')) {
                        this.closeQuoteModal();
                    }
                });
            }

            openQuoteModal(serviceItem) {
                const quoteOverlay = document.getElementById('quoteOverlay');
                const selectedProduct = document.getElementById('selectedProduct');
                if (!quoteOverlay || !selectedProduct) return;

                if (serviceItem) {
                    selectedProduct.style.display = 'block';
                    const title = serviceItem.querySelector('.service-title')?.textContent || 'Selected Service';
                    const description = serviceItem.querySelector('.service-description')?.textContent || 'Please provide details below.';
                    selectedProduct.innerHTML = `<h4>${title.trim()}</h4><p>${description.trim()}</p>`;
                } else {
                    selectedProduct.innerHTML = '';
                    selectedProduct.style.display = 'none';
                }

                quoteOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            closeQuoteModal() {
                const quoteOverlay = document.getElementById('quoteOverlay');
                if (!quoteOverlay) return;

                quoteOverlay.classList.remove('active');
                document.body.style.overflow = 'auto';

                const quoteForm = document.getElementById('quoteForm');
                if (quoteForm) {
                    quoteForm.reset();
                }

                const selectText = document.querySelector('.select-text');
                if (selectText) {
                    selectText.textContent = 'Select Services...';
                }

                document.querySelectorAll('.error-message-quote').forEach(el => {
                    el.style.display = 'none';
                    el.textContent = '';
                });

                document.querySelectorAll('#quoteForm .invalid, #quoteForm .valid').forEach(el => {
                    el.classList.remove('invalid', 'valid');
                });

                const successMsg = document.querySelector('.success-message-quote');
                if (successMsg) {
                    successMsg.style.display = 'none';
                }
            }
            handleFormSubmission() {
                const quoteForm = document.getElementById('quoteForm');
                if (!quoteForm) return;

                quoteForm.addEventListener('submit', (e) => {
                    e.preventDefault(); // Prevent the form from submitting immediately
                    const isValid = this.validateForm(quoteForm);

                    if (isValid) {
                        // If the form is valid, you can proceed with submission here.
                        // For now, we'll just log it and show a success message.
                        console.log('Form is valid and would be submitted.');
                        this.showSuccessMessage();
                    } else {
                        console.log('Form has errors.');
                    }
                });
            }

            validateForm(form) {
                let isValid = true;
                this.clearAllErrors(form);

                // --- Field validation ---
                const name = form.querySelector('[name="name"]');
                if (!this.validateRequired(name, 'Name is required.')) isValid = false;

                const email = form.querySelector('[name="email"]');
                if (!this.validateRequired(email, 'Email is required.')) {
                    isValid = false;
                } else if (!this.validateEmail(email, 'Please enter a valid email address.')) {
                    isValid = false;
                }

                const phone = form.querySelector('[name="phone"]');
                if (!this.validateRequired(phone, 'WhatsApp number is required.')) isValid = false;

                const countryCode = form.querySelector('[name="country_code"]');
                if (!this.validateRequired(countryCode, 'Please select a country code.')) isValid = false;

                return isValid;
            }

            // --- Helper validation methods ---
            validateRequired(field, message) {
                if (!field.value.trim()) {
                    this.showError(field, message);
                    return false;
                }
                return true;
            }

            validateEmail(field, message) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value)) {
                    this.showError(field, message);
                    return false;
                }
                return true;
            }
            // Paste this new function after validateEmail() inside the QuoteModal class

            validatePhone(field, message) {
                const phoneRegex = /^[0-9]+$/; // This regex checks for digits only
                if (!phoneRegex.test(field.value)) {
                    this.showError(field, message);
                    return false;
                }
                return true;
            }

            showError(field, message) {
                field.classList.add('invalid');
                const errorContainer = field.closest('.form-group').querySelector('.error-message-quote');
                if (errorContainer) {
                    errorContainer.textContent = message;
                    errorContainer.style.display = 'block';
                }
            }

            clearAllErrors(form) {
                form.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
                form.querySelectorAll('.error-message-quote').forEach(el => {
                    el.textContent = '';
                    el.style.display = 'none';
                });
            }

            showSuccessMessage() {
                const quoteForm = document.getElementById('quoteForm');
                const successMessage = document.querySelector('.success-message-quote');

                if (quoteForm) quoteForm.style.display = 'none';
                if (successMessage) successMessage.style.display = 'block';

                // Optional: Hide the success message and show the form again after a few seconds
                setTimeout(() => {
                    if (successMessage) successMessage.style.display = 'none';
                    if (quoteForm) {
                        quoteForm.style.display = 'block';
                        this.closeQuoteModal(); // Or just close the modal completely
                    }
                }, 4000); // 4 seconds
            }
            // Paste this code inside the QuoteModal class

            setupLiveValidation() {
                const form = document.getElementById('quoteForm');
                if (!form) return;

                // Validate fields as the user types
                form.addEventListener('input', (e) => {
                    const field = e.target;
                    const fieldName = field.getAttribute('name');

                    // Clear previous error for this specific field
                    this.clearFieldError(field);

                    // Perform validation based on the field name
                    switch (fieldName) {
                        case 'name':
                            this.validateRequired(field, 'Name is required.');
                            break;
                        case 'email':
                            if (this.validateRequired(field, 'Email is required.')) {
                                this.validateEmail(field, 'Please enter a valid email address.');
                            }
                            break;
                        case 'phone':
                            if (this.validateRequired(field, 'WhatsApp number is required.')) {
                                // This is the new check for numbers only
                                this.validatePhone(field, 'Please enter numbers only.');
                            }
                            break;
                        case 'country_code':
                            this.validateRequired(field, 'Please select a country code.');
                            break;
                    }
                });

                // Also handle the character counter for the textarea
                const messageTextarea = form.querySelector('textarea[name="message"]');
                const charCounter = document.getElementById('charCounterQuote');
                if (messageTextarea && charCounter) {
                    messageTextarea.addEventListener('input', () => {
                        const remaining = messageTextarea.maxLength - messageTextarea.value.length;
                        charCounter.textContent = `${remaining} characters remaining`;
                    });
                }
            }

            // Helper function to clear a single field's error
            clearFieldError(field) {
                field.classList.remove('invalid', 'valid');
                const errorContainer = field.closest('.form-group').querySelector('.error-message-quote');
                if (errorContainer) {
                    errorContainer.textContent = '';
                    errorContainer.style.display = 'none';
                }
            }
        }

        new QuoteModal();
    }
    function initializeLightbox() {
        const lightboxOverlay = document.getElementById('lightboxOverlay');
        const lightboxImage = document.getElementById('lightboxImage');
        const lightboxClose = document.querySelector('.lightbox-close');
        const imageTriggers = document.querySelectorAll('.lightbox-trigger');

        if (!lightboxOverlay || !lightboxImage || !lightboxClose || imageTriggers.length === 0) {
            return; // Don't run if essential elements are missing
        }

        const openLightbox = (e) => {
            e.preventDefault();
            const imageSrc = e.currentTarget.href;
            lightboxImage.setAttribute('src', imageSrc);
            lightboxOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightboxOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

        imageTriggers.forEach(trigger => {
            trigger.addEventListener('click', openLightbox);
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxOverlay.addEventListener('click', (e) => {
            if (e.target === lightboxOverlay) {
                closeLightbox();
            }
        });
    }

})();