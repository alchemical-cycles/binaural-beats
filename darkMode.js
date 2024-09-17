const darkModeToggle = document.getElementById('darkModeToggle');
const DARK_MODE_KEY = 'darkModePreference';

darkModeToggle.addEventListener('change', toggleDarkMode);

function setTheme(isDark) {
    document.documentElement.classList.remove('light-mode', 'dark-mode');
    document.documentElement.classList.add(isDark ? 'dark-mode' : 'light-mode');
    darkModeToggle.checked = isDark;
    localStorage.setItem(DARK_MODE_KEY, isDark.toString());
    announceMode(isDark);
}

function toggleDarkMode() {
    const isDark = !document.documentElement.classList.contains('dark-mode');
    setTheme(isDark);
}

function getInitialTheme() {
    const savedPreference = localStorage.getItem(DARK_MODE_KEY);
    if (savedPreference !== null) {
        return savedPreference === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// Set initial theme based on saved preference or system preference
const initialTheme = getInitialTheme();
setTheme(initialTheme);

// Use addEventListener for system color scheme changes
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
darkModeMediaQuery.addEventListener('change', function (e) {
    // Only change theme if there's no saved preference
    if (localStorage.getItem(DARK_MODE_KEY) === null) {
        const shouldBeDark = e.matches;
        setTheme(shouldBeDark);
    }
});

function announceMode(isDark) {
    const modeAnnouncement = document.createElement('div');
    modeAnnouncement.setAttribute('aria-live', 'polite');
    modeAnnouncement.className = 'sr-only';
    modeAnnouncement.textContent = isDark ? 'Dark mode enabled' : 'Light mode enabled';
    document.body.appendChild(modeAnnouncement);
    setTimeout(() => {
        document.body.removeChild(modeAnnouncement);
    }, 1000);
}
