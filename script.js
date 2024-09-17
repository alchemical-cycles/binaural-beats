let audioContext;
let oscillatorLeft;
let oscillatorRight;
let gainNode;
let isPlaying = false;

const baseFrequencyInput = document.getElementById('baseFrequency');
const beatFrequencyInput = document.getElementById('beatFrequency');
const toggleButton = document.getElementById('toggleButton');
const darkModeToggle = document.getElementById('darkModeToggle');

baseFrequencyInput.addEventListener('input', updateFrequency);
beatFrequencyInput.addEventListener('input', updateFrequency);
toggleButton.addEventListener('click', toggleSound);
darkModeToggle.addEventListener('change', toggleDarkMode);

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        gainNode = audioContext.createGain();
        gainNode.gain.value = 0.1;
        gainNode.connect(audioContext.destination);
    }
}

function createOscillators() {
    oscillatorLeft = audioContext.createOscillator();
    oscillatorRight = audioContext.createOscillator();

    const mergerNode = audioContext.createChannelMerger(2);

    oscillatorLeft.connect(mergerNode, 0, 0);
    oscillatorRight.connect(mergerNode, 0, 1);
    mergerNode.connect(gainNode);

    updateFrequency();
}

function updateFrequency() {
    const baseFrequency = parseFloat(baseFrequencyInput.value);
    const beatFrequency = parseFloat(beatFrequencyInput.value);

    document.getElementById('baseFrequencyValue').textContent = baseFrequency;
    document.getElementById('beatFrequencyValue').textContent = beatFrequency;

    if (oscillatorLeft && oscillatorRight) {
        oscillatorLeft.frequency.setValueAtTime(baseFrequency, audioContext.currentTime);
        oscillatorRight.frequency.setValueAtTime(baseFrequency + beatFrequency, audioContext.currentTime);
    }
}

function toggleSound() {
    initAudio();
    if (isPlaying) {
        oscillatorLeft.stop();
        oscillatorRight.stop();
        toggleButton.textContent = 'Start';
        toggleButton.setAttribute('aria-pressed', 'false');
    } else {
        createOscillators();
        oscillatorLeft.start();
        oscillatorRight.start();
        toggleButton.textContent = 'Stop';
        toggleButton.setAttribute('aria-pressed', 'true');
    }
    isPlaying = !isPlaying;
}

function toggleDarkMode() {
    document.documentElement.classList.toggle('dark-mode');
    // Update the checkbox state to match the current mode
    darkModeToggle.checked = document.documentElement.classList.contains('dark-mode');
    announceMode(isDark);
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

// Set the initial state based on the system preference
if (darkModeMediaQuery.matches) {
    document.documentElement.classList.add('dark-mode');
    darkModeToggle.checked = true;
}

function announceMode(isDark) {
    const modeAnnouncement = document.createElement('div');
    modeAnnouncement.setAttribute('aria-live', 'polite');
    modeAnnouncement.textContent = isDark ? 'Dark mode enabled' : 'Light mode enabled';
    document.body.appendChild(modeAnnouncement);
    setTimeout(() => {
        document.body.removeChild(modeAnnouncement);
    }, 1000);
}
