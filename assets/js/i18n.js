/*
=========================================================
ELITERA Executive Portfolio
i18n.js - Internationalization Engine
Version: 1.0
=========================================================
*/

(function() {
    'use strict';

    // ===========================
    // CONFIGURATION
    // ===========================

    const I18N_CONFIG = {
        defaultLanguage: 'en',
        supportedLanguages: ['en', 'tr'],
        storageKey: 'elitera_language',
        languagesPath: 'assets/languages/'
    };

    // ===========================
    // STATE
    // ===========================

    let currentLanguage = I18N_CONFIG.defaultLanguage;
    let translations = {};

    // ===========================
    // CORE FUNCTIONS
    // ===========================

    /**
     * Load language file with caching
     * @param {string} lang - Language code
     * @returns {Promise}
     */
    async function loadLanguage(lang) {
        if (!I18N_CONFIG.supportedLanguages.includes(lang)) {
            console.warn(`Language "${lang}" not supported. Falling back to ${I18N_CONFIG.defaultLanguage}`);
            lang = I18N_CONFIG.defaultLanguage;
        }

        try {
            const response = await fetch(`${I18N_CONFIG.languagesPath}${lang}.json`, {
                headers: { 'Accept': 'application/json' }
            });
            if (!response.ok) {
                throw new Error(`Failed to load language file: ${lang}.json`);
            }
            translations = await response.json();
            currentLanguage = lang;
            return true;
        } catch (error) {
            console.error('i18n Error:', error);
            return false;
        }
    }

    /**
     * Get translation value by key
     * @param {string} key - Translation key (dot notation: "section.key")
     * @param {string} fallback - Fallback text if key not found
     * @returns {string}
     */
    function t(key, fallback = key) {
        const keys = key.split('.');
        let value = translations;

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return fallback;
            }
        }

        return typeof value === 'string' ? value : fallback;
    }

    /**
     * Translate all elements with data-i18n attribute
     */
    function translateDOM() {
        // Handle data-i18n-html elements (with HTML content)
        const htmlElements = document.querySelectorAll('[data-i18n-html]');
        htmlElements.forEach(element => {
            const key = element.getAttribute('data-i18n-html');
            const translation = t(key);
            element.innerHTML = translation;
        });

        // Handle data-i18n elements (text content only)
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = t(key);

            // Check if element has data-i18n-attr for attribute translation
            const attrName = element.getAttribute('data-i18n-attr');
            if (attrName) {
                element.setAttribute(attrName, translation);
            } else {
                // Default: translate text content
                element.textContent = translation;
            }
        });
    }

    /**
     * Set language and update DOM
     * @param {string} lang - Language code
     * @returns {Promise}
     */
    async function setLanguage(lang) {
        const success = await loadLanguage(lang);
        if (success) {
            // Update HTML lang attribute
            document.documentElement.lang = currentLanguage;

            // Update text direction if needed
            const direction = translations.meta?.direction || 'ltr';
            document.documentElement.dir = direction;

            // Translate DOM
            translateDOM();

            // Save preference to localStorage
            localStorage.setItem(I18N_CONFIG.storageKey, currentLanguage);

            // Dispatch custom event for other scripts to listen
            window.dispatchEvent(new CustomEvent('languageChanged', {
                detail: { language: currentLanguage }
            }));

            return true;
        }
        return false;
    }

    /**
     * Get current language
     * @returns {string}
     */
    function getCurrentLanguage() {
        return currentLanguage;
    }

    /**
     * Initialize i18n system
     * @returns {Promise}
     */
    async function init() {
        // Check localStorage for saved language preference
        const savedLanguage = localStorage.getItem(I18N_CONFIG.storageKey);
        const languageToLoad = savedLanguage || I18N_CONFIG.defaultLanguage;

        // Load and set language
        const success = await setLanguage(languageToLoad);

        if (success) {
            console.log(`i18n initialized with language: ${currentLanguage}`);
        } else {
            console.error('i18n initialization failed');
        }

        return success;
    }

    // ===========================
    // EXPOSE PUBLIC API
    // ===========================

    window.i18n = {
        init,
        setLanguage,
        getCurrentLanguage,
        t,
        config: I18N_CONFIG
    };

    // ===========================
    // AUTO-INITIALIZE
    // ===========================

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.i18n.init();
        });
    } else {
        window.i18n.init();
    }

})();
