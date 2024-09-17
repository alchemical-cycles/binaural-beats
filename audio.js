let audioContext;
let oscillatorLeft;
let oscillatorRight;
let gainNode;
let isPlaying = false;

const baseFrequencyInput = document.getElementById('baseFrequency');
const beatFrequencyInput = document.getElementById('beatFrequency');
const toggleButton = document.getElementById('toggleButton');

baseFrequencyInput.addEventListener('input', updateFrequency);
beatFrequencyInput.addEventListener('input', updateFrequency);
toggleButton.addEventListener('click', toggleSound);

function initAudio() {
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            gainNode = audioContext.createGain();
            gainNode.gain.value = 0.1;
            gainNode.connect(audioContext.destination);
        } catch (e) {
            console.error('Web Audio API is not supported in this browser', e);
            handleAudioError('Web Audio API is not supported in this browser. Please try a different browser.');
            return false;
        }
    }
    return true;
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
    if (!initAudio()) {
        return; // Exit if audio initialization failed
    }

    if (isPlaying) {
        oscillatorLeft.stop();
        oscillatorRight.stop();
        toggleButton.textContent = 'Start';
        toggleButton.setAttribute('aria-pressed', 'false');
    } else {
        try {
            createOscillators();
            oscillatorLeft.start();
            oscillatorRight.start();
            toggleButton.textContent = 'Stop';
            toggleButton.setAttribute('aria-pressed', 'true');
        } catch (e) {
            console.error('Error starting audio', e);
            handleAudioError('An error occurred while starting the audio. Please refresh the page and try again.');
            return;
        }
    }
    isPlaying = !isPlaying;
}

// Initial check for Web Audio API support
if (!window.AudioContext && !window.webkitAudioContext) {
    handleAudioError('Web Audio API is not supported in this browser. Please try a different browser.');
}
