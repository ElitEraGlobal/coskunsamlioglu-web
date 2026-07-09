/*
=========================================================
ELITERA Executive Portfolio
App.js - Mobile Menu & Responsive Functionality
Version: 1.0
=========================================================
*/

(function() {
    'use strict';

    // ===========================
    // MOBILE MENU FUNCTIONALITY
    // ===========================

    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuOverlay = document.querySelector('.menu-overlay');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');

    // Check if elements exist
    if (!menuToggle || !mobileMenu || !menuOverlay) {
        console.warn('Mobile menu elements not found');
        return;
    }

    /**
     * Toggle mobile menu open/close
     */
    function toggleMenu() {
        const isOpen = menuToggle.classList.contains('active');
        
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    /**
     * Open mobile menu
     */
    function openMenu() {
        menuToggle.classList.add('active');
        mobileMenu.classList.add('active');
        menuOverlay.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close mobile menu
     */
    function closeMenu() {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    /**
     * Handle menu toggle button click
     */
    menuToggle.addEventListener('click', toggleMenu);

    /**
     * Handle overlay click to close menu
     */
    menuOverlay.addEventListener('click', closeMenu);

    /**
     * Close menu when a link is clicked
     */
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    /**
     * Close menu on ESC key press
     */
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && menuToggle.classList.contains('active')) {
            closeMenu();
        }
    });

    /**
     * Close menu on window resize (when transitioning from mobile to desktop)
     */
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 767) {
                closeMenu();
            }
        }, 250);
    }, { passive: true });

    // ===========================
    // SMOOTH SCROLL BEHAVIOR
    // ===========================

    /**
     * Smooth scroll to section
     */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                // Close mobile menu if open
                if (menuToggle.classList.contains('active')) {
                    closeMenu();
                }
                
                // Scroll to target with offset for fixed header
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===========================
    // ACCESSIBILITY ENHANCEMENTS
    // ===========================

    /**
     * Handle focus trap in mobile menu
     */
    function handleMenuFocus(event) {
        if (!mobileMenu.classList.contains('active')) return;
        
        const focusableElements = mobileMenu.querySelectorAll('a, button');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (event.key === 'Tab') {
            if (event.shiftKey) {
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        }
    }

    document.addEventListener('keydown', handleMenuFocus);

    // ===========================
    // LANGUAGE SWITCHER
    // ===========================

    /**
     * Initialize language switcher
     */
    function initLanguageSwitcher() {
        const languageButtons = document.querySelectorAll('.language-btn');

        if (languageButtons.length === 0) {
            console.warn('Language switcher buttons not found');
            return;
        }

        /**
         * Handle language button click
         */
        languageButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                e.preventDefault();
                const lang = button.getAttribute('data-lang');
                
                if (window.i18n && window.i18n.setLanguage) {
                    await window.i18n.setLanguage(lang);
                    
                    // Update active button state
                    languageButtons.forEach(btn => {
                        btn.classList.remove('active');
                    });
                    button.classList.add('active');
                }
            });
        });

        /**
         * Listen for language changes from i18n
         */
        window.addEventListener('languageChanged', (event) => {
            const currentLang = event.detail.language;
            languageButtons.forEach(btn => {
                if (btn.getAttribute('data-lang') === currentLang) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        });
    }

    // Initialize language switcher when i18n is ready
    if (window.i18n) {
        initLanguageSwitcher();
    } else {
        // Fallback: wait for i18n to be available
        document.addEventListener('DOMContentLoaded', () => {
            if (window.i18n) {
                initLanguageSwitcher();
            }
        });
    }

    // ===========================
    // INITIALIZATION
    // ===========================

    console.log('ELITERA Responsive System v1.0 initialized');

})();
