const darkModeToggle = document.getElementById('darkModeToggle');
const THEME_PREFERENCE_KEY = 'themePreference';

darkModeToggle.addEventListener('change', toggleTheme);

function setTheme(theme) {
    if (theme !== 'dark' && theme !== 'light') {
        console.error('Invalid theme. Must be "dark" or "light".');
        return;
    }

    document.documentElement.classList.remove('light-mode', 'dark-mode');
    document.documentElement.classList.add(`${theme}-mode`);
    darkModeToggle.checked = (theme === 'dark');
    localStorage.setItem(THEME_PREFERENCE_KEY, theme);
    announceMode(theme);
}

function toggleTheme() {
    const newTheme = document.documentElement.classList.contains('dark-mode') ? 'light' : 'dark';
    setTheme(newTheme);
}

function getInitialTheme() {
    const savedPreference = localStorage.getItem(THEME_PREFERENCE_KEY);
    if (savedPreference === 'dark' || savedPreference === 'light') {
        return savedPreference;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Set initial theme based on saved preference or system preference
const initialTheme = getInitialTheme();
setTheme(initialTheme);

// Use addEventListener for system color scheme changes
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
darkModeMediaQuery.addEventListener('change', function (e) {
    // Only change theme if there's no saved preference
    if (localStorage.getItem(THEME_PREFERENCE_KEY) === null) {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
    }
});

function announceMode(theme) {
    const modeAnnouncement = document.createElement('div');
    modeAnnouncement.setAttribute('aria-live', 'polite');
    modeAnnouncement.className = 'sr-only';
    modeAnnouncement.textContent = `${theme.charAt(0).toUpperCase() + theme.slice(1)} mode enabled`;
    document.body.appendChild(modeAnnouncement);
    setTimeout(() => {
        document.body.removeChild(modeAnnouncement);
    }, 1000);
}
