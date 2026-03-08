/**
 * app.js — Theme toggle + mobile navigation
 */

// Theme toggle
function toggleTheme() {
    const body = document.body;
    const current = body.getAttribute('data-theme');
    const next = current === 'dark' ? '' : 'dark';
    body.setAttribute('data-theme', next);
    localStorage.setItem('theme', next || 'light');
    updateThemeIcon(next);
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('themeIcon');
    if (icon) {
        icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
    }
}

// Mobile nav toggle
function toggleNav() {
    const rail = document.getElementById('navRail');
    const overlay = document.getElementById('navOverlay');
    if (rail) {
        rail.classList.toggle('nav-rail--open');
        if (overlay) overlay.classList.toggle('nav-overlay--visible');
    }
}

// Initialize theme on load
(function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        updateThemeIcon('dark');
    }
})();
