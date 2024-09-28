let oscillatorLeft;
let oscillatorRight;
let isPlaying = false;

const baseFrequencyInput = document.getElementById('baseFrequency');
const beatFrequencyInput = document.getElementById('beatFrequency');
const toggleButton = document.getElementById('toggleButton');

baseFrequencyInput.addEventListener('input', updateFrequency);
beatFrequencyInput.addEventListener('input', updateFrequency);
toggleButton.addEventListener('click', toggleSound);

function initAudio() {
    if (!oscillatorLeft || !oscillatorRight) {
        oscillatorLeft = new Tone.Oscillator().toDestination();
        oscillatorRight = new Tone.Oscillator().toDestination();

        // Set initial pan for each oscillator
        oscillatorLeft.set({ pan: -1 });
        oscillatorRight.set({ pan: 1 });

        // Set initial volume (gain)
        Tone.Destination.volume.value = -20; // This is equivalent to a gain of 0.1
    }
    updateFrequency();
}

function updateFrequency() {
    const baseFrequency = parseFloat(baseFrequencyInput.value);
    const beatFrequency = parseFloat(beatFrequencyInput.value);

    document.getElementById('baseFrequencyValue').textContent = baseFrequency;
    document.getElementById('beatFrequencyValue').textContent = beatFrequency;

    if (oscillatorLeft && oscillatorRight) {
        oscillatorLeft.frequency.value = baseFrequency;
        oscillatorRight.frequency.value = baseFrequency + beatFrequency;
    }
}

async function toggleSound() {
    try {
        await Tone.start();
    } catch (error) {
        console.error('Failed to start audio:', error);
        handleAudioError('Failed to start audio. Please check your audio settings and try again.');
        return;
    }

    if (!oscillatorLeft || !oscillatorRight) {
        initAudio();
    }

    if (isPlaying) {
        oscillatorLeft.stop();
        oscillatorRight.stop();
        toggleButton.textContent = 'Start';
        toggleButton.setAttribute('aria-pressed', 'false');
    } else {
        oscillatorLeft.start();
        oscillatorRight.start();
        toggleButton.textContent = 'Stop';
        toggleButton.setAttribute('aria-pressed', 'true');
    }
    isPlaying = !isPlaying;
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

// Initial setup
initAudio();
