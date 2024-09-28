let oscillatorLeft;
let oscillatorRight;
let isPlaying = false;

const baseFrequencyInput = document.getElementById('baseFrequency');
const beatFrequencyInput = document.getElementById('beatFrequency');
const toggleButton = document.getElementById('toggleButton');
const debugDiv = document.createElement('div');
document.body.appendChild(debugDiv);

baseFrequencyInput.addEventListener('input', updateFrequency);
beatFrequencyInput.addEventListener('input', updateFrequency);
toggleButton.addEventListener('click', toggleSound);

function log(message) {
    console.log(message);
    debugDiv.innerHTML += message + '<br>';
    debugDiv.scrollTop = debugDiv.scrollHeight;
}

function initAudio() {
    log('Initializing audio...');
    if (!oscillatorLeft || !oscillatorRight) {
        try {
            oscillatorLeft = new Tone.Oscillator().toDestination();
            oscillatorRight = new Tone.Oscillator().toDestination();

            // Set initial pan for each oscillator
            oscillatorLeft.set({ pan: -1 });
            oscillatorRight.set({ pan: 1 });

            // Set initial volume (gain)
            Tone.Destination.volume.value = -20; // This is equivalent to a gain of 0.1
            log('Oscillators created successfully');
        } catch (error) {
            log('Error creating oscillators: ' + error.message);
            handleAudioError('Failed to initialize audio. Error: ' + error.message);
            return false;
        }
    }
    updateFrequency();
    return true;
}

function updateFrequency() {
    const baseFrequency = parseFloat(baseFrequencyInput.value);
    const beatFrequency = parseFloat(beatFrequencyInput.value);

    document.getElementById('baseFrequencyValue').textContent = baseFrequency;
    document.getElementById('beatFrequencyValue').textContent = beatFrequency;

    if (oscillatorLeft && oscillatorRight) {
        try {
            oscillatorLeft.frequency.value = baseFrequency;
            oscillatorRight.frequency.value = baseFrequency + beatFrequency;
            log(`Frequencies updated: Left = ${baseFrequency}Hz, Right = ${baseFrequency + beatFrequency}Hz`);
        } catch (error) {
            log('Error updating frequencies: ' + error.message);
        }
    }
}

async function toggleSound() {
    log('Toggle sound button pressed');
    try {
        await Tone.start();
        log('Tone.start() successful');
    } catch (error) {
        log('Failed to start Tone: ' + error.message);
        handleAudioError('Failed to start audio. Error: ' + error.message);
        return;
    }

    if (!oscillatorLeft || !oscillatorRight) {
        if (!initAudio()) {
            return;
        }
    }

    if (isPlaying) {
        try {
            oscillatorLeft.stop();
            oscillatorRight.stop();
            log('Oscillators stopped');
            toggleButton.textContent = 'Start';
            toggleButton.setAttribute('aria-pressed', 'false');
        } catch (error) {
            log('Error stopping oscillators: ' + error.message);
        }
    } else {
        try {
            oscillatorLeft.start();
            oscillatorRight.start();
            log('Oscillators started');
            toggleButton.textContent = 'Stop';
            toggleButton.setAttribute('aria-pressed', 'true');
        } catch (error) {
            log('Error starting oscillators: ' + error.message);
            handleAudioError('Failed to start oscillators. Error: ' + error.message);
            return;
        }
    }
    isPlaying = !isPlaying;
    log('isPlaying: ' + isPlaying);
}

function handleAudioError(message) {
    // Disable audio controls
    baseFrequencyInput.disabled = true;
    beatFrequencyInput.disabled = true;
    toggleButton.disabled = true;

    // Display error message to user
    const errorDiv = document.createElement('div');
    errorDiv.textContent = message;
    errorDiv.style.color = 'red';
    errorDiv.style.marginTop = '1rem';
    document.querySelector('.container').appendChild(errorDiv);
    log('Audio error: ' + message);
}

// Check if we're running on iOS
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
log('Running on iOS: ' + isIOS);

// Initial setup
if (initAudio()) {
    log('Audio initialized successfully');
} else {
    log('Failed to initialize audio');
}

// Add a touch event listener to the document body
document.body.addEventListener('touchstart', function () {
    log('Touch event detected');
    if (Tone.context.state !== 'running') {
        Tone.context.resume().then(() => log('Audio context resumed'));
    }
}, false);

// Log the audio context state when it changes
Tone.context.onstatechange = function () {
    log('Audio context state changed to: ' + Tone.context.state);
};
