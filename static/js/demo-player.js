/**
 * demo-player.js — Animated replay of attack/response scenarios
 */

// Track which scenarios have been played
const playedScenarios = new Set();

/**
 * Switch between demo scenario tabs.
 */
function switchScenario(index) {
    // Update tabs
    document.querySelectorAll('.demo-player__tab').forEach(tab => {
        tab.classList.toggle('demo-player__tab--active', parseInt(tab.dataset.scenario) === index);
    });

    // Update scenario panels
    document.querySelectorAll('.demo-player__scenario').forEach(panel => {
        panel.classList.toggle('demo-player__scenario--active', parseInt(panel.dataset.scenarioId) === index);
    });
}

/**
 * Play the animated replay for a scenario.
 * Shows: user message → typing indicator → model response → annotation.
 */
function playScenario(index) {
    const chat = document.getElementById(`chat-${index}`);
    if (!chat) return;

    const scenario = scenarioData[index];
    if (!scenario) return;

    // Clear previous messages
    chat.innerHTML = '';

    // Disable the play button during animation
    const controls = chat.closest('.demo-player__scenario').querySelector('.btn--filled');
    if (controls) {
        controls.disabled = true;
        controls.innerHTML = '<span class="material-symbols-outlined">hourglass_top</span> Playing...';
    }

    // Step 1: Show user message (attacker prompt)
    setTimeout(() => {
        const userMsg = createMessage('user', scenario.attack_prompt);
        chat.appendChild(userMsg);
        chat.scrollTop = chat.scrollHeight;
    }, 300);

    // Step 2: Show typing indicator
    setTimeout(() => {
        const typing = createTypingIndicator();
        typing.id = `typing-${index}`;
        chat.appendChild(typing);
        chat.scrollTop = chat.scrollHeight;
    }, 800);

    // Step 3: Replace typing with model response
    const responseDelay = 800 + 1200 + Math.min(scenario.model_response.length * 8, 2000);
    setTimeout(() => {
        const typing = document.getElementById(`typing-${index}`);
        if (typing) typing.remove();

        const modelMsg = createMessage('model', scenario.model_response);
        chat.appendChild(modelMsg);
        chat.scrollTop = chat.scrollHeight;
    }, responseDelay);

    // Step 4: Show annotation
    setTimeout(() => {
        const annotation = createAnnotation(scenario.annotation, scenario.success);
        chat.appendChild(annotation);
        chat.scrollTop = chat.scrollHeight;

        // Re-enable play button
        if (controls) {
            controls.disabled = false;
            controls.innerHTML = '<span class="material-symbols-outlined">replay</span> Replay';
        }

        playedScenarios.add(index);
    }, responseDelay + 600);
}

/**
 * Create a chat message element.
 */
function createMessage(role, text) {
    const msg = document.createElement('div');
    msg.className = `demo-player__message demo-player__message--${role}`;

    // Process text: handle code blocks and inline code
    let processed = escapeHtml(text);

    // Handle code blocks (```...```)
    processed = processed.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
        return `<pre><code>${code.trim()}</code></pre>`;
    });

    // Handle inline code
    processed = processed.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Handle newlines
    processed = processed.replace(/\n/g, '<br>');

    msg.innerHTML = processed;
    return msg;
}

/**
 * Create a typing indicator (three bouncing dots).
 */
function createTypingIndicator() {
    const container = document.createElement('div');
    container.className = 'demo-player__message demo-player__message--model';
    container.style.cssText = 'display:flex;gap:4px;padding:16px 20px;align-items:center;';
    container.innerHTML = `
    <span style="width:8px;height:8px;background:var(--md-sys-color-on-surface-variant);border-radius:50%;animation:bounce 1.2s infinite;opacity:0.4"></span>
    <span style="width:8px;height:8px;background:var(--md-sys-color-on-surface-variant);border-radius:50%;animation:bounce 1.2s infinite 0.2s;opacity:0.4"></span>
    <span style="width:8px;height:8px;background:var(--md-sys-color-on-surface-variant);border-radius:50%;animation:bounce 1.2s infinite 0.4s;opacity:0.4"></span>
  `;

    // Add bounce keyframes if not already present
    if (!document.getElementById('bounce-keyframes')) {
        const style = document.createElement('style');
        style.id = 'bounce-keyframes';
        style.textContent = `
      @keyframes bounce {
        0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
        30% { transform: translateY(-6px); opacity: 1; }
      }
    `;
        document.head.appendChild(style);
    }

    return container;
}

/**
 * Create an annotation callout.
 */
function createAnnotation(text, isVulnerable) {
    const el = document.createElement('div');
    el.className = `demo-player__annotation ${isVulnerable ? '' : 'demo-player__annotation--success'}`;
    el.innerHTML = `
    <span class="material-symbols-outlined" style="font-size:20px;flex-shrink:0;margin-top:2px">
      ${isVulnerable ? 'warning' : 'verified'}
    </span>
    <span>${escapeHtml(text)}</span>
  `;
    return el;
}

/**
 * Escape HTML entities.
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// --- Quiz Functions ---

/**
 * Select a quiz option.
 */
function selectQuizOption(optionEl) {
    const quiz = optionEl.closest('.quiz');
    quiz.querySelectorAll('.quiz__option').forEach(opt => {
        opt.classList.remove('quiz__option--selected');
    });
    optionEl.classList.add('quiz__option--selected');
}

/**
 * Check quiz answer.
 */
function checkQuiz(quizEl) {
    const correctAnswer = parseInt(quizEl.dataset.answer);
    const selected = quizEl.querySelector('.quiz__option--selected');

    if (!selected) return;

    const selectedValue = parseInt(selected.dataset.option);

    // Clear previous states
    quizEl.querySelectorAll('.quiz__option').forEach(opt => {
        opt.classList.remove('quiz__option--correct', 'quiz__option--wrong');
    });

    if (selectedValue === correctAnswer) {
        selected.classList.add('quiz__option--correct');
    } else {
        selected.classList.add('quiz__option--wrong');
        // Highlight correct answer
        quizEl.querySelector(`[data-option="${correctAnswer}"]`).classList.add('quiz__option--correct');
    }
}
