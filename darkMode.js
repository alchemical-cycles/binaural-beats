const darkModeToggle = document.getElementById('darkModeToggle');

darkModeToggle.addEventListener('change', toggleDarkMode);

function setTheme(isDark) {
    document.documentElement.classList.toggle('dark-mode', isDark);
    darkModeToggle.checked = isDark;
    announceMode(isDark);
}

function toggleDarkMode() {
    const isDark = !document.documentElement.classList.contains('dark-mode');
    setTheme(isDark);
}

// Set initial state of the toggle based on the default mode
darkModeToggle.checked = document.documentElement.classList.contains('dark-mode');

// Use addEventListener for system color scheme changes
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
darkModeMediaQuery.addEventListener('change', function (e) {
    const shouldBeDark = e.matches;
    document.documentElement.classList.toggle('dark-mode', shouldBeDark);
    darkModeToggle.checked = shouldBeDark;
});

// Set initial theme based on system preference
setTheme(darkModeMediaQuery.matches);

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
