const infoButton = document.getElementById('infoButton');
const infoModal = document.getElementById('infoModal');
const closeModal = document.getElementById('closeModal');
const modalContent = document.getElementById('modalContent');

const brainwaveInfo = {
    delta: "Delta waves (0.5-4 Hz): Associated with deep, dreamless sleep and restorative rest. In this state, the body heals and regenerates tissues, and the mind is in a state of unconsciousness.",
    theta: "Theta waves (4-8 Hz): Occur during light sleep or deep meditation. This state is associated with creativity, intuition, and the transition between wakefulness and sleep. Vivid imagery and deep insights can occur.",
    alpha: "Alpha waves (8-13 Hz): Present during states of relaxed awareness, such as light meditation or daydreaming. This state promotes calmness, reduces stress, and enhances learning and memory.",
    beta: "Beta waves (13-30 Hz): The normal waking state of consciousness. Associated with active thinking, problem-solving, and focused mental activity. Higher beta frequencies can indicate stress or anxiety.",
    gamma: "Gamma waves (30-100 Hz): The fastest brainwave frequency. Associated with peak concentration, high-level information processing, and moments of insight. May be linked to heightened perception and consciousness.",
    custom: "Custom range: Allows you to explore frequencies outside the predefined brainwave states. This can be useful for experimentation or targeting specific frequencies for personal preferences."
};

function showModal() {
    let content = "<ul>";
    for (const [ state, description ] of Object.entries(brainwaveInfo)) {
        content += `<li><strong>${state.charAt(0).toUpperCase() + state.slice(1)}:</strong> ${description}</li>`;
    }
    content += "</ul>";

    modalContent.innerHTML = content;
    infoModal.setAttribute('aria-hidden', 'false');
    infoModal.style.display = 'flex';
}

function hideModal() {
    infoModal.setAttribute('aria-hidden', 'true');
    infoModal.style.display = 'none';
}

infoButton.addEventListener('click', showModal);
closeModal.addEventListener('click', hideModal);

infoModal.addEventListener('click', (event) => {
    if (event.target === infoModal) {
        hideModal();
    }
});

// Keyboard accessibility
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && infoModal.style.display === 'flex') {
        hideModal();
    }
});
