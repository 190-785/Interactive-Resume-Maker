/**
 * Utility functions for date formatting with internationalization support
 */

// List of supported locales
const supportedLocales = {
    'en-US': 'English (US)',
    'en-GB': 'English (UK)',
    'fr-FR': 'French',
    'de-DE': 'German',
    'es-ES': 'Spanish',
    'it-IT': 'Italian',
    'ja-JP': 'Japanese',
    'zh-CN': 'Chinese (Simplified)',
    'ru-RU': 'Russian',
    'ar-SA': 'Arabic',
    'pt-BR': 'Portuguese (Brazil)',
    'hi-IN': 'Hindi'
};

// Default format options
const defaultDateFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
};

const shortDateFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
};

const timeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit'
};

/**
 * Format a date according to the user's locale
 * @param {Date|string|number} date - The date to format
 * @param {string} locale - The locale to use (defaults to browser locale)
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
function formatDate(date, locale = getUserLocale(), options = defaultDateFormatOptions) {
    // Convert to Date object if string or number
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // Use Intl.DateTimeFormat for localized formatting
    return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

/**
 * Format a date in short format
 * @param {Date|string|number} date - The date to format
 * @param {string} locale - The locale to use
 * @returns {string} Formatted date string
 */
function formatShortDate(date, locale = getUserLocale()) {
    return formatDate(date, locale, shortDateFormatOptions);
}

/**
 * Format a date with time
 * @param {Date|string|number} date - The date to format
 * @param {string} locale - The locale to use
 * @returns {string} Formatted date and time string
 */
function formatDateTime(date, locale = getUserLocale()) {
    const options = {
        ...defaultDateFormatOptions,
        ...timeFormatOptions
    };
    return formatDate(date, locale, options);
}

/**
 * Format a relative time (e.g., "2 days ago", "in 3 hours")
 * @param {Date|string|number} date - The date to compare to now
 * @param {string} locale - The locale to use
 * @returns {string} Relative time string
 */
function formatRelativeTime(date, locale = getUserLocale()) {
    const dateObj = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const diffMs = dateObj - now;
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);
    const diffMonth = Math.round(diffDay / 30);
    const diffYear = Math.round(diffDay / 365);
    
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    
    if (Math.abs(diffSec) < 60) {
        return rtf.format(diffSec, 'second');
    } else if (Math.abs(diffMin) < 60) {
        return rtf.format(diffMin, 'minute');
    } else if (Math.abs(diffHour) < 24) {
        return rtf.format(diffHour, 'hour');
    } else if (Math.abs(diffDay) < 30) {
        return rtf.format(diffDay, 'day');
    } else if (Math.abs(diffMonth) < 12) {
        return rtf.format(diffMonth, 'month');
    } else {
        return rtf.format(diffYear, 'year');
    }
}

/**
 * Get the user's preferred locale
 * @returns {string} User locale
 */
function getUserLocale() {
    // Try to get from localStorage first
    const savedLocale = localStorage.getItem('userLocale');
    if (savedLocale && supportedLocales[savedLocale]) {
        return savedLocale;
    }
    
    // Fall back to browser locale if it's supported
    const browserLocale = navigator.language;
    if (supportedLocales[browserLocale]) {
        return browserLocale;
    }
    
    // Default to US English
    return 'en-US';
}

/**
 * Set the user's preferred locale
 * @param {string} locale - The locale to set
 * @returns {boolean} Whether the locale was successfully set
 */
function setUserLocale(locale) {
    if (!supportedLocales[locale]) {
        console.error(`Locale ${locale} not supported`);
        return false;
    }
    
    localStorage.setItem('userLocale', locale);
    return true;
}

/**
 * Get list of supported locales
 * @returns {Object} Map of locale codes to display names
 */
function getSupportedLocales() {
    return { ...supportedLocales };
}

// Export the functions
export {
    formatDate,
    formatShortDate,
    formatDateTime,
    formatRelativeTime,
    getUserLocale,
    setUserLocale,
    getSupportedLocales,
    supportedLocales
};
