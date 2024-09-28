let oscillatorLeft;
let oscillatorRight;
let isPlaying = false;

const baseFrequencyInput = document.getElementById('baseFrequency');
const beatFrequencyInput = document.getElementById('beatFrequency');
const toggleButton = document.getElementById('toggleButton');
const brainwaveStateSelect = document.getElementById('brainwaveState');

const brainwaveRanges = {
    delta: { min: 0.5, max: 4 },
    theta: { min: 4, max: 8 },
    alpha: { min: 8, max: 13 },
    beta: { min: 13, max: 30 },
    gamma: { min: 30, max: 100 },
    custom: { min: 0.5, max: 100 }
};

baseFrequencyInput.addEventListener('input', updateFrequency);
beatFrequencyInput.addEventListener('input', updateFrequency);
toggleButton.addEventListener('click', toggleSound);
brainwaveStateSelect.addEventListener('change', updateBrainwaveState);

function initAudio() {
    if (!oscillatorLeft || !oscillatorRight) {
        oscillatorLeft = new Tone.Oscillator().toDestination();
        oscillatorRight = new Tone.Oscillator().toDestination();

        oscillatorLeft.set({ pan: -1 });
        oscillatorRight.set({ pan: 1 });

        Tone.Destination.volume.value = -20;
    }
    updateFrequency();
}

function updateFrequency() {
    const baseFrequency = parseFloat(baseFrequencyInput.value);
    const beatFrequency = parseFloat(beatFrequencyInput.value);

    document.getElementById('baseFrequencyValue').textContent = baseFrequency;
    document.getElementById('beatFrequencyValue').textContent = beatFrequency.toFixed(1);

    if (oscillatorLeft && oscillatorRight) {
        oscillatorLeft.frequency.value = baseFrequency;
        oscillatorRight.frequency.value = baseFrequency + beatFrequency;
    }
}

function updateBrainwaveState() {
    const selectedState = brainwaveStateSelect.value;
    const range = brainwaveRanges[ selectedState ];

    beatFrequencyInput.min = range.min;
    beatFrequencyInput.max = range.max;
    beatFrequencyInput.value = (range.min + range.max) / 2;

    updateFrequency();
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
    baseFrequencyInput.disabled = true;
    beatFrequencyInput.disabled = true;
    toggleButton.disabled = true;
    brainwaveStateSelect.disabled = true;

    const errorDiv = document.createElement('div');
    errorDiv.textContent = message;
    errorDiv.style.color = 'red';
    errorDiv.style.marginTop = '1rem';
    document.querySelector('.container').appendChild(errorDiv);
}

// Initial setup
initAudio();
updateBrainwaveState();
